import { Router } from 'express'
import { emailStatus } from '../lib/email.js'
import { supabase } from '../lib/supabase.js'
import { translateProvider } from '../lib/translate.js'

const router = Router()

// GET /api/health — radi li server i da li vidi bazu i EmailJS ključeve (samo da/ne, bez vrijednosti)
// translate: koji prevodilac koristi dugme "Prevedi" u admin panelu (google ili claude)
router.get('/', (req, res) => {
  res.json({ status: 'ok', db: Boolean(supabase), email: emailStatus, translate: translateProvider })
})

export default router
