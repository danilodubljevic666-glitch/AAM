import { useState } from 'react'
import { api } from '../../lib/api.js'
import { CATEGORIES } from '../../lib/categories.js'
import { supabase } from '../../lib/supabase.js'
import { inputClass, labelClass, primaryButton, secondaryButton } from '../formStyles.js'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'UNI'] // UNI = univerzalna (kačketi)
const DEFAULT_SIZES = ['S', 'M', 'L', 'XL']
const TAGS = ['Novo', 'Bestseller', 'Limitirano']
const MAX_SIDE = 1600 // px — veće slike se smanjuju pre uploada

const EMPTY = { name: '', slug: '', price: '', category: '', tag: '', sizes: DEFAULT_SIZES, description: '', images: [], active: true, sort_order: 0 }
const isCategory = (name) => CATEGORIES.some((c) => c.name === name)

// "Still Dreaming Tee" → "still-dreaming-tee", "Nikšić Žuta" → "niksic-zuta"
const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/đ/g, 'dj')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

// Smanjuje sliku i pretvara je u WebP (providnost ostaje); ako browser ne ume WebP, šalje original
async function prepareImage(file) {
  const bitmap = await createImageBitmap(file).catch(() => {
    throw new Error('format slike nije podržan')
  })
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', 0.88))
  return blob?.type === 'image/webp' ? blob : file
}

export default function ProductForm({ product, token, onCancel, onSaved }) {
  // U bazi je cena u centima, u formi u evrima; stara kategorija (npr. "Oversized") mora ponovo da se izabere
  const [form, setForm] = useState(() =>
    product
      ? { ...product, price: product.price / 100, tag: product.tag ?? '', category: isCategory(product.category) ? product.category : '' }
      : EMPTY,
  )
  const [slugTouched, setSlugTouched] = useState(Boolean(product))
  const [uploading, setUploading] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const setName = (e) => {
    const name = e.target.value
    setForm((f) => ({ ...f, name, slug: slugTouched ? f.slug : slugify(name) }))
  }

  // Kačketi su obično jedne veličine — pri izboru kategorije predloži UNI, i obrnuto
  const setCategory = (e) => {
    const category = e.target.value
    setForm((f) => {
      const onlyUni = f.sizes.length === 1 && f.sizes[0] === 'UNI'
      const sizes = category === 'Kačketi' ? ['UNI'] : onlyUni ? DEFAULT_SIZES : f.sizes
      return { ...f, category, sizes }
    })
  }

  const toggleSize = (s) =>
    setForm((f) => ({ ...f, sizes: f.sizes.includes(s) ? f.sizes.filter((x) => x !== s) : [...f.sizes, s] }))

  const upload = async (files) => {
    setError(null)
    setUploading((n) => n + files.length)
    for (const file of files) {
      try {
        const blob = await prepareImage(file)
        const { bucket, path, token: uploadToken, publicUrl } = await api('/admin/uploads', {
          method: 'POST',
          token,
          body: JSON.stringify({ contentType: blob.type }),
        })
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .uploadToSignedUrl(path, uploadToken, blob, { contentType: blob.type })
        if (uploadError) throw uploadError
        setForm((f) => ({ ...f, images: [...f.images, publicUrl] }))
      } catch (err) {
        setError(`${file.name}: ${err.message}`)
      } finally {
        setUploading((n) => n - 1)
      }
    }
  }

  const removeImage = (url) => setForm((f) => ({ ...f, images: f.images.filter((u) => u !== url) }))
  const makeMain = (url) => setForm((f) => ({ ...f, images: [url, ...f.images.filter((u) => u !== url)] }))

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const body = JSON.stringify({ ...form, price: Math.round(Number(form.price) * 100), sort_order: Number(form.sort_order) })
      if (product) await api(`/admin/products/${product.id}`, { method: 'PATCH', token, body })
      else await api('/admin/products', { method: 'POST', token, body })
      await onSaved()
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit}>
      <button type="button" onClick={onCancel} className="font-mono text-xs uppercase tracking-widest text-ash hover:text-alarm">
        ← Nazad na listu
      </button>
      <h1 className="mt-4 font-display text-5xl uppercase sm:text-6xl">{product ? product.name : 'Nova majica'}</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_420px]">
        <div className="space-y-6">
          <label className="block">
            <span className={labelClass}>Naziv *</span>
            <input required maxLength={80} value={form.name} onChange={setName} placeholder="npr. Still Dreaming" className={inputClass} />
          </label>

          <label className="block">
            <span className={labelClass}>Adresa (slug) *</span>
            <div className="mt-2 flex items-center border border-night-600 focus-within:border-bone">
              <span className="pl-4 font-mono text-sm text-ash">/shop/</span>
              <input
                required
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true)
                  set('slug')(e)
                }}
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                title="Samo mala slova, brojevi i crtice"
                className="w-full bg-transparent py-3 pr-4 font-mono text-sm outline-none"
              />
            </div>
          </label>

          <div className="grid gap-6 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass}>Cijena (€) *</span>
              <input required type="number" min="0" step="0.01" value={form.price} onChange={set('price')} placeholder="29.90" className={inputClass} />
            </label>
            <label className="block">
              <span className={labelClass}>Kategorija *</span>
              <select required value={form.category} onChange={setCategory} className={inputClass}>
                <option value="" disabled>
                  Izaberi…
                </option>
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass}>Oznaka</span>
              <input list="admin-tags" value={form.tag} onChange={set('tag')} placeholder="npr. Novo (opciono)" className={inputClass} />
              <datalist id="admin-tags">
                {TAGS.map((t) => (
                  <option key={t} value={t} />
                ))}
              </datalist>
            </label>
            <label className="block">
              <span className={labelClass}>Redoslijed u shopu</span>
              <input type="number" step="1" value={form.sort_order} onChange={set('sort_order')} className={inputClass} />
              <span className="mt-1 block font-mono text-[11px] text-ash">Manji broj = prikazuje se ranije</span>
            </label>
          </div>

          <fieldset>
            <legend className={labelClass}>Veličine *</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSize(s)}
                  aria-pressed={form.sizes.includes(s)}
                  className={`h-11 min-w-12 border px-3 font-mono text-sm transition-colors ${
                    form.sizes.includes(s) ? 'border-bone bg-bone text-night' : 'border-night-600 hover:border-bone'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="block">
            <span className={labelClass}>Opis</span>
            <textarea rows={5} value={form.description} onChange={set('description')} className={`${inputClass} resize-y font-sans`} />
          </label>

          <label className="flex items-center gap-3">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} className="h-5 w-5 accent-alarm" />
            <span className="font-mono text-xs uppercase tracking-widest">Prikaži u shopu</span>
          </label>
        </div>

        <div>
          <span className={labelClass}>Slike</span>
          <div className="mt-2 grid grid-cols-2 gap-3">
            {form.images.map((url, i) => (
              <div key={url} className="group relative aspect-square border border-night-600 bg-night-800">
                <img src={url} alt="" className="h-full w-full object-contain p-2" />
                {i === 0 && (
                  <span className="absolute left-2 top-2 bg-alarm px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-night">Glavna</span>
                )}
                <div className="absolute inset-x-2 bottom-2 flex gap-2">
                  {i > 0 && (
                    <button type="button" onClick={() => makeMain(url)} className="flex-1 bg-night/90 py-1.5 font-mono text-[10px] uppercase tracking-widest hover:text-alarm">
                      Kao glavna
                    </button>
                  )}
                  <button type="button" onClick={() => removeImage(url)} className="flex-1 bg-night/90 py-1.5 font-mono text-[10px] uppercase tracking-widest hover:text-alarm">
                    Ukloni
                  </button>
                </div>
              </div>
            ))}
            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-night-600 text-center transition-colors hover:border-bone">
              <span className="font-display text-4xl">+</span>
              <span className="font-mono text-[11px] uppercase tracking-widest text-ash">{uploading ? `Otpremanje… (${uploading})` : 'Dodaj slike'}</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                multiple
                className="sr-only"
                onChange={(e) => {
                  upload([...e.target.files])
                  e.target.value = ''
                }}
              />
            </label>
          </div>
          <p className="mt-3 font-mono text-[11px] leading-relaxed text-ash">
            Prva slika se prikazuje u shopu. Najbolje izgledaju PNG/WebP slike sa providnom pozadinom. Velike slike se automatski smanjuju.
          </p>
        </div>
      </div>

      {error && <p className="mt-8 font-mono text-xs uppercase tracking-widest text-alarm">{error}</p>}

      <div className="mt-10 flex flex-wrap gap-4 border-t border-night-600 pt-8">
        <button disabled={saving || uploading > 0} className={primaryButton}>
          {saving ? 'Čuvanje…' : product ? 'Sačuvaj izmjene' : 'Dodaj majicu'}
        </button>
        <button type="button" onClick={onCancel} className={secondaryButton}>
          Otkaži
        </button>
      </div>
    </form>
  )
}
