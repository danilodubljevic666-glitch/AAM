import { randomBytes } from 'node:crypto'
import { Router } from 'express'
import { sendOrderEmail } from '../lib/email.js'
import { supabase } from '../lib/supabase.js'
import { isEmail } from '../lib/validate.js'

const router = Router()

// Iznosi u centima — moraju da se poklapaju sa client/src/lib/shipping.js
const FREE_SHIPPING = 5000 // 50 €
const SHIPPING_COST = 390 // 3,90 €

const PHONE_RE = /^\+?[\d\s/()-]{6,20}$/
const EUR = new Intl.NumberFormat('sr-Latn-ME', { style: 'currency', currency: 'EUR' })
const eur = (cents) => EUR.format(cents / 100)
const text = (v) => String(v ?? '').trim()
const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

function parseCustomer(b) {
  const c = {
    first_name: text(b.firstName),
    last_name: text(b.lastName),
    email: text(b.email).toLowerCase(),
    phone: text(b.phone),
    address: text(b.address),
    city: text(b.city),
  }
  if (!c.first_name || c.first_name.length > 60) return { error: 'Unesi ime' }
  if (!c.last_name || c.last_name.length > 60) return { error: 'Unesi prezime' }
  if (!isEmail(c.email)) return { error: 'Neispravan email' }
  if (!PHONE_RE.test(c.phone)) return { error: 'Neispravan broj telefona' }
  if (!c.address || c.address.length > 200) return { error: 'Unesi adresu' }
  if (!c.city || c.city.length > 80) return { error: 'Unesi grad' }
  return { value: c }
}

function parseItems(items) {
  if (!Array.isArray(items) || items.length === 0 || items.length > 50) return null
  const parsed = items.map((i) => ({ id: Number(i?.id), size: text(i?.size), qty: Number(i?.qty) }))
  const valid = parsed.every((i) => Number.isInteger(i.id) && i.size && Number.isInteger(i.qty) && i.qty >= 1 && i.qty <= 20)
  return valid ? parsed : null
}

// npr. "2AM-251007-4F1A9C" — čitljiv broj narudžbe za kupca i email
function newReference() {
  const d = new Date()
  const ymd = [d.getFullYear() % 100, d.getMonth() + 1, d.getDate()].map((n) => String(n).padStart(2, '0')).join('')
  return `2AM-${ymd}-${randomBytes(3).toString('hex').toUpperCase()}`
}

async function saveOrder(order) {
  if (!supabase) throw new Error('Baza nije podešena')
  const { error } = await supabase.from('orders').insert(order)
  if (error) throw error
}

function emailOrder(order) {
  const lines = order.items.map((l) => `${l.qty} × ${l.name} (${l.size}) — ${eur(l.price * l.qty)}`)
  return sendOrderEmail({
    reference: order.reference,
    customer_name: `${order.first_name} ${order.last_name}`,
    customer_email: order.email,
    customer_phone: order.phone,
    customer_address: order.address,
    customer_city: order.city,
    items: lines.join('\n'),
    items_html: lines.map(escapeHtml).join('<br>'), // u EmailJS šablonu: {{{items_html}}}
    subtotal: eur(order.subtotal),
    shipping: order.shipping ? eur(order.shipping) : 'Besplatna',
    total: eur(order.total),
    reply_to: order.email,
  })
}

// POST /api/orders — { customer: { firstName, lastName, email, phone, address, city }, items: [{ id, size, qty }] }
router.post('/', async (req, res, next) => {
  try {
    const b = req.body ?? {}
    // Skriveno polje koje ljudi ne vide — ako je popunjeno, šalje bot. Za razliku od kontakt forme ne glumimo
    // uspjeh: ako ga ikad popuni pravi kupac (npr. autofill), mora da vidi da narudžba nije prošla.
    if (b.website) return res.status(400).json({ error: 'Narudžba nije poslata. Osvježi stranicu i pokušaj ponovo.' })

    const { value: customer, error: invalid } = parseCustomer(b.customer ?? {})
    if (invalid) return res.status(400).json({ error: invalid })
    const items = parseItems(b.items)
    if (!items) return res.status(400).json({ error: 'Korpa je prazna ili neispravna' })
    if (!supabase) return res.status(503).json({ error: 'Baza nije podešena' })

    // Nazivi, cene i veličine uvek iz baze — ne verujemo ceni koju pošalje browser
    const ids = [...new Set(items.map((i) => i.id))]
    const { data: products, error } = await supabase.from('products').select('id, name, price, sizes').in('id', ids).eq('active', true)
    if (error) throw error
    const byId = new Map(products.map((p) => [p.id, p]))

    const lines = []
    for (const i of items) {
      const p = byId.get(i.id)
      if (!p || !p.sizes.includes(i.size)) {
        return res.status(409).json({ error: 'Neki proizvodi iz korpe više nisu dostupni. Osvježi stranicu i provjeri korpu.' })
      }
      lines.push({ id: p.id, name: p.name, size: i.size, qty: i.qty, price: p.price })
    }
    const subtotal = lines.reduce((n, l) => n + l.price * l.qty, 0)
    const shipping = subtotal >= FREE_SHIPPING ? 0 : SHIPPING_COST
    const order = { reference: newReference(), ...customer, items: lines, subtotal, shipping, total: subtotal + shipping }

    // Čuvanje u bazi i email idu paralelno; dovoljno je da uspe jedno od dvoje da narudžba ne propadne
    const [saved, emailed] = await Promise.allSettled([saveOrder(order), emailOrder(order)])
    if (saved.status === 'rejected') console.error(`Narudžba ${order.reference} nije sačuvana u bazi:`, saved.reason?.message)
    if (emailed.status === 'rejected') console.error(`Email za narudžbu ${order.reference} nije poslat:`, emailed.reason?.message)
    if (saved.status === 'rejected' && emailed.status === 'rejected') {
      return res.status(503).json({ error: 'Narudžba trenutno ne može da se pošalje. Pokušaj ponovo ili nas kontaktiraj.' })
    }

    res.status(201).json({ reference: order.reference, total: order.total })
  } catch (err) {
    next(err)
  }
})

export default router
