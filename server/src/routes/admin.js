import { randomUUID } from 'node:crypto'
import { Router } from 'express'
import { supabase } from '../lib/supabase.js'
import { ADMIN_COLUMNS, IMAGE_BUCKET, parseProduct } from '../lib/products.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()
router.use(requireAdmin)
router.param('id', (req, res, next, id) =>
  /^\d+$/.test(id) ? next() : res.status(404).json({ error: 'Proizvod ne postoji' }),
)

const UPLOAD_TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif' }

const conflict = (error) => error.code === '23505'

// Briše iz Storage-a slike koje su bile otpremljene u naš bucket
async function removeImages(urls) {
  const prefix = supabase.storage.from(IMAGE_BUCKET).getPublicUrl('').data.publicUrl
  const paths = urls.filter((u) => u.startsWith(prefix)).map((u) => u.slice(prefix.length))
  if (!paths.length) return
  const { error } = await supabase.storage.from(IMAGE_BUCKET).remove(paths)
  if (error) console.error('Brisanje slika nije uspelo:', error.message)
}

// GET /api/admin/products — svi proizvodi, i sakriveni
router.get('/products', async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('products').select(ADMIN_COLUMNS).order('sort_order').order('id')
    if (error) throw error
    res.json(data)
  } catch (err) {
    next(err)
  }
})

router.post('/products', async (req, res, next) => {
  try {
    const { value, error: invalid } = parseProduct(req.body)
    if (invalid) return res.status(400).json({ error: invalid })
    const { data, error } = await supabase.from('products').insert(value).select(ADMIN_COLUMNS).single()
    if (error && conflict(error)) return res.status(409).json({ error: 'Proizvod sa tim slugom već postoji' })
    if (error) throw error
    res.status(201).json(data)
  } catch (err) {
    next(err)
  }
})

router.patch('/products/:id', async (req, res, next) => {
  try {
    const { value, error: invalid } = parseProduct(req.body)
    if (invalid) return res.status(400).json({ error: invalid })

    const { data: old, error: findError } = await supabase.from('products').select('images').eq('id', req.params.id).maybeSingle()
    if (findError) throw findError
    if (!old) return res.status(404).json({ error: 'Proizvod ne postoji' })

    const { data, error } = await supabase.from('products').update(value).eq('id', req.params.id).select(ADMIN_COLUMNS).single()
    if (error && conflict(error)) return res.status(409).json({ error: 'Proizvod sa tim slugom već postoji' })
    if (error) throw error

    await removeImages(old.images.filter((u) => !value.images.includes(u)))
    res.json(data)
  } catch (err) {
    next(err)
  }
})

router.delete('/products/:id', async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('products').delete().eq('id', req.params.id).select('images').maybeSingle()
    if (error) throw error
    if (!data) return res.status(404).json({ error: 'Proizvod ne postoji' })
    await removeImages(data.images)
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

// POST /api/admin/uploads — { contentType }; vraća jednokratni potpisani link za upload slike
router.post('/uploads', async (req, res, next) => {
  try {
    const ext = UPLOAD_TYPES[req.body?.contentType]
    if (!ext) return res.status(400).json({ error: 'Dozvoljene su samo JPG, PNG, WebP i AVIF slike' })
    const path = `products/${randomUUID()}.${ext}`
    const { data, error } = await supabase.storage.from(IMAGE_BUCKET).createSignedUploadUrl(path)
    if (error) throw error
    const { publicUrl } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path).data
    res.json({ bucket: IMAGE_BUCKET, path, token: data.token, publicUrl })
  } catch (err) {
    next(err)
  }
})

export default router
