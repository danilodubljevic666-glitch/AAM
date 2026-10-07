import { supabase } from '../lib/supabase.js'

// Propušta samo prijavljene korisnike sa app_metadata.role = 'admin'
// (app_metadata može da menja samo server, ne i sam korisnik)
export async function requireAdmin(req, res, next) {
  try {
    if (!supabase) return res.status(503).json({ error: 'Baza nije podešena' })
    const token = req.headers.authorization?.match(/^Bearer (.+)$/)?.[1]
    if (!token) return res.status(401).json({ error: 'Niste prijavljeni' })

    const { data, error } = await supabase.auth.getUser(token)
    if (error || !data.user) return res.status(401).json({ error: 'Sesija je istekla, prijavi se ponovo' })
    if (data.user.app_metadata?.role !== 'admin') return res.status(403).json({ error: 'Ovaj nalog nema admin prava' })

    req.user = data.user
    next()
  } catch (err) {
    next(err)
  }
}
