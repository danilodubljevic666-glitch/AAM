import { useT } from '../context/LanguageContext.jsx'
import { formatPrice } from '../lib/format.js'
import { discountOf } from '../lib/pricing.js'

// Za čitače ekrana (ne vide se)
const TEXT = {
  me: { sale: 'Akcijska cijena ', regular: ', redovna cijena ' },
  en: { sale: 'Sale price ', regular: ', regular price ' },
}

// Cijena proizvoda; kad je na popustu: akcijska crveno, redovna precrtana
export default function Price({ product, className = '' }) {
  const t = useT(TEXT)
  if (!discountOf(product)) return <span className={className}>{formatPrice(product.price)}</span>
  return (
    <span className={`inline-flex flex-wrap items-baseline gap-x-2 ${className}`}>
      <span className="text-alarm">
        <span className="sr-only">{t.sale}</span>
        {formatPrice(product.sale_price)}
      </span>
      <s className="text-[0.85em] text-ash">
        <span className="sr-only">{t.regular}</span>
        {formatPrice(product.price)}
      </s>
    </span>
  )
}

// Oznaka "-20%" za uglove slika
export function DiscountBadge({ product, className = '' }) {
  const discount = discountOf(product)
  if (!discount) return null
  return (
    <span className={`bg-bone px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-night ${className}`}>
      −{discount}%
    </span>
  )
}
