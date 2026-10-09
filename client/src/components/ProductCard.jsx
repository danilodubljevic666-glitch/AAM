import { useRef } from 'react'
import { Link } from 'react-router-dom'
import Price, { DiscountBadge } from './Price.jsx'
import ProductImage from './ProductImage.jsx'
import Reveal from './Reveal.jsx'
import { useTilt } from '../lib/useTilt.js'
import { isPlainClick, useMorphNavigate } from '../lib/morph.js'

// index = pozicija u mreži, za kaskadno pojavljivanje kartica
export default function ProductCard({ product, index = 0 }) {
  const to = `/shop/${product.slug}`
  const tiltRef = useTilt()
  const cardRef = useRef(null)
  const morphTo = useMorphNavigate()

  // Klik: slika se označi i "otputuje" na stranicu proizvoda.
  // Ctrl/Cmd-klik i srednji taster ostaju browseru (otvaranje u novom tabu).
  const open = (e) => {
    if (!isPlainClick(e)) return
    e.preventDefault()
    // Kartica može imati dvije slike (prednja + leđa na hover) — "putuje" ona
    // koja se u tom trenutku zaista vidi, inače bi prelaz krenuo iz prozirne slike.
    const slike = [...(cardRef.current?.querySelectorAll('img, svg') ?? [])]
    const vidljiva = slike.find((el) => Number(getComputedStyle(el).opacity) > 0.5) ?? slike[0]
    morphTo(to, vidljiva)
  }

  // Kad proizvod ima više slika, prelazak mišem otkriva drugu (npr. leđa majice)
  const hasBack = (product.images?.length ?? 0) > 1

  return (
    <Reveal delay={(index % 4) * 90} variant="blur">
      <Link ref={cardRef} to={to} onClick={open} className="group block">
        <div ref={tiltRef} className="tilt relative aspect-[4/5] overflow-hidden bg-night-800 transition-colors duration-500 group-hover:bg-night-700">
          {/* svjetlo iza komada, pali se na hover */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(closest-side,rgba(255,59,47,0.16),transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {product.tag && (
            <span className="absolute left-3 top-3 z-10 bg-alarm px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-night">
              {product.tag}
            </span>
          )}
          <DiscountBadge product={product} className="absolute right-3 top-3 z-10" />

          <ProductImage
            product={product}
            className={`absolute inset-0 m-auto h-[80%] w-[80%] transition-[transform,opacity] duration-500 ${
              hasBack ? 'group-hover:opacity-0' : 'group-hover:-rotate-2 group-hover:scale-105'
            }`}
          />
          {hasBack && (
            <ProductImage
              product={product}
              index={1}
              className="absolute inset-0 m-auto h-[80%] w-[80%] scale-95 opacity-0 transition-[transform,opacity] duration-500 group-hover:scale-100 group-hover:opacity-100"
            />
          )}

          {/* traka se podiže odozdo na hover (na telefonu je cijela kartica ionako link) */}
          <span className="absolute inset-x-0 bottom-0 translate-y-full bg-bone py-3 text-center font-mono text-[11px] font-bold uppercase tracking-widest text-night transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
            Pogledaj
          </span>
        </div>

        {/* na uskim karticama (telefon) cijena ide ispod naziva, da se ne guraju */}
        <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div>
            <h3 className="font-display text-xl uppercase leading-tight tracking-wide transition-colors group-hover:text-alarm">
              {product.name}
            </h3>
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
