import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import { LoadError, SkeletonCards } from '../components/LoadState.jsx'
import { useProducts } from '../context/ProductsContext.jsx'
import { CATEGORIES } from '../lib/categories.js'
import { priceOf } from '../lib/pricing.js'
import { INSTAGRAM_URL } from '../lib/site.js'
import { usePageTitle } from '../lib/usePageTitle.js'

const sorts = {
  default: { label: 'Preporučeno', fn: () => 0 },
  'price-asc': { label: 'Cijena: niža', fn: (a, b) => priceOf(a) - priceOf(b) },
  'price-desc': { label: 'Cijena: viša', fn: (a, b) => priceOf(b) - priceOf(a) },
}

// 1 proizvod, 21 proizvod, 2 / 5 / 11 proizvoda
const countLabel = (n) => (n % 10 === 1 && n % 100 !== 11 ? 'proizvod' : 'proizvoda')

export default function Shop() {
  const { products, status } = useProducts()
  // Izabrana kategorija je u adresi (/shop?kategorija=duksevi) — link se može podijeliti, a "nazad" radi
  const [params, setParams] = useSearchParams()
  const active = CATEGORIES.find((c) => c.slug === params.get('kategorija')) ?? null
  const [sort, setSort] = useState('default')
  usePageTitle(active ? active.name : 'Shop')

  const filters = useMemo(
    () => [
      { name: 'Sve', slug: null, count: products.length },
      ...CATEGORIES.map((c) => ({ ...c, count: products.filter((p) => p.category === c.name).length })),
    ],
    [products],
  )

  const visible = useMemo(
    () =>
      products
        .filter((p) => !active || p.category === active.name)
        .sort(sorts[sort].fn),
    [products, active, sort],
  )

  const select = (slug) => setParams(slug ? { kategorija: slug } : {}, { replace: true })

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <p className="animate-fade-up font-mono text-xs uppercase tracking-[0.3em] text-ash">Kolekcija 01</p>
      <h1 className="mt-2 animate-fade-up font-display text-7xl uppercase [animation-delay:100ms] sm:text-8xl">Shop</h1>

      {status === 'ready' && products.length === 0 ? (
        <div className="mt-10 animate-fade-up border-y border-night-600 py-24 text-center [animation-delay:200ms]">
          <p className="font-display text-8xl text-night-600">02:00</p>
          <p className="mt-4 font-display text-4xl uppercase">Nova kolekcija stiže uskoro</p>
          <p className="mt-3 text-ash">
            Prati nas na{' '}
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-bone underline underline-offset-4 hover:text-alarm">
              Instagramu
            </a>{' '}
            i saznaj prvi.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-10 flex animate-fade-up flex-wrap items-center justify-between gap-4 border-y border-night-600 py-4 [animation-delay:200ms]">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter po vrsti proizvoda">
              {filters.map((f) => {
                const selected = (active?.slug ?? null) === f.slug
                return (
                  <button
                    key={f.name}
                    onClick={() => select(f.slug)}
                    aria-pressed={selected}
                    className={`flex items-center gap-2 border px-4 py-2 font-mono text-xs uppercase tracking-widest transition-[background-color,border-color,color,scale] active:scale-95 ${
                      selected ? 'border-bone bg-bone text-night' : 'border-night-600 hover:border-bone'
                    }`}
                  >
                    {f.name}
                    {status === 'ready' && <span className="opacity-50">{f.count}</span>}
                  </button>
                )
              })}
            </div>
            <label className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-ash">
              Sortiraj
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border border-night-600 bg-night px-3 py-2 text-bone outline-none focus:border-bone"
              >
                {Object.entries(sorts).map(([k, s]) => (
                  <option key={k} value={k}>{s.label}</option>
                ))}
              </select>
            </label>
          </div>

          {status === 'error' ? (
            <LoadError className="mt-10" />
          ) : status === 'ready' && visible.length === 0 ? (
            <div className="mt-10 animate-fade-in py-20 text-center">
              <p className="font-display text-4xl uppercase">Uskoro</p>
              <p className="mt-3 text-ash">Trenutno nema proizvoda u kategoriji „{active.name}“.</p>
              <button onClick={() => select(null)} className="mt-6 font-mono text-xs uppercase tracking-widest text-alarm hover:underline">
                Prikaži sve →
              </button>
            </div>
          ) : (
            <>
              <p className="mt-6 font-mono text-xs uppercase text-ash">
                {status === 'loading' ? 'Učitavanje…' : `${visible.length} ${countLabel(visible.length)}`}
              </p>
              <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3">
                {status === 'loading' ? <SkeletonCards count={6} /> : visible.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
              </div>
            </>
          )}
        </>
      )}
    </section>
  )
}
