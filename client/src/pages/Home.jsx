import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Counter from '../components/Counter.jsx'
import Magnetic from '../components/Magnetic.jsx'
import ProductCard from '../components/ProductCard.jsx'
import Reveal from '../components/Reveal.jsx'
import SplitText from '../components/SplitText.jsx'
import { LoadError, SkeletonCards } from '../components/LoadState.jsx'
import { useProducts } from '../context/ProductsContext.jsx'
import { reviews } from '../data/reviews.js'
import { useSeo } from '../lib/seo.js'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../lib/site.js'
import { useParallax } from '../lib/useParallax.js'

// Koliko je ostalo do sledećih 02:00
function untilTwoAm(now) {
  const target = new Date(now)
  target.setHours(2, 0, 0, 0)
  if (target <= now) target.setDate(target.getDate() + 1)
  const diff = Math.floor((target - now) / 1000)
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(Math.floor(diff / 3600))}:${pad(Math.floor((diff % 3600) / 60))}:${pad(diff % 60)}`
}

// Zasebna komponenta da bi se svake sekunde osvježavao samo sat, a ne cijela stranica
function Countdown() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return <span className="text-alarm tabular-nums">{untilTwoAm(now)}</span>
}

// Pet zvjezdica jednom, pa se sijeku — jasnije od ponavljanja u JSX-u
const STARS = '★★★★★'

const STEPS = [
  ['Izaberi', 'Nađi svoj komad i veličinu. Korpa pamti izbor i kad zatvoriš stranicu.'],
  ['Naruči', 'Ostaviš ime, adresu i telefon. Bez registracije i bez kartice.'],
  ['Plati kuriru', 'Paket kreće u roku od 24h. Plaćaš gotovinom pri preuzimanju.'],
]

export default function Home() {
  useSeo()
  const { products, status } = useProducts()
  const heroRef = useParallax()

  return (
    <>
      {/* HERO */}
      <section ref={heroRef} className="relative overflow-hidden">
        {/* ambijentalno svjetlo — dva sloja koja lagano dišu */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] animate-aurora rounded-full bg-alarm/20 blur-[120px]" />
        <div className="pointer-events-none absolute -left-32 top-1/3 h-[420px] w-[420px] animate-aurora rounded-full bg-neon/15 blur-[130px] [animation-delay:-7s]" />

        <div className="scroll-hero mx-auto grid max-w-7xl items-center gap-10 px-4 pb-20 pt-12 sm:px-6 lg:grid-cols-2 lg:pt-20">
          <div className="relative">
            <p className="animate-fade-up font-mono text-xs uppercase tracking-[0.3em] text-ash">
              Do 02:00 je ostalo <Countdown />
            </p>
            <h1 className="mt-6 animate-fade-up font-display text-[clamp(5rem,18vw,13rem)] leading-[0.85] tracking-tight [animation-delay:100ms]">
              02<span className="animate-blink text-alarm">:</span>00
            </h1>
            <p className="mt-6 max-w-md animate-fade-up text-lg text-ash [animation-delay:200ms]">
              Majice za one koji su budni kad svi drugi spavaju. Teški pamuk, jaki printovi, bez kompromisa.
            </p>
            <div className="mt-10 flex animate-fade-up flex-wrap gap-4 [animation-delay:300ms]">
              <Magnetic>
                <Link
                  to="/shop"
                  className="btn-shine block bg-bone px-8 py-4 font-mono text-xs font-bold uppercase tracking-widest text-night transition-[background-color,scale] hover:bg-alarm active:scale-[0.97]"
                >
                  Pogledaj kolekciju
                </Link>
              </Magnetic>
              <Magnetic>
                <Link
                  to="/o-nama"
                  className="group block border border-night-600 px-8 py-4 font-mono text-xs font-bold uppercase tracking-widest transition-[border-color,scale] hover:border-bone active:scale-[0.97]"
                >
                  Priča
                  <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </Magnetic>
            </div>
          </div>

          <Link
            to="/shop"
            className="group relative mx-auto aspect-square w-full max-w-lg animate-fade-in [animation-delay:150ms]"
            aria-label="2AM Still Dreaming — pogledaj kolekciju"
          >
            <div className="parallax absolute inset-0 rounded-full border border-night-600" data-depth="0.25" />
            <div className="absolute inset-10 animate-[spin_90s_linear_infinite] rounded-full border border-dashed border-night-600" />
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(closest-side,rgba(242,239,232,0.09),transparent)]" />

            {/* Spoljni div: ulazak sa strane + paralaksa; slika: lebdenje i hover */}
            <div className="parallax absolute right-0 top-[6%] w-[66%] animate-slide-in-right [animation-delay:350ms]" data-depth="0.6">
              <img
                src="/images/2am-still-dreaming-back.webp"
                alt="2AM Still Dreaming majica — leđa"
                width="950"
                height="902"
                className="w-full rotate-6 animate-float brightness-75 drop-shadow-[0_30px_60px_rgba(0,0,0,0.7)] transition-[translate,rotate,filter] duration-500 [animation-delay:-3s] group-hover:translate-x-3 group-hover:rotate-9 group-hover:brightness-100"
              />
            </div>
            <div className="parallax absolute bottom-[8%] left-0 w-[66%] animate-slide-in-left [animation-delay:500ms]" data-depth="1">
              <img
                src="/images/2am-still-dreaming-front.webp"
                alt="2AM Still Dreaming majica — prednja strana"
                width="949"
                height="908"
                fetchPriority="high"
                className="w-full -rotate-3 animate-float drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)] transition-[translate,rotate] duration-500 group-hover:-translate-x-3 group-hover:-rotate-6"
              />
            </div>
            <span className="absolute bottom-6 right-0 animate-fade-up bg-alarm px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-widest text-night [animation-delay:900ms]">
              Novo — Still Dreaming
            </span>
          </Link>
        </div>

        {/* nagovještaj da ima još ispod */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-5 left-1/2 hidden -translate-x-1/2 animate-fade-in flex-col items-center gap-2 [animation-delay:1.2s] lg:flex"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ash">Skroluj</span>
          <span className="h-10 w-px bg-gradient-to-b from-ash to-transparent" />
        </div>
      </section>

      {/* IZDVOJENO — sakriveno dok u shopu nema majica */}
      {!(status === 'ready' && products.length === 0) && (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <Reveal className="flex items-end justify-between gap-4">
            <SplitText as="h2" text="Izdvojeno" className="font-display text-5xl uppercase sm:text-6xl" />
            <Link to="/shop" className="group -my-2 py-2 font-mono text-xs uppercase tracking-widest transition-colors hover:text-alarm">
              Sve majice
              <span className="ml-1.5 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </Reveal>
          {status === 'error' ? (
            <LoadError className="mt-10" />
          ) : (
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
              {status === 'loading' ? (
                <SkeletonCards count={4} />
              ) : (
                products.slice(0, 4).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)
              )}
            </div>
          )}
        </section>
      )}

      {/* MANIFEST */}
      <section className="relative overflow-hidden border-y border-night-600 bg-night-800">
        <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 animate-aurora rounded-full bg-alarm/10 blur-[100px]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-2">
          <SplitText
            as="p"
            parts={[{ t: 'Najbolje ideje ' }, { t: 'ne dolaze', c: 'text-alarm' }, { t: ' u podne.' }]}
            step={18}
            className="font-display text-5xl uppercase leading-[0.95] sm:text-7xl"
          />
          <Reveal delay={150} variant="right" className="flex flex-col justify-end gap-6 text-ash">
            <p>
              aam je nastao u satima kad je grad tih, ekran jedino svjetlo u sobi, a glava puna ideja. Pravimo majice za
              ljude koji žive po svom rasporedu.
            </p>
            <div className="grid grid-cols-3 gap-4 border-t border-night-600 pt-6 font-mono text-xs uppercase">
              <div>
                <p className="font-display text-3xl text-bone"><Counter to={240} suffix="g" /></p>
                teški pamuk
              </div>
              <div>
                <p className="font-display text-3xl text-bone"><Counter to={100} suffix="%" /></p>
                lokalna izrada
              </div>
              <div>
                <p className="font-display text-3xl text-bone"><Counter to={24} suffix="h" /></p>
                slanje
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* KAKO IDE PORUDŽBINA — skida nedoumice prije prve kupovine */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-ash">Kako ide</p>
          <SplitText as="h2" text="Od korpe do vrata" step={20} className="mt-5 font-display text-5xl uppercase sm:text-6xl" />
        </Reveal>
        <ol className="mt-10 grid gap-px border border-night-600 bg-night-600 sm:grid-cols-3">
          {STEPS.map(([title, text], i) => (
            <Reveal as="li" key={title} delay={i * 110} className="group bg-night p-8 transition-colors duration-300 hover:bg-night-800">
              <p className="font-mono text-xs text-alarm">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="mt-8 font-display text-3xl uppercase transition-transform duration-300 group-hover:translate-x-1">
                {title}
              </h3>
              <p className="mt-3 text-ash">{text}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* RECENZIJE */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-ash">Recenzije</p>
          <SplitText as="h2" text="Noćne ptice kažu" step={22} className="mt-5 font-display text-5xl uppercase sm:text-6xl" />
        </Reveal>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reviews.map((r, i) => (
            <Reveal as="li" key={r.name} delay={i * 100} variant="blur" className="flex">
              <div className="flex flex-1 flex-col justify-between gap-8 border border-night-600 bg-night-800 p-6 transition-[translate,border-color,background-color] duration-300 hover:-translate-y-1 hover:border-ash hover:bg-night-700">
                <div>
                  <p className="font-mono text-sm tracking-[0.2em]">
                    <span aria-hidden="true">
                      <span className="text-alarm">{STARS.slice(0, r.rating)}</span>
                      <span className="text-night-600">{STARS.slice(r.rating, 5)}</span>
                    </span>
                    <span className="sr-only">Ocjena {r.rating} od 5</span>
                  </p>
                  <blockquote className="mt-4 leading-relaxed text-bone/90">„{r.text}“</blockquote>
                </div>
                <p className="font-mono text-xs uppercase tracking-widest text-ash">
                  {r.name} · {r.city}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* INSTAGRAM — završetak stranice: tu se najavljuju novi dropovi */}
      {INSTAGRAM_URL && (
        <Reveal as="section" variant="scale" className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block overflow-hidden border border-night-600 bg-night-800 px-6 py-16 text-center transition-colors duration-300 hover:border-alarm sm:py-24"
          >
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-alarm/15 opacity-60 blur-[90px] transition-opacity duration-500 group-hover:opacity-100" />
            <p className="relative font-mono text-xs uppercase tracking-[0.3em] text-ash">Novi dropovi izlaze u 02:00</p>
            <p className="relative mt-5 font-display text-[clamp(2.25rem,8vw,6rem)] uppercase leading-none [overflow-wrap:anywhere]">
              @{INSTAGRAM_HANDLE}
            </p>
            <span className="relative mt-8 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-alarm">
              Zaprati nas na Instagramu
              <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
            </span>
          </a>
        </Reveal>
      )}
    </>
  )
}
