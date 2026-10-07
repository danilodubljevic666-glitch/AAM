import { Router } from 'express'
import { supabase } from '../lib/supabase.js'
import { isEmail } from '../lib/validate.js'

const router = Router()

// POST /api/contact — { name, email, message }; poruke su u Supabase tabeli contact_messages (do EmailJS-a)
router.post('/', async (req, res, next) => {
  try {
    if (!supabase) return res.status(503).json({ error: 'Baza nije podešena' })
    const b = req.body ?? {}

    // Skriveno polje koje ljudi ne vide — ako je popunjeno, šalje bot; glumimo uspeh
    if (b.website) return res.status(201).json({ ok: true })

    const name = String(b.name ?? '').trim()
    const email = String(b.email ?? '').trim().toLowerCase()
    const message = String(b.message ?? '').trim()
    if (!name || name.length > 100) return res.status(400).json({ error: 'Unesi ime (do 100 znakova)' })
    if (!isEmail(email)) return res.status(400).json({ error: 'Neispravan email' })
    if (message.length < 5 || message.length > 5000) {
      return res.status(400).json({ error: 'Poruka mora imati između 5 i 5000 znakova' })
    }

    const { error } = await supabase.from('contact_messages').insert({ name, email, message })
    if (error) throw error
    res.status(201).json({ ok: true })
  } catch (err) {
    next(err)
  }
})

export default router
