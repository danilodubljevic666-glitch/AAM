import TeeGraphic from './TeeGraphic.jsx'

// Fotografija proizvoda (po defaultu prva) ako postoji, inače SVG ilustracija.
// `style` se prosljeđuje jer se preko njega postavlja view-transition-name —
// to je ono što sliku "prenosi" sa liste na stranicu proizvoda.
export default function ProductImage({ product, index = 0, className = '', style }) {
  const src = product.images?.[index]
  if (src) {
    return <img src={src} alt={product.name} loading="lazy" style={style} className={`object-contain ${className}`} />
  }
  return <TeeGraphic {...product} style={style} className={className} />
}
