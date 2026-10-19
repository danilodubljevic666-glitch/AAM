import Anthropic from '@anthropic-ai/sdk'

// Prevod proizvoda (naziv, opis, oznaka) sa crnogorskog na engleski: dugme "Prevedi" u admin panelu.
// Sa ANTHROPIC_API_KEY u server/.env prevodi Claude (prirodniji tekst, zna da je "duks" hoodie);
// bez ključa, ili ako Claude ne odgovori, koristi se besplatni Google prevodilac (bez ključa).
const claude = process.env.ANTHROPIC_API_KEY ? new Anthropic() : null

// Za /api/health: koji prevodilac server trenutno koristi
export const translateProvider = claude ? 'claude' : 'google'

const SYSTEM = `You translate product listings for AAM Clothing (logo: 2AM), a streetwear brand from Nikšić, Montenegro, from Montenegrin into natural English for the brand's online shop.
- Keep brand names, collection names, numbers and product codes exactly as they are (2AM, 0317, Still Dreaming...).
- Clothing words: "majica" is a T-shirt, "duks" is a hoodie, "kačket" is a cap, "komplet" is a set.
- Keep the tone of the original: short, casual, confident. Do not add information that is not in the original.
- Do not use em dashes.
- If a field is empty in the input, return an empty string for it.`

const SCHEMA = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    description: { type: 'string' },
    tag: { type: 'string' },
  },
  required: ['name', 'description', 'tag'],
  additionalProperties: false,
}

async function viaClaude(fields) {
  const response = await claude.beta.messages.create({
    model: 'claude-opus-5-5',
    max_tokens: 16000,
    // ako Claude odbije zahtjev, API ga sam ponovi na preporučenom rezervnom modelu
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: 'low', format: { type: 'json_schema', schema: SCHEMA } },
    system: SYSTEM,
    messages: [{ role: 'user', content: JSON.stringify(fields) }],
  })
  if (response.stop_reason === 'refusal') throw new Error('Claude je odbio zahtjev')
  const text = response.content.find((b) => b.type === 'text')?.text
  if (!text) throw new Error(`Claude nije vratio prevod (${response.stop_reason})`)
  return JSON.parse(text)
}

// Neslužbeni, ali široko korišćen Google endpoint. sl=sr, jer automatsko prepoznavanje
// jezika promaši kratke nazive ("2AM Duks" ostane neprevedeno).
const GOOGLE_URL = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=sr&tl=en&dt=t'

async function googleRequest(text) {
  const res = await fetch(GOOGLE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body: new URLSearchParams({ q: text }),
    signal: AbortSignal.timeout(10_000),
  })
  if (!res.ok) throw new Error(`Google prevodilac je odgovorio ${res.status}`)
  const data = await res.json()
  if (!Array.isArray(data?.[0])) throw new Error('Google prevodilac je vratio neočekivan odgovor')
  return data[0].map((segment) => segment[0]).join('').trim()
}

// Jedan ponovni pokušaj: server koji dugo radi zna da naleti na vezu koju je Google u
// međuvremenu zatvorio ("fetch failed"), ili na kratko ograničenje sa Google strane (429)
async function googleTranslate(text) {
  if (!text) return ''
  let out
  try {
    out = await googleRequest(text)
  } catch (err) {
    console.warn('Google prevod nije uspio, pokušavam ponovo:', translateErrorReason(err))
    await new Promise((resolve) => setTimeout(resolve, 800))
    out = await googleRequest(text)
  }
  // Google zna da rastavi naziv brenda ("2AM" → "2 AM")
  return text.includes('2AM') ? out.replace(/\b2 AM\b/g, '2AM') : out
}

// Jedno po jedno polje, da Google ne dobije nalet zahtjeva (dugme "Prevedi sve" ide kroz više proizvoda)
async function viaGoogle({ name, description, tag }) {
  return {
    name: await googleTranslate(name),
    description: await googleTranslate(description),
    tag: await googleTranslate(tag),
  }
}

// Kratak razlog greške za poruku u admin panelu, npr. "ECONNRESET" ili "Google prevodilac je odgovorio 429"
export function translateErrorReason(err) {
  return err?.cause?.code || err?.cause?.message || err?.message || 'nepoznata greška'
}

// fields = { name, description, tag } na crnogorskom → isti oblik na engleskom
export async function translateProduct(fields) {
  if (claude) {
    try {
      return await viaClaude(fields)
    } catch (err) {
      console.error('Claude prevod nije uspio, koristim Google:', err.message)
    }
  }
  return viaGoogle(fields)
}
