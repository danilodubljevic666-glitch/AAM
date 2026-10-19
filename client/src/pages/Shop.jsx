import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import { LoadError, SkeletonCards } from '../components/LoadState.jsx'
import { useLang, useT } from '../context/LanguageContext.jsx'
import { useProducts } from '../context/ProductsContext.jsx'
import { CATEGORIES, categoryLabel } from '../lib/categories.js'
import { priceOf } from '../lib/pricing.js'
import { INSTAGRAM_URL } from '../lib/site.js'
import SplitText from '../components/SplitText.jsx'
import { useSeo } from '../lib/seo.js'

// Nazivi sortiranja su u TEXT.sorts, pod istim ključem
const SORTS = {
  default: () => 0,
  'price-asc': (a, b) => priceOf(a) - priceOf(b),
  'price-desc': (a, b) => priceOf(b) - priceOf(a),
}

const TEXT = {
  me: {
    seoTitle: 'Majice, duksevi i kačketi',
    seoDescription:
      'Cijela AAM Clothing kolekcija: 2AM majice, duksevi, kačketi i kompleti od teškog pamuka. Plaćanje pouzećem, dostava u Nikšić, Podgoricu i cijelu Crnu Goru.',
    sorts: { default: 'Preporučeno', 'price-asc': 'Cijena: niža', 'price-desc': 'Cijena: viša' },
    // 1 proizvod, 21 proizvod, 2 / 5 / 11 proizvoda
    count: (n) => `${n} ${n % 10 === 1 && n % 100 !== 11 ? 'proizvod' : 'proizvoda'}`,
    collection: 'Kolekcija',
    intro:
      'Kolekcija AAM Clothing iz Nikšića: majice, duksevi i kačketi od teškog pamuka. Dostava na adresu bilo gdje u Crnoj Gori, plaćanje pouzećem.',
    comingSoon: 'Nova kolekcija stiže uskoro',
    follow: ['Prati nas na', 'Instagramu', 'i saznaj prvi.'],
    filterLabel: 'Filter po vrsti proizvoda',
    all: 'Sve',
    sort: 'Sortiraj',
    soon: 'Uskoro',
    emptyCategory: (name) => `Trenutno nema proizvoda u kategoriji „${name}“.`,
    showAll: 'Prikaži sve →',
    allProducts: 'Svi proizvodi',
    loading: 'Učitavanje…',
  },
  en: {
    seoTitle: 'T-shirts, hoodies and caps',
    seoDescription:
      'The full AAM Clothing collection: 2AM tees, hoodies, caps and sets in heavy cotton. Cash on delivery, shipping to Nikšić, Podgorica and all of Montenegro.',
    sorts: { default: 'Recommended', 'price-asc': 'Price: low to high', 'price-desc': 'Price: high to low' },
    count: (n) => `${n} ${n === 1 ? 'product' : 'products'}`,
    collection: 'Collection',
    intro:
      'The AAM Clothing collection from Nikšić: tees, hoodies and caps in heavy cotton. Delivered to your door anywhere in Montenegro, cash on delivery.',
    comingSoon: 'New collection coming soon',
    follow: ['Follow us on', 'Instagram', 'and be the first to know.'],
    filterLabel: 'Filter by product type',
    all: 'All',
    sort: 'Sort',
    soon: 'Coming soon',
    emptyCategory: (name) => `No products in “${name}” right now.`,
    showAll: 'Show all →',
    allProducts: 'All products',
    loading: 'Loading…',
  },
}

export default function Shop() {
  const { lang } = useLang()
  const t = useT(TEXT)
  const { products, status } = useProducts()
  // Izabrana kategorija je u adresi (/shop?kategorija=duksevi) — link se može podijeliti, a "nazad" radi
  const [params, setParams] = useSearchParams()
  const active = CATEGORIES.find((c) => c.slug === params.get('kategorija')) ?? null
  const activeLabel = active && categoryLabel(active.name, lang)
  const [sort, setSort] = useState('default')
  useSeo({ title: activeLabel || t.seoTitle, description: t.seoDescription })

  const filters = useMemo(
    () => [
      { label: t.all, slug: null, count: products.length },
      ...CATEGORIES.map((c) => ({
        ...c,
        label: categoryLabel(c.name, lang),
        count: products.filter((p) => p.category === c.name).length,
      })),
    ],
    [products, lang, t.all],
  )

  const visible = useMemo(
    () =>
      products
        .filter((p) => !active || p.category === active.name)
        .sort(SORTS[sort]),
    [products, active, sort],
  )

  const select = (slug) => setParams(slug ? { kategorija: slug } : {}, { replace: true })

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <p className="flex animate-fade-up items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-ash">
        <span className="text-alarm">01</span>
        <span aria-hidden="true" className="text-night-600">/</span>
        {t.collection}
      </p>
      <SplitText as="h1" text="Shop" className="mt-2 block font-display text-7xl uppercase sm:text-9xl" />
      <p className="mt-4 max-w-xl animate-fade-up text-ash [animation-delay:100ms]">{t.intro}</p>

      {status === 'ready' && products.length === 0 ? (
        <div className="mt-10 animate-fade-up border-y border-night-600 py-24 text-center [animation-delay:200ms]">
          <p className="font-display text-8xl text-night-600">02:00</p>
          <p className="mt-4 font-display text-4xl uppercase">{t.comingSoon}</p>
          <p className="mt-3 text-ash">
            {t.follow[0]}{' '}
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-bone underline underline-offset-4 hover:text-alarm">
              {t.follow[1]}
            </a>{' '}
            {t.follow[2]}
          </p>
        </div>
      ) : (
        <>
          <div className="mt-10 flex animate-fade-up flex-wrap items-center justify-between gap-4 border-y border-night-600 py-4 [animation-delay:200ms]">
            <div className="flex flex-wrap gap-2" role="group" aria-label={t.filterLabel}>
              {/* prazne kategorije se ne nude (osim ako je neko baš na njoj došao preko linka) */}
              {filters.filter((f) => status !== 'ready' || !f.slug || f.count > 0 || f.slug === active?.slug).map((f) => {
                const selected = (active?.slug ?? null) === f.slug
                return (
                  <button
                    key={f.slug ?? 'sve'}
                    onClick={() => select(f.slug)}
                    aria-pressed={selected}
                    className={`flex items-center gap-2 border px-4 py-2 font-mono text-xs uppercase tracking-widest transition-[background-color,border-color,color,scale] active:scale-95 ${
                      selected ? 'border-bone bg-bone text-night' : 'border-night-600 hover:border-bone'
                    }`}
                  >
                    {f.label}
                    {status === 'ready' && <span className="opacity-50">{f.count}</span>}
                  </button>
                )
              })}
            </div>
            <label className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-ash">
              {t.sort}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border border-night-600 bg-night px-3 py-2 text-bone outline-none focus:border-bone"
              >
                {Object.keys(SORTS).map((k) => (
                  <option key={k} value={k}>{t.sorts[k]}</option>
                ))}
              </select>
            </label>
          </div>

          {status === 'error' ? (
            <LoadError className="mt-10" />
          ) : status === 'ready' && visible.length === 0 ? (
            <div className="mt-10 animate-fade-in py-20 text-center">
              <p className="font-display text-4xl uppercase">{t.soon}</p>
              <p className="mt-3 text-ash">{t.emptyCategory(activeLabel)}</p>
              <button onClick={() => select(null)} className="mt-6 font-mono text-xs uppercase tracking-widest text-alarm hover:underline">
                {t.showAll}
              </button>
            </div>
          ) : (
            <>
              {/* Naslov mreže: nevidljiv je, ali bez njega se sa h1 skače pravo na h3
                  (čitači ekrana i Google prate redoslijed naslova) */}
              <h2 className="sr-only">{activeLabel || t.allProducts}</h2>
              <p className="mt-6 font-mono text-xs uppercase text-ash">
                {status === 'loading' ? t.loading : t.count(visible.length)}
              </p>
              <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
                {status === 'loading' ? <SkeletonCards count={8} /> : visible.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
              </div>
            </>
          )}
        </>
      )}
    </section>
  )
}
