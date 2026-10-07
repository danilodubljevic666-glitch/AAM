export const PRODUCT_COLUMNS = 'id, slug, name, price, category, tag, sizes, description, images, color, ink, print'
export const ADMIN_COLUMNS = `${PRODUCT_COLUMNS}, active, sort_order, created_at`
export const IMAGE_BUCKET = 'product-images'

// Moraju da se poklapaju sa client/src/lib/categories.js i admin formom
const CATEGORIES = ['Majice', 'Duksevi', 'Kačketi', 'Komplet']
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'UNI'] // UNI = univerzalna (kačketi)
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const IMAGE_RE = /^(https?:\/\/|\/)/

// Proverava podatke iz admin forme; vraća { value } ili { error }
export function parseProduct(body) {
  const b = body ?? {}
  const text = (v) => String(v ?? '').trim()

  const value = {
    name: text(b.name),
    slug: text(b.slug),
    price: Number(b.price),
    category: text(b.category),
    tag: text(b.tag) || null,
    description: text(b.description),
    sizes: Array.isArray(b.sizes) ? SIZES.filter((s) => b.sizes.includes(s)) : [],
    images: Array.isArray(b.images) ? b.images.filter((u) => typeof u === 'string' && IMAGE_RE.test(u)).slice(0, 10) : [],
    active: b.active !== false,
    sort_order: Number(b.sort_order ?? 0),
  }

  if (!value.name || value.name.length > 80) return { error: 'Naziv je obavezan (do 80 znakova)' }
  if (!SLUG_RE.test(value.slug)) return { error: 'Slug smije da sadrži samo mala slova, brojeve i crtice' }
  if (!Number.isInteger(value.price) || value.price < 0) return { error: 'Neispravna cijena' }
  if (!CATEGORIES.includes(value.category)) return { error: `Izaberi kategoriju: ${CATEGORIES.join(', ')}` }
  if (!value.sizes.length) return { error: 'Izaberi bar jednu veličinu' }
  if (!Number.isInteger(value.sort_order)) return { error: 'Redoslijed mora biti cio broj' }
  return { value }
}
