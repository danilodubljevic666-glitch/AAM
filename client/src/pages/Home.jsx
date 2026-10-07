import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Marquee from '../components/Marquee.jsx'
import ProductCard from '../components/ProductCard.jsx'
import Reveal from '../components/Reveal.jsx'
import { LoadError, SkeletonCards } from '../components/LoadState.jsx'
import { useProducts } from '../context/ProductsContext.jsx'
import { reviews } from '../data/reviews.js'
import { usePageTitle } from '../lib/usePageTitle.js'

// Koliko je ostalo do sledećih 02:00
function untilTwoAm(now) {
  const target = new Date(now)
  target.setHours(2, 0, 0, 0)
  if (target <= now) target.setDate(target.getDate() + 1)
  const diff = Math.floor((target - now) / 1000)
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(Math.floor(diff / 3600))}:${pad(Math.floor((diff % 3600) / 60))}:${pad(diff % 60)}`
}

// Zasebna komponenta da bi se svake sekunde osvežavao samo sat, a ne cela stranica
function Countdown() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return <span className="text-alarm tabular-nums">{untilTwoAm(now)}</span>
}

export default function Home() {
  usePageTitle()
  const { products, status } = useProducts()

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] animate-glow rounded-full bg-alarm/20 blur-[120px]" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-2 lg:pt-20">
          <div>
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
              <Link
                to="/shop"
                className="bg-bone px-8 py-4 font-mono text-xs font-bold uppercase tracking-widest text-night transition-[background-color,scale] hover:bg-alarm active:scale-[0.97]"
              >
                Pogledaj kolekciju
              </Link>
              <Link
                to="/o-nama"
                className="border border-night-600 px-8 py-4 font-mono text-xs font-bold uppercase tracking-widest transition-[border-color,scale] hover:border-bone active:scale-[0.97]"
              >
                Priča
              </Link>
            </div>
          </div>

          <Link to="/shop" className="group relative mx-auto aspect-square w-full max-w-lg animate-fade-in [animation-delay:150ms]">
            <div className="absolute inset-0 rounded-full border border-night-600" />
            <div className="absolute inset-10 animate-[spin_90s_linear_infinite] rounded-full border border-dashed border-night-600" />
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(closest-side,rgba(242,239,232,0.09),transparent)]" />
            {/* Spoljni div: ulazak sa strane; slika: lagano lebdenje + hover */}
            <div className="absolute right-0 top-[6%] w-[66%] animate-slide-in-right [animation-delay:350ms]">
              <img
                src="/images/2am-still-dreaming-back.webp"
                alt="2AM Still Dreaming majica — leđa"
                width="950"
                height="902"
                className="w-full rotate-6 animate-float brightness-75 drop-shadow-[0_30px_60px_rgba(0,0,0,0.7)] transition-[translate,rotate,filter] duration-500 [animation-delay:-3s] group-hover:translate-x-3 group-hover:rotate-9 group-hover:brightness-100"
              />
            </div>
            <div className="absolute bottom-[8%] left-0 w-[66%] animate-slide-in-left [animation-delay:500ms]">
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
      </section>

      <Marquee items={['Nova kolekcija', 'Same city, different thoughts', 'Teški pamuk 240g', 'Dostava širom Crne Gore', 'Made at 2am']} />

      {/* IZDVOJENO — sakriveno dok u shopu nema majica */}
      {!(status === 'ready' && products.length === 0) && (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <Reveal className="flex items-end justify-between gap-4">
            <h2 className="font-display text-5xl uppercase sm:text-6xl">Izdvojeno</h2>
            <Link to="/shop" className="font-mono text-xs uppercase tracking-widest hover:text-alarm">
              Sve majice →
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
      <section className="border-y border-night-600 bg-night-800">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-2">
          <Reveal as="p" className="font-display text-5xl uppercase leading-[0.95] sm:text-7xl">
            Najbolje ideje <span className="text-alarm">ne dolaze</span> u podne.
          </Reveal>
          <Reveal delay={150} className="flex flex-col justify-end gap-6 text-ash">
            <p>
              aam je nastao u satima kad je grad tih, ekran jedino svjetlo u sobi, a glava puna ideja. Pravimo majice za
              ljude koji žive po svom rasporedu.
            </p>
            <div className="grid grid-cols-3 gap-4 border-t border-night-600 pt-6 font-mono text-xs uppercase">
              <div><p className="font-display text-3xl text-bone">240g</p>teški pamuk</div>
              <div><p className="font-display text-3xl text-bone">100%</p>lokalna izrada</div>
              <div><p className="font-display text-3xl text-bone">24h</p>slanje</div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* RECENZIJE */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-ash">Recenzije</p>
          <h2 className="mt-5 font-display text-5xl uppercase sm:text-6xl">Noćne ptice kažu</h2>
        </Reveal>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reviews.map((r, i) => (
            <Reveal as="li" key={r.name} delay={i * 100} className="flex">
              <div className="flex flex-1 flex-col justify-between gap-8 border border-night-600 bg-night-800 p-6 transition-[translate,border-color] duration-300 hover:-translate-y-1 hover:border-ash">
                <div>
                  <p className="font-mono text-sm tracking-[0.2em]">
                    <span aria-hidden="true">
                      <span className="text-alarm">{'★'.repeat(r.rating)}</span>
                      <span className="text-night-600">{'★'.repeat(5 - r.rating)}</span>
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
    </>
  )
}
