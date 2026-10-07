import { Router } from 'express'
import { supabase } from '../lib/supabase.js'
import { PRODUCT_COLUMNS } from '../lib/products.js'

const router = Router()

// GET /api/products — aktivni proizvodi, redom kao u shopu
router.get('/', async (req, res, next) => {
  try {
    if (!supabase) return res.status(503).json({ error: 'Baza nije podešena' })
    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_COLUMNS)
      .eq('active', true)
      .order('sort_order')
      .order('id')
    if (error) throw error
    res.json(data)
  } catch (err) {
    next(err)
  }
})

export default router
