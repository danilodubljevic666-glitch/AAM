import { Link } from 'react-router-dom'
import Price, { DiscountBadge } from './Price.jsx'
import ProductImage from './ProductImage.jsx'
import Reveal from './Reveal.jsx'

// index = pozicija u mreži, za kaskadno pojavljivanje kartica
export default function ProductCard({ product, index = 0 }) {
  return (
    <Reveal delay={(index % 4) * 90}>
      <Link to={`/shop/${product.slug}`} className="group block">
        <div className="relative aspect-[4/5] overflow-hidden bg-night-800 transition-colors group-hover:bg-night-700">
          {product.tag && (
            <span className="absolute left-3 top-3 z-10 bg-alarm px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-night">
              {product.tag}
            </span>
          )}
          <DiscountBadge product={product} className="absolute right-3 top-3 z-10" />
          <ProductImage
            product={product}
            className="absolute inset-0 m-auto h-[80%] w-[80%] transition-transform duration-500 group-hover:-rotate-2 group-hover:scale-105"
          />
        </div>
        {/* na uskim karticama (telefon) cijena ide ispod naziva, da se ne guraju */}
        <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div>
            <h3 className="font-display text-xl uppercase leading-tight tracking-wide transition-colors group-hover:text-alarm">{product.name}</h3>
            <p className="font-mono text-xs uppercase text-ash">{product.category}</p>
          </div>
          <p className="whitespace-nowrap font-mono text-sm sm:text-right">
            <Price product={product} className="sm:justify-end" />
          </p>
        </div>
      </Link>
    </Reveal>
  )
}
