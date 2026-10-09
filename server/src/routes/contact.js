import { Router } from 'express'
import { sendContactEmail } from '../lib/email.js'
import { supabase } from '../lib/supabase.js'
import { isEmail } from '../lib/validate.js'

const router = Router()

// Šalje se širi skup promjenljivih nego što jedan šablon koristi — EmailJS ignoriše
// one koje mu ne trebaju, pa šablon može da koristi {{name}} ili {{from_name}}, svejedno.
// Obavezno: u EmailJS šablonu stavi Reply To = {{reply_to}}, da odgovor ide pravo kupcu.
function emailContact({ name, email, message }) {
  return sendContactEmail({
    name,
    from_name: name,
    email,
    from_email: email,
    reply_to: email,
    message,
    subject: `Nova poruka sa sajta — ${name}`,
    title: `Nova poruka sa sajta — ${name}`,
    time: new Date().toLocaleString('sr-Latn-ME', { timeZone: 'Europe/Podgorica' }),
  })
}

// POST /api/contact — { name, email, message }
// Poruka ide i u Supabase tabelu contact_messages i na email; dovoljno je da uspije jedno.
router.post('/', async (req, res, next) => {
  try {
    const b = req.body ?? {}

    // Skriveno polje koje ljudi ne vide — ako je popunjeno, šalje bot; glumimo uspjeh
    if (b.website) return res.status(201).json({ ok: true })

    const name = String(b.name ?? '').trim()
    const email = String(b.email ?? '').trim().toLowerCase()
    const message = String(b.message ?? '').trim()
    if (!name || name.length > 100) return res.status(400).json({ error: 'Unesi ime (do 100 znakova)' })
    if (!isEmail(email)) return res.status(400).json({ error: 'Neispravan email' })
    if (message.length < 5 || message.length > 5000) {
      return res.status(400).json({ error: 'Poruka mora imati između 5 i 5000 znakova' })
    }

    const saveToDb = async () => {
      if (!supabase) throw new Error('Baza nije podešena')
      const { error } = await supabase.from('contact_messages').insert({ name, email, message })
      if (error) throw error
    }

    const [saved, emailed] = await Promise.allSettled([saveToDb(), emailContact({ name, email, message })])
    if (saved.status === 'rejected') console.error('Poruka nije sačuvana u bazi:', saved.reason?.message)
    if (emailed.status === 'rejected') console.error('Poruka nije poslata na email:', emailed.reason?.message)
    if (saved.status === 'rejected' && emailed.status === 'rejected') {
      return res.status(503).json({ error: 'Poruka trenutno ne može da se pošalje. Pokušaj ponovo malo kasnije.' })
    }

    res.status(201).json({ ok: true })
  } catch (err) {
    next(err)
  }
})

export default router
