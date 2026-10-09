import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ImageZoom from '../components/ImageZoom.jsx'
import Price, { DiscountBadge } from '../components/Price.jsx'
import ProductImage from '../components/ProductImage.jsx'
import ProductCard from '../components/ProductCard.jsx'
import Reveal from '../components/Reveal.jsx'
import SizeGuide from '../components/SizeGuide.jsx'
import { LoadError } from '../components/LoadState.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useProducts } from '../context/ProductsContext.jsx'
import { endMorph, isMorphing } from '../lib/morph.js'
import { useProductJsonLd, useSeo } from '../lib/seo.js'
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
  const [guideOpen, setGuideOpen] = useState(false)
  // Ista oznaka kao na kartici u shopu — po njoj browser spaja dvije slike u jedan pokret.
  // Čita se pri renderu (bez mijenjanja stanja), pa je oznaka na mjestu prije "fotografije".
  const [morphing, setMorphing] = useState(isMorphing)

  const product = status === 'ready' ? products.find((p) => p.slug === slug) : null

  useSeo({
    title: product ? product.name : status === 'ready' ? 'Stranica ne postoji' : 'Shop',
    description: product ? `${product.name} — ${product.description}` : undefined,
    image: product?.images?.[0],
    noIndex: status === 'ready' && !product,
  })
  useProductJsonLd(product)

  // Prelaz traje najviše pola sekunde; poslije toga oznaka više nije potrebna
  useEffect(() => {
    if (!morphing) return
    const t = setTimeout(() => {
      setMorphing(false)
      endMorph()
    }, 900)
    return () => clearTimeout(t)
  }, [morphing])

  if (status === 'loading') {
    return (
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-16" aria-busy="true">
        <div className="skeleton aspect-square" />
        <div>
          <div className="skeleton h-4 w-32" />
          <div className="skeleton mt-6 h-16 w-3/4" />
          <div className="skeleton mt-6 h-6 w-28" />
          <div className="skeleton mt-8 h-20 w-full" />
          <div className="skeleton mt-10 h-14 w-full" />
        </div>
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
        <div className="h-fit animate-fade-in lg:sticky lg:top-28">
          <div className="relative aspect-square overflow-hidden bg-night-800">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(closest-side,rgba(242,239,232,0.06),transparent)]" />
            {product.tag && (
              // pointer-events-none: prelazak preko oznake ne prekida zum
              <span className="pointer-events-none absolute left-4 top-4 z-10 bg-alarm px-2 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-night">
                {product.tag}
              </span>
            )}
            <ImageZoom className="absolute inset-0">
              {/* key → nova slika se blago pojavi pri promjeni */}
              <ProductImage
                key={photo}
                product={product}
                index={photo}
                style={{ viewTransitionName: morphing && photo === 0 ? 'product-image' : 'none' }}
                className="absolute inset-0 m-auto h-[82%] w-[82%] animate-fade-in"
              />
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
                  className={`h-20 w-20 border bg-night-800 p-1 transition-[border-color,scale] active:scale-95 ${
                    photo === i ? 'border-bone' : 'border-night-600 hover:border-ash'
                  }`}
                >
                  <img src={src} alt="" className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <nav className="animate-fade-up font-mono text-xs uppercase tracking-widest text-ash" aria-label="Putanja">
            <Link to="/shop" className="transition-colors hover:text-alarm">Shop</Link> / {product.category}
          </nav>
          <h1 className="mt-4 animate-fade-up font-display text-6xl uppercase leading-none [animation-delay:80ms] sm:text-7xl">
            {product.name}
          </h1>
          <p className="mt-4 flex animate-fade-up flex-wrap items-center gap-3 font-mono text-xl [animation-delay:160ms]">
            <Price product={product} />
            <DiscountBadge product={product} />
          </p>
          <p className="mt-6 max-w-md animate-fade-up text-ash [animation-delay:240ms]">{product.description}</p>

          <div className="mt-10 animate-fade-up [animation-delay:320ms]">
            <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest">
              <span className={error ? 'text-alarm' : 'text-ash'}>{error ? 'Izaberi veličinu' : 'Veličina'}</span>
              <button
                type="button"
                onClick={() => setGuideOpen(true)}
                className="flex items-center gap-1.5 text-ash underline underline-offset-4 transition-colors hover:text-alarm"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5" aria-hidden="true">
                  <path d="M3 8h18v8H3zM7 8v4M11 8v6M15 8v4M19 8v6" />
                </svg>
                Vodič za veličine
              </button>
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
            className="btn-shine mt-8 w-full animate-fade-up bg-bone py-5 font-mono text-sm font-bold uppercase tracking-widest text-night transition-[background-color,scale] [animation-delay:400ms] hover:bg-alarm active:scale-[0.98]"
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

      <SizeGuide open={guideOpen} onClose={() => setGuideOpen(false)} category={product.category} />

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
