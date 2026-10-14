import { useEffect, useRef, useState } from 'react'
import TeeGraphic from './TeeGraphic.jsx'

// Neke fotografije imaju mnogo providnog prostora oko komada (npr. široka slika majice),
// pa bi na kartici izgledale upola manje od ostalih. Zato se jednom po slici, na umanjenoj
// kopiji, izmjeri gdje je stvarni komad, a slika se uveća tako da komad (a ne prazan okvir)
// popuni predviđeni prostor. Slike bez providnosti ostaju kakve jesu.
const boxes = new Map() // src → { x, y, w, h } kao dio slike (0..1), ili null

function measure(img) {
  const size = 96
  const ratio = size / Math.max(img.naturalWidth, img.naturalHeight)
  const w = Math.max(1, Math.round(img.naturalWidth * ratio))
  const h = Math.max(1, Math.round(img.naturalHeight * ratio))
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(img, 0, 0, w, h)
  const { data } = ctx.getImageData(0, 0, w, h) // baca grešku ako server ne dozvoli čitanje (CORS)

  let minX = w
  let minY = h
  let maxX = -1
  let maxY = -1
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] < 16) continue
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
    }
  }
  if (maxX < 0) return null
  return { x: minX / w, y: minY / h, w: (maxX - minX + 1) / w, h: (maxY - minY + 1) / h }
}

// Uvećanje i pomjeraj (u % same slike) da komad stane u okvir kao kod object-contain
function fitTransform(img, box) {
  const W = img.naturalWidth
  const H = img.naturalHeight
  const cw = img.clientWidth
  const ch = img.clientHeight
  const f = Math.min(cw / W, ch / H)
  const k = Math.min(cw / (box.w * W * f), ch / (box.h * H * f), 2.5)
  if (k < 1.04) return ''
  const dx = ((box.x + box.w / 2 - 0.5) * W * f * 100) / cw
  const dy = ((box.y + box.h / 2 - 0.5) * H * f * 100) / ch
  return `scale(${k.toFixed(3)}) translate(${(-dx).toFixed(2)}%, ${(-dy).toFixed(2)}%)`
}

// Fotografija proizvoda (po defaultu prva) ako postoji, inače SVG ilustracija.
// `style` se prosljeđuje jer se preko njega postavlja view-transition-name —
// to je ono što sliku "prenosi" sa liste na stranicu proizvoda.
export default function ProductImage({ product, index = 0, className = '', style }) {
  const src = product.images?.[index]
  const ref = useRef(null)
  const [fit, setFit] = useState(null) // null = još se mjeri, '' = ne treba uvećanje

  useEffect(() => {
    const img = ref.current
    if (!img || !src) return
    const apply = () => {
      if (!img.naturalWidth || !img.clientWidth) return
      if (!boxes.has(src)) {
        try {
          boxes.set(src, measure(img))
        } catch {
          boxes.set(src, null)
        }
      }
      const box = boxes.get(src)
      setFit(box ? fitTransform(img, box) : '')
    }
    const failed = () => setFit('')
    const observer = new ResizeObserver(apply)
    observer.observe(img)
    img.addEventListener('load', apply)
    img.addEventListener('error', failed)
    if (img.complete) apply()
    return () => {
      observer.disconnect()
      img.removeEventListener('load', apply)
      img.removeEventListener('error', failed)
    }
  }, [src])

  if (src) {
    return (
      <img
        ref={ref}
        src={src}
        alt={product.name}
        loading="lazy"
        crossOrigin="anonymous"
        // dok se ne izmjeri, slika se ne prikazuje, da ne "skoči" iz male u veliku
        style={{ ...style, transform: fit || undefined, visibility: fit === null ? 'hidden' : undefined }}
        className={`object-contain ${className}`}
      />
    )
  }
  return <TeeGraphic {...product} style={style} className={className} />
}
