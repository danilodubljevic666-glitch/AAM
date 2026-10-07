import TeeGraphic from './TeeGraphic.jsx'

// Fotografija proizvoda (po defaultu prva) ako postoji, inače SVG ilustracija
export default function ProductImage({ product, index = 0, className = '' }) {
  const src = product.images?.[index]
  if (src) return <img src={src} alt={product.name} loading="lazy" className={`object-contain ${className}`} />
  return <TeeGraphic {...product} className={className} />
}
