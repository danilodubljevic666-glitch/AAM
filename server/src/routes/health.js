import { Router } from 'express'
import { emailStatus } from '../lib/email.js'
import { supabase } from '../lib/supabase.js'

const router = Router()

// GET /api/health — radi li server i da li vidi bazu i EmailJS ključeve (samo da/ne, bez vrijednosti)
router.get('/', (req, res) => {
  res.json({ status: 'ok', db: Boolean(supabase), email: emailStatus })
})

export default router
