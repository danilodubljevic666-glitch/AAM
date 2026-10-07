import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ImageZoom from '../components/ImageZoom.jsx'
import ProductImage from '../components/ProductImage.jsx'
import ProductCard from '../components/ProductCard.jsx'
import Reveal from '../components/Reveal.jsx'
import { LoadError } from '../components/LoadState.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useProducts } from '../context/ProductsContext.jsx'
import { formatPrice } from '../lib/format.js'
import { usePageTitle } from '../lib/usePageTitle.js'
import NotFound from './NotFound.jsx'

// Detalji zavise od vrste proizvoda: "240g pamuk" važi za majice, održavanje za odjeću, a kačket
// dobija samo dostavu. Materijal ostalih proizvoda upiši u opis proizvoda u admin panelu.
const SHIPPING = ['Dostava', 'Slanje u roku od 24h, 2–3 radna dana']
const CARE = ['Održavanje', 'Pranje na 30°, naopačke, bez sušilice']
const detailsFor = (category) => {
  if (category === 'Majice') return [['Materijal', '100% pamuk, 240g/m²'], CARE, SHIPPING]
  if (category === 'Duksevi' || category === 'Komplet') return [CARE, SHIPPING]
  return [SHIPPING]
}

export default function Product() {
  const { slug } = useParams()
  return <ProductView key={slug} slug={slug} />
}

function ProductView({ slug }) {
  const { products, status } = useProducts()
  const { addItem } = useCart()
  const [size, setSize] = useState(null)
  const [error, setError] = useState(false)
  const [photo, setPhoto] = useState(0)

  const product = status === 'ready' ? products.find((p) => p.slug === slug) : null
  usePageTitle(product ? product.name : status === 'ready' ? 'Stranica ne postoji' : 'Shop')

  if (status === 'loading') {
    return (
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-16" aria-busy="true">
        <div className="aspect-square animate-pulse bg-night-800" />
      </section>
    )
  }
  if (status === 'error') {
    return (
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <LoadError />
      </section>
    )
  }

  if (!product) return <NotFound message="Ova majica ne postoji ili više nije u ponudi." />

  const related = products.filter((p) => p.id !== product.id).slice(0, 4)

  const handleAdd = () => {
    if (!size) return setError(true)
    addItem(product, size)
  }

  return (
    <>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div className="h-fit animate-fade-in lg:sticky lg:top-24">
          <div className="relative aspect-square bg-night-800">
            {product.tag && (
              // pointer-events-none: prelazak preko oznake ne prekida zum
              <span className="pointer-events-none absolute left-4 top-4 z-10 bg-alarm px-2 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-night">
                {product.tag}
              </span>
            )}
            <ImageZoom className="absolute inset-0">
              {/* key → nova slika se blago pojavi pri promeni */}
              <ProductImage key={photo} product={product} index={photo} className="absolute inset-0 m-auto h-[82%] w-[82%] animate-fade-in" />
            </ImageZoom>
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {product.images.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setPhoto(i)}
                  aria-label={`Slika ${i + 1}`}
                  aria-pressed={photo === i}
                  className={`h-20 w-20 border bg-night-800 p-1 transition-colors ${photo === i ? 'border-bone' : 'border-night-600 hover:border-ash'}`}
                >
                  <img src={src} alt="" className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <nav className="animate-fade-up font-mono text-xs uppercase tracking-widest text-ash">
            <Link to="/shop" className="hover:text-alarm">Shop</Link> / {product.category}
          </nav>
          <h1 className="mt-4 animate-fade-up font-display text-6xl uppercase leading-none [animation-delay:80ms] sm:text-7xl">{product.name}</h1>
          <p className="mt-4 animate-fade-up font-mono text-xl [animation-delay:160ms]">{formatPrice(product.price)}</p>
          <p className="mt-6 max-w-md animate-fade-up text-ash [animation-delay:240ms]">{product.description}</p>

          <div className="mt-10 animate-fade-up [animation-delay:320ms]">
            <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest">
              <span className={error ? 'text-alarm' : 'text-ash'}>{error ? 'Izaberi veličinu' : 'Veličina'}</span>
              <Link to="/kontakt" className="text-ash underline underline-offset-4 transition-colors hover:text-alarm">
                Pomoć oko veličine?
              </Link>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSize(s)
                    setError(false)
                  }}
                  aria-pressed={size === s}
                  className={`h-12 min-w-14 border px-3 font-mono text-sm transition-[background-color,border-color,color,scale] active:scale-95 ${
                    size === s ? 'border-bone bg-bone text-night' : error ? 'border-alarm' : 'border-night-600 hover:border-bone'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="mt-8 w-full animate-fade-up bg-bone py-5 font-mono text-sm font-bold uppercase tracking-widest text-night transition-[background-color,scale] [animation-delay:400ms] hover:bg-alarm active:scale-[0.98]"
          >
            Dodaj u korpu
          </button>

          <dl className="mt-10 animate-fade-up divide-y divide-night-600 border-y border-night-600 [animation-delay:480ms]">
            {detailsFor(product.category).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-4 text-sm">
                <dt className="font-mono text-xs uppercase tracking-widest text-ash">{k}</dt>
                <dd className="text-right">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
          <Reveal as="h2" className="font-display text-4xl uppercase">Možda ti se svidi</Reveal>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
