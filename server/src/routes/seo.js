import { Router } from 'express'
import { supabase } from '../lib/supabase.js'
import { PRODUCT_COLUMNS } from '../lib/products.js'

const router = Router()

// Stranice koje smiju u Google (korpa, narudžba i /admin ne idu)
const STATIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/shop', priority: '0.9', changefreq: 'daily' },
  { path: '/o-nama', priority: '0.6', changefreq: 'monthly' },
  { path: '/kontakt', priority: '0.6', changefreq: 'monthly' },
]

const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

// Adresa sajta za canonical/og:url. SITE_URL je ako hoćeš da je fiksiraš;
// bez nje se čita iz samog zahtjeva. Protokol se ne uzima iz req.protocol jer
// zavisi od TRUST_PROXY — na internetu je uvijek https, lokalno http.
const siteUrl = (req) => {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/+$/, '')
  const host = req.get('host') ?? 'localhost'
  const lokalno = /^(localhost|127\.|\[::1\])/.test(host)
  return `${lokalno ? 'http' : 'https'}://${host}`
}

async function activeProducts() {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('active', true)
    .order('sort_order')
    .order('id')
  if (error) throw error
  return data ?? []
}

// GET /sitemap.xml — statične stranice + svaka aktivna majica.
// Pravi se u trenutku poziva, pa nova majica iz admin panela odmah uđe,
// bez novog deploya.
router.get('/sitemap.xml', async (req, res, next) => {
  try {
    const base = siteUrl(req)
    const today = new Date().toISOString().slice(0, 10)

    let products = []
    try {
      products = await activeProducts()
    } catch (err) {
      // baza ne radi — bolje sitemap samo sa statičnim stranicama nego greška 500
      console.error('Sitemap: proizvodi nisu učitani:', err.message)
    }

    const urls = [
      ...STATIC_ROUTES.map(
        (r) =>
          `  <url><loc>${base}${r.path}</loc><lastmod>${today}</lastmod>` +
          `<changefreq>${r.changefreq}</changefreq><priority>${r.priority}</priority></url>`,
      ),
      ...products.map(
        (p) =>
          `  <url><loc>${base}/shop/${esc(p.slug)}</loc>` +
          `<lastmod>${(p.updated_at ?? p.created_at ?? today).toString().slice(0, 10)}</lastmod>` +
          `<changefreq>weekly</changefreq><priority>0.8</priority></url>`,
      ),
    ]

    res.type('application/xml').send(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
    )
  } catch (err) {
    next(err)
  }
})

// ——————————————————————————————————————————————————————————————
// GET /shop/:slug — SAMO za programe koji prave pregled linka
// (Instagram, WhatsApp, Viber, Facebook, Messenger...).
//
// Zašto postoji: sajt je React aplikacija — naslov i sliku upisuje JavaScript,
// a ti programi JavaScript ne pokreću. Bez ovoga bi svaka podijeljena majica
// pokazivala istu opštu sliku. Vercel ovamo šalje samo te programe
// (uslov po User-Agent-u u vercel.json); pravi posjetioci dobijaju sajt kao i do sad.
// Googlebot namjerno NIJE na tom spisku — on pokreće JavaScript i vidi pravu stranicu.
// ——————————————————————————————————————————————————————————————
const EUR = new Intl.NumberFormat('sr-Latn-ME', { style: 'currency', currency: 'EUR' })

router.get('/shop/:slug', async (req, res, next) => {
  try {
    const base = siteUrl(req)
    const url = `${base}/shop/${encodeURIComponent(req.params.slug)}`

    let product = null
    if (supabase) {
      const { data } = await supabase
        .from('products')
        .select(PRODUCT_COLUMNS)
        .eq('slug', req.params.slug)
        .eq('active', true)
        .maybeSingle()
      product = data
    }

    // Majice nema (ili baza ne radi) — vrati opšti pregled, nikad grešku
    const naslov = product ? `${product.name} — 2AM` : '2AM — Same city, different thoughts'
    const cijena = product ? (product.sale_price ?? product.price) : null
    // Neki proizvodi nemaju upisan opis — tad ide rečenica o brendu, da pregled ne počne cijenom
    const opisProizvoda = product?.description?.trim() || 'Teški pamuk, jaki printovi, male serije.'
    const opis = product
      ? `${opisProizvoda} ${cijena ? `Cijena: ${EUR.format(cijena / 100)}.` : ''} Plaćanje pouzećem, dostava širom Crne Gore.`.replace(/\s+/g, ' ').trim()
      : 'Majice za one koji su budni kad svi drugi spavaju. Teški pamuk, jaki printovi, dostava širom Crne Gore.'

    const prvaSlika = product?.images?.[0]
    const slika = prvaSlika ? (prvaSlika.startsWith('http') ? prvaSlika : base + prvaSlika) : `${base}/og.jpg`

    res.type('html').send(`<!doctype html>
<html lang="sr-Latn-ME">
<head>
<meta charset="utf-8">
<title>${esc(naslov)}</title>
<meta name="description" content="${esc(opis)}">
<link rel="canonical" href="${esc(url)}">
<meta property="og:type" content="${product ? 'product' : 'website'}">
<meta property="og:site_name" content="2AM">
<meta property="og:locale" content="sr_ME">
<meta property="og:title" content="${esc(naslov)}">
<meta property="og:description" content="${esc(opis)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(slika)}">
<meta property="og:image:alt" content="${esc(product?.name ?? '2AM')}">
${cijena ? `<meta property="product:price:amount" content="${(cijena / 100).toFixed(2)}">
<meta property="product:price:currency" content="EUR">
<meta property="product:availability" content="in stock">` : ''}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(naslov)}">
<meta name="twitter:description" content="${esc(opis)}">
<meta name="twitter:image" content="${esc(slika)}">
</head>
<body style="background:#0b0b0d;color:#f2efe8;font-family:system-ui,sans-serif;text-align:center;padding:3rem 1.5rem">
<img src="${esc(slika)}" alt="${esc(product?.name ?? '2AM')}" width="320" style="max-width:100%;height:auto">
<h1>${esc(product?.name ?? '2AM')}</h1>
${cijena ? `<p>${esc(EUR.format(cijena / 100))}</p>` : ''}
<p>${esc(opis)}</p>
<p><a href="${esc(url)}" style="color:#ff3b2f">Otvori na sajtu</a></p>
</body>
</html>
`)
  } catch (err) {
    next(err)
  }
})

export default router
