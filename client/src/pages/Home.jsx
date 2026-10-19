import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Counter from '../components/Counter.jsx'
import Magnetic from '../components/Magnetic.jsx'
import Marquee from '../components/Marquee.jsx'
import ProductCard from '../components/ProductCard.jsx'
import ProductImage from '../components/ProductImage.jsx'
import Reveal from '../components/Reveal.jsx'
import SplitText from '../components/SplitText.jsx'
import { BoxIcon, CashIcon, SparkIcon, TruckIcon } from '../components/icons.jsx'
import { LoadError, SkeletonCards } from '../components/LoadState.jsx'
import { useLang, useT } from '../context/LanguageContext.jsx'
import { useProducts } from '../context/ProductsContext.jsx'
import { reviews } from '../data/reviews.js'
import { CATEGORIES, categoryLabel } from '../lib/categories.js'
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

// Oznaka iznad naslova sekcije: "01 / Kolekcija"
function Eyebrow({ n, children, className = '' }) {
  return (
    <p className={`flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-ash ${className}`}>
      <span className="text-alarm">{n}</span>
      <span aria-hidden="true" className="text-night-600">/</span>
      {children}
    </p>
  )
}

// Pet zvjezdica jednom, pa se sijeku — jasnije od ponavljanja u JSX-u
const STARS = '★★★★★'

// Ikonice za heroPerks i steps iz TEXT, istim redom
const HERO_ICONS = [TruckIcon, CashIcon, BoxIcon]
const STEP_ICONS = [SparkIcon, BoxIcon, CashIcon]

const TEXT = {
  me: {
    place: 'AAM Clothing · Nikšić, Crna Gora',
    countdown: 'Do 02:00 je ostalo',
    intro: 'Majice za one koji su budni kad svi drugi spavaju. Teški pamuk, jaki printovi, bez kompromisa.',
    shopCta: 'Pogledaj kolekciju',
    story: 'Priča',
    // odmah ispod dugmadi u heru: tri odgovora na "kako ovo funkcioniše"
    heroPerks: ['Dostava za 2 do 3 dana', 'Plaćanje pouzećem', 'Slanje u roku od 24h'],
    heroLink: '2AM Still Dreaming, pogledaj kolekciju',
    teeBack: '2AM Still Dreaming majica, leđa',
    teeFront: '2AM Still Dreaming majica, prednja strana',
    heroTag: 'Novo · Still Dreaming',
    scroll: 'Skroluj',
    // pokretna traka ispod hero dijela; svaka druga poruka je samo kontura
    ticker: ['Same city, different thoughts', 'Nikšić, Crna Gora', 'Male serije', 'Teški pamuk', 'Plaćanje pouzećem'],
    collection: 'Kolekcija',
    featured: 'Izdvojeno',
    viewAll: 'Pogledaj sve',
    categories: 'Kategorije',
    pickYours: 'Izaberi svoje',
    // 1 proizvod, 21 proizvod, 2 / 5 / 11 proizvoda
    count: (n) => `${n} ${n % 10 === 1 && n % 100 !== 11 ? 'proizvod' : 'proizvoda'}`,
    manifest: 'Manifest',
    designedAtNight: 'Dizajnirano noću',
    manifestTitle: [{ t: 'Najbolje ideje ' }, { t: 'ne dolaze', c: 'text-alarm' }, { t: ' u podne.' }],
    manifestText:
      'AAM Clothing je nastao u Nikšiću, u satima kad je grad tih, ekran jedino svjetlo u sobi, a glava puna ideja. Pravimo majice za ljude koji žive po svom rasporedu i šaljemo ih širom Crne Gore.',
    stats: ['teški pamuk', 'lokalna izrada', 'slanje'],
    readStory: 'Pročitaj našu priču',
    howItWorks: 'Kako ide',
    cartToDoor: 'Od korpe do vrata',
    steps: [
      ['Izaberi', 'Nađi svoj komad i veličinu. Korpa pamti izbor i kad zatvoriš stranicu.'],
      ['Naruči', 'Ostaviš ime, adresu i telefon. Bez registracije i bez kartice.'],
      ['Plati kuriru', 'Paket kreće u roku od 24h. Plaćaš gotovinom pri preuzimanju.'],
    ],
    reviews: 'Recenzije',
    nightOwls: 'Noćne ptice kažu',
    rating: (n) => `Ocjena ${n} od 5`,
    quote: (text) => `„${text}“`,
    drops: 'Novi dropovi izlaze u 02:00',
    follow: 'Zaprati nas na Instagramu',
  },
  en: {
    place: 'AAM Clothing · Nikšić, Montenegro',
    countdown: 'Time left until 02:00',
    intro: 'Tees for those who are awake while everyone else sleeps. Heavy cotton, bold prints, no compromises.',
    shopCta: 'Shop the collection',
    story: 'Our story',
    heroPerks: ['Delivery in 2 to 3 days', 'Cash on delivery', 'Ships within 24h'],
    heroLink: '2AM Still Dreaming, shop the collection',
    teeBack: '2AM Still Dreaming tee, back',
    teeFront: '2AM Still Dreaming tee, front',
    heroTag: 'New · Still Dreaming',
    scroll: 'Scroll',
    ticker: ['Same city, different thoughts', 'Nikšić, Montenegro', 'Small batches', 'Heavy cotton', 'Cash on delivery'],
    collection: 'Collection',
    featured: 'Featured',
    viewAll: 'View all',
    categories: 'Categories',
    pickYours: 'Pick yours',
    count: (n) => `${n} ${n === 1 ? 'product' : 'products'}`,
    manifest: 'Manifesto',
    designedAtNight: 'Designed at night',
    manifestTitle: [{ t: 'The best ideas ' }, { t: "don't come", c: 'text-alarm' }, { t: ' at noon.' }],
    manifestText:
      'AAM Clothing was born in Nikšić, in the hours when the city goes quiet, the screen is the only light in the room and your head is full of ideas. We make tees for people who live on their own schedule and ship them all over Montenegro.',
    stats: ['heavy cotton', 'made locally', 'dispatch'],
    readStory: 'Read our story',
    howItWorks: 'How it works',
    cartToDoor: 'From cart to door',
    steps: [
      ['Choose', 'Find your piece and your size. The cart remembers it even if you close the page.'],
      ['Order', 'Leave your name, address and phone number. No sign-up, no card.'],
      ['Pay the courier', 'Your parcel ships within 24h. You pay in cash when it arrives.'],
    ],
    reviews: 'Reviews',
    nightOwls: 'Night owls say',
    rating: (n) => `Rated ${n} out of 5`,
    quote: (text) => `“${text}”`,
    drops: 'New drops land at 02:00',
    follow: 'Follow us on Instagram',
  },
}

// Broj kolona za pločice kategorija (Tailwind traži cijele nazive klasa)
const CATEGORY_COLS = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' }

export default function Home() {
  useSeo()
  const { lang } = useLang()
  const t = useT(TEXT)
  const { products, status } = useProducts()
  const heroRef = useParallax()
  const heroPerks = t.heroPerks.map((text, i) => [HERO_ICONS[i], text])
  const steps = t.steps.map(([title, text], i) => [STEP_ICONS[i], title, text])

  // Samo kategorije u kojima trenutno ima nečega; na pločici je prvi komad iz kategorije
  const categories = CATEGORIES.map((c) => ({ ...c, items: products.filter((p) => p.category === c.name) })).filter(
    (c) => c.items.length > 0,
  )
  // Za manifest: duks (ako ga ima), i to leđa, da se ne ponavlja majica iz hero dijela
  const feature = products.find((p) => p.category === 'Duksevi')

  return (
    <>
      {/* HERO */}
      <section ref={heroRef} className="relative overflow-hidden">
        {/* ambijentalno svjetlo — dva sloja koja lagano dišu */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] animate-aurora rounded-full bg-alarm/20 blur-[120px]" />
        <div className="pointer-events-none absolute -left-32 top-1/3 h-[420px] w-[420px] animate-aurora rounded-full bg-neon/15 blur-[130px] [animation-delay:-7s]" />
        {/* tanka mreža koja se gubi prema ivicama, kao milimetarski papir */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(242,239,232,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(242,239,232,0.035)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,#000_25%,transparent_75%)]" />

        <div className="scroll-hero relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-10 sm:px-6 lg:min-h-[calc(100svh-6rem)] lg:grid-cols-2 lg:py-12">
          <div className="relative">
            {/* H1 je ono što Google uzima kao temu stranice; veliki sat ispod je samo slika brenda */}
            <h1 className="animate-fade-up font-mono text-xs uppercase tracking-[0.3em] text-bone">
              {t.place}
            </h1>
            <p className="mt-3 animate-fade-up font-mono text-xs uppercase tracking-[0.3em] text-ash [animation-delay:50ms]">
              {t.countdown} <Countdown />
            </p>
            <p className="relative isolate mt-6 animate-fade-up font-display text-[clamp(5.5rem,19vw,14rem)] leading-[0.85] tracking-tight [animation-delay:100ms]">
              {/* pomjerena kontura iza sata, kao otisak */}
              <span aria-hidden="true" className="text-outline text-outline-dim absolute left-[0.045em] top-[0.045em] -z-10 select-none">
                02:00
              </span>
              02<span className="animate-blink text-alarm">:</span>00
            </p>
            <p className="mt-6 max-w-md animate-fade-up text-lg text-ash [animation-delay:200ms]">{t.intro}</p>
            <div className="mt-10 flex animate-fade-up flex-wrap gap-4 [animation-delay:300ms]">
              <Magnetic>
                <Link
                  to="/shop"
                  className="btn-shine block bg-bone px-8 py-4 font-mono text-xs font-bold uppercase tracking-widest text-night transition-[background-color,scale] hover:bg-alarm active:scale-[0.97]"
                >
                  {t.shopCta}
                </Link>
              </Magnetic>
              <Magnetic>
                <Link
                  to="/o-nama"
                  className="group block border border-night-600 px-8 py-4 font-mono text-xs font-bold uppercase tracking-widest transition-[border-color,scale] hover:border-bone active:scale-[0.97]"
                >
                  {t.story}
                  <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </Magnetic>
            </div>
            <ul className="mt-10 grid max-w-lg animate-fade-up grid-cols-3 gap-4 border-t border-night-600 pt-6 [animation-delay:400ms]">
              {heroPerks.map(([Icon, text]) => (
                <li key={text} className="flex flex-col gap-2.5 font-mono text-[10px] uppercase leading-snug tracking-wider text-ash sm:text-[11px]">
                  <Icon className="h-5 w-5 text-bone" />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <Link
            to="/shop"
            className="group relative mx-auto aspect-square w-full max-w-lg animate-fade-in [animation-delay:150ms]"
            aria-label={t.heroLink}
          >
            <div className="parallax absolute inset-0 rounded-full border border-night-600" data-depth="0.25" />
            <div className="absolute inset-10 animate-[spin_90s_linear_infinite] rounded-full border border-dashed border-night-600" />
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(closest-side,rgba(242,239,232,0.09),transparent)]" />

            {/* Spoljni div: ulazak sa strane + paralaksa; slika: lebdenje i hover */}
            <div className="parallax absolute right-0 top-[6%] w-[66%] animate-slide-in-right [animation-delay:350ms]" data-depth="0.6">
              <img
                src="/images/2am-still-dreaming-back.webp"
                alt={t.teeBack}
                width="950"
                height="902"
                className="w-full rotate-6 animate-float brightness-75 drop-shadow-[0_30px_60px_rgba(0,0,0,0.7)] transition-[translate,rotate,filter] duration-500 [animation-delay:-3s] group-hover:translate-x-3 group-hover:rotate-9 group-hover:brightness-100"
              />
            </div>
            <div className="parallax absolute bottom-[8%] left-0 w-[66%] animate-slide-in-left [animation-delay:500ms]" data-depth="1">
              <img
                src="/images/2am-still-dreaming-front.webp"
                alt={t.teeFront}
                width="949"
                height="908"
                fetchPriority="high"
                className="w-full -rotate-3 animate-float drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)] transition-[translate,rotate] duration-500 group-hover:-translate-x-3 group-hover:-rotate-6"
              />
            </div>
            <span className="absolute bottom-6 right-0 animate-fade-up bg-alarm px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-widest text-night [animation-delay:900ms]">
              {t.heroTag}
            </span>
          </Link>
        </div>

        {/* nagovještaj da ima još ispod */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-5 left-1/2 hidden -translate-x-1/2 animate-fade-in flex-col items-center gap-2 [animation-delay:1.2s] lg:flex"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ash">{t.scroll}</span>
          <span className="h-10 w-px bg-gradient-to-b from-ash to-transparent" />
        </div>
      </section>

      {/* POKRETNA TRAKA */}
      <div className="border-y border-night-600 bg-night-800 py-4 sm:py-5">
        <Marquee speed={45}>
          {t.ticker.map((message, i) => (
            <span key={message} className="flex items-center">
              <span className={`whitespace-nowrap px-6 font-display text-2xl uppercase tracking-wide sm:px-9 sm:text-4xl ${i % 2 ? 'text-outline' : ''}`}>
                {message}
              </span>
              <SparkIcon className="h-4 w-4 shrink-0 text-alarm sm:h-5 sm:w-5" />
            </span>
          ))}
        </Marquee>
      </div>

      {/* IZDVOJENO — sakriveno dok u shopu nema majica */}
      {!(status === 'ready' && products.length === 0) && (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <Reveal className="flex items-end justify-between gap-4">
            <div>
              <Eyebrow n="01">{t.collection}</Eyebrow>
              <SplitText as="h2" text={t.featured} className="mt-4 block font-display text-5xl uppercase sm:text-7xl" />
            </div>
            <Link to="/shop" className="group -my-2 shrink-0 py-2 font-mono text-xs uppercase tracking-widest transition-colors hover:text-alarm">
              {t.viewAll}
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

      {/* KATEGORIJE — velike pločice, svaka vodi u shop sa već izabranim filterom */}
      {categories.length > 1 && (
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:pb-28">
          <Reveal>
            <Eyebrow n="02">{t.categories}</Eyebrow>
            <SplitText as="h2" text={t.pickYours} step={20} className="mt-4 block font-display text-5xl uppercase sm:text-7xl" />
          </Reveal>
          <div className={`mt-10 grid gap-4 ${CATEGORY_COLS[categories.length] ?? 'sm:grid-cols-3'}`}>
            {categories.map((c, i) => (
              <Reveal key={c.slug} delay={i * 100} variant="scale">
                <Link
                  to={`/shop?kategorija=${c.slug}`}
                  className="group relative block aspect-[5/4] overflow-hidden bg-[radial-gradient(circle_at_50%_38%,var(--color-night-700),var(--color-night-800)_70%)] ring-1 ring-inset ring-night-600 transition-shadow duration-500 hover:ring-alarm/60 sm:aspect-[3/4]"
                >
                  {/* naziv kategorije ogromnim konturnim slovima, iza komada */}
                  <span
                    aria-hidden="true"
                    className="text-outline text-outline-dim absolute -left-1 top-3 select-none whitespace-nowrap font-display text-[clamp(4.5rem,9vw,8rem)] uppercase leading-none"
                  >
                    {categoryLabel(c.name, lang)}
                  </span>
                  <ProductImage
                    product={c.items[0]}
                    className="absolute inset-x-0 top-[8%] mx-auto h-[62%] w-[80%] transition-[scale,rotate] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-3 group-hover:scale-110"
                  />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-night via-night/80 to-transparent p-5 pt-16 sm:p-6 sm:pt-20">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-widest text-ash">
                        {t.count(c.items.length)}
                      </p>
                      <h3 className="mt-1 font-display text-4xl uppercase leading-none sm:text-5xl">{categoryLabel(c.name, lang)}</h3>
                    </div>
                    <span
                      aria-hidden="true"
                      className="grid h-12 w-12 shrink-0 place-items-center border border-night-600 text-lg transition-[background-color,border-color,color,rotate] duration-300 group-hover:-rotate-45 group-hover:border-alarm group-hover:bg-alarm group-hover:text-night"
                    >
                      →
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* MANIFEST — fotografija i priča jedno pored drugog */}
      <section className="relative overflow-hidden border-y border-night-600 bg-night-800">
        <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 animate-aurora rounded-full bg-alarm/10 blur-[100px]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:py-28">
          <Reveal variant="scale" className="relative mx-auto aspect-square w-full max-w-lg">
            <div className="absolute inset-0 bg-[radial-gradient(closest-side,rgba(255,59,47,0.2),transparent)]" />
            <p
              aria-hidden="true"
              className="text-outline text-outline-dim absolute inset-0 grid select-none place-items-center font-display text-[clamp(6rem,22vw,14rem)] leading-none"
            >
              02:00
            </p>
            {feature ? (
              <ProductImage
                product={feature}
                index={feature.images?.length > 1 ? 1 : 0}
                className="absolute inset-0 m-auto h-[84%] w-[84%] animate-float drop-shadow-[0_40px_60px_rgba(0,0,0,0.85)]"
              />
            ) : (
              <img
                src="/images/2am-still-dreaming-back.webp"
                alt={t.teeBack}
                width="950"
                height="902"
                loading="lazy"
                className="absolute inset-0 m-auto w-[84%] animate-float drop-shadow-[0_40px_60px_rgba(0,0,0,0.85)]"
              />
            )}
            <p className="absolute bottom-0 left-0 font-mono text-[10px] uppercase tracking-[0.3em] text-ash">
              {feature ? feature.name : '2AM Still Dreaming'} · {t.designedAtNight}
            </p>
          </Reveal>

          <div>
            <Eyebrow n="03">{t.manifest}</Eyebrow>
            <SplitText
              as="h2"
              parts={t.manifestTitle}
              step={18}
              className="mt-5 block font-display text-5xl uppercase leading-[0.95] sm:text-7xl"
            />
            <Reveal delay={150} className="mt-8 text-lg text-ash">
              <p>{t.manifestText}</p>
              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-night-600 pt-8 font-mono text-xs uppercase">
                <div>
                  <p className="font-display text-4xl text-bone sm:text-5xl"><Counter to={240} suffix="g" /></p>
                  <p className="mt-1">{t.stats[0]}</p>
                </div>
                <div>
                  <p className="font-display text-4xl text-bone sm:text-5xl"><Counter to={100} suffix="%" /></p>
                  <p className="mt-1">{t.stats[1]}</p>
                </div>
                <div>
                  <p className="font-display text-4xl text-bone sm:text-5xl"><Counter to={24} suffix="h" /></p>
                  <p className="mt-1">{t.stats[2]}</p>
                </div>
              </div>
              <Link
                to="/o-nama"
                className="group mt-10 inline-flex items-center gap-2 py-2 font-mono text-xs font-bold uppercase tracking-widest text-bone transition-colors hover:text-alarm"
              >
                {t.readStory}
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* KAKO IDE PORUDŽBINA — skida nedoumice prije prve kupovine */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:pt-28">
        <Reveal>
          <Eyebrow n="04">{t.howItWorks}</Eyebrow>
          <SplitText as="h2" text={t.cartToDoor} step={20} className="mt-4 block font-display text-5xl uppercase sm:text-7xl" />
        </Reveal>
        <ol className="mt-10 grid gap-px border border-night-600 bg-night-600 sm:grid-cols-3">
          {steps.map(([Icon, title, text], i) => (
            <Reveal
              as="li"
              key={title}
              delay={i * 110}
              className="group relative overflow-hidden bg-night p-8 transition-colors duration-300 hover:bg-night-800"
            >
              {/* veliki konturni redni broj; na hover se zacrveni */}
              <span
                aria-hidden="true"
                className="text-outline absolute -right-1 -top-5 select-none font-display text-[8.5rem] leading-none [--outline-c:var(--color-night-600)] group-hover:[--outline-c:var(--color-alarm)]"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <Icon className="relative h-6 w-6 text-alarm" />
              <h3 className="relative mt-16 font-display text-3xl uppercase transition-transform duration-300 group-hover:translate-x-1">
                {title}
              </h3>
              <p className="relative mt-3 text-ash">{text}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* RECENZIJE — na telefonu se listaju prstom, na većim ekranima su u mreži */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:pt-28">
        <Reveal>
          <Eyebrow n="05">{t.reviews}</Eyebrow>
          <SplitText as="h2" text={t.nightOwls} step={22} className="mt-4 block font-display text-5xl uppercase sm:text-7xl" />
        </Reveal>
        <ul className="no-scrollbar -mx-4 mt-10 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
          {reviews.map((r, i) => (
            <Reveal as="li" key={r.name} delay={i * 100} variant="blur" className="flex w-[82%] shrink-0 snap-start sm:w-auto">
              <div className="relative flex flex-1 flex-col justify-between gap-8 overflow-hidden border border-night-600 bg-night-800 p-6 transition-[translate,border-color,background-color] duration-300 hover:-translate-y-1 hover:border-ash hover:bg-night-700">
                <span aria-hidden="true" className="absolute -right-1 -top-6 select-none font-display text-[7rem] leading-none text-night-600/60">
                  „
                </span>
                <div className="relative">
                  <p className="font-mono text-sm tracking-[0.2em]">
                    <span aria-hidden="true">
                      <span className="text-alarm">{STARS.slice(0, r.rating)}</span>
                      <span className="text-night-600">{STARS.slice(r.rating, 5)}</span>
                    </span>
                    <span className="sr-only">{t.rating(r.rating)}</span>
                  </p>
                  <blockquote className="mt-4 leading-relaxed text-bone/90">
                    {t.quote(lang === 'en' ? r.text_en : r.text)}
                  </blockquote>
                </div>
                <p className="relative flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-ash">
                  <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-full bg-night-600 font-bold text-bone">
                    {r.name[0]}
                  </span>
                  {r.name} · {r.city}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* INSTAGRAM — završetak stranice: tu se najavljuju novi dropovi */}
      {INSTAGRAM_URL && (
        <Reveal as="section" variant="scale" className="pt-24 lg:pt-32">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block overflow-hidden border-y border-night-600 bg-night-800 py-14 transition-colors duration-500 hover:border-alarm/50 sm:py-20"
          >
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-alarm/15 opacity-60 blur-[90px] transition-opacity duration-500 group-hover:opacity-100" />
            <p className="relative text-center font-mono text-xs uppercase tracking-[0.3em] text-ash">{t.drops}</p>
            <Marquee speed={28} className="relative mt-8">
              <span className="flex items-center">
                <span className="text-outline text-outline-fill whitespace-nowrap px-8 font-display text-[clamp(3.5rem,11vw,9rem)] uppercase leading-none">
                  @{INSTAGRAM_HANDLE}
                </span>
                <SparkIcon className="h-8 w-8 shrink-0 text-alarm sm:h-12 sm:w-12" />
              </span>
            </Marquee>
            <span className="relative mt-8 flex items-center justify-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-alarm">
              {t.follow}
              <span className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">↗</span>
            </span>
          </a>
        </Reveal>
      )}
    </>
  )
}
