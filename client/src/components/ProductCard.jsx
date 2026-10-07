import { Link } from 'react-router-dom'
import ProductImage from './ProductImage.jsx'
import Reveal from './Reveal.jsx'
import { formatPrice } from '../lib/format.js'

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
          <ProductImage
            product={product}
            className="absolute inset-0 m-auto h-[80%] w-[80%] transition-transform duration-500 group-hover:-rotate-2 group-hover:scale-105"
          />
        </div>
        <div className="mt-3 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-xl uppercase tracking-wide transition-colors group-hover:text-alarm">{product.name}</h3>
            <p className="font-mono text-xs uppercase text-ash">{product.category}</p>
          </div>
          <p className="whitespace-nowrap font-mono text-sm">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </Reveal>
  )
}
