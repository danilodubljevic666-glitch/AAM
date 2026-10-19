import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import SplitText from '../components/SplitText.jsx'
import { useT } from '../context/LanguageContext.jsx'
import { INSTAGRAM_URL } from '../lib/site.js'
import { useSeo } from '../lib/seo.js'

// values: samo tvrdnje koje već stoje na sajtu (manifest na početnoj i opis brenda)
const TEXT = {
  me: {
    seoTitle: 'O nama: brend iz Nikšića',
    seoDescription:
      'AAM Clothing je brend iz Nikšića za noćne ptice. Teški pamuk, male serije i lokalna izrada. Dizajnirano noću, nošeno danju, dostava širom Crne Gore.',
    eyebrow: 'O nama',
    title: [{ t: 'Sve je počelo ' }, { t: 'u 2 ujutro.', c: 'text-alarm' }],
    imageAlt: '2AM Still Dreaming majica, leđa sa natpisom Same city, different thoughts',
    story: [
      'AAM Clothing je brend iz Nikšića za noćne ptice, kreativce, studente pred ispit i sve koji svoje najbolje ideje dobiju kad bi trebalo da spavaju.',
      'Svaka majica je od teškog pamuka, sa printom koji traje. Male serije, lokalna izrada i dizajn koji se ne ponavlja. Dostava ide na adresu u bilo kom gradu u Crnoj Gori, a plaća se kuriru.',
    ],
    different: 'Po čemu smo drugačiji',
    values: [
      { title: 'Teški pamuk', text: 'Majice od 240g pamuka, sa printom koji traje.' },
      { title: 'Male serije', text: 'Dizajn izlazi u malom broju komada i ne ponavlja se.' },
      { title: 'Lokalna izrada', text: 'Pravljeno ovdje, a porudžbina kreće u roku od 24h.' },
    ],
    awake: 'Budni smo',
    awakeEnd: 'kad i ti.',
    shopCta: 'Pogledaj kolekciju',
  },
  en: {
    seoTitle: 'About us: a brand from Nikšić',
    seoDescription:
      'AAM Clothing is a brand from Nikšić for night owls. Heavy cotton, small batches and local production. Designed at night, worn by day, delivered across Montenegro.',
    eyebrow: 'About us',
    title: [{ t: 'It all started ' }, { t: 'at 2 a.m.', c: 'text-alarm' }],
    imageAlt: '2AM Still Dreaming tee, back with the words Same city, different thoughts',
    story: [
      'AAM Clothing is a brand from Nikšić for night owls, creatives, students cramming for exams and everyone whose best ideas show up when they should be asleep.',
      'Every tee is made of heavy cotton, with a print that lasts. Small batches, local production and designs that never repeat. We deliver to any town in Montenegro, and you pay the courier.',
    ],
    different: 'What makes us different',
    values: [
      { title: 'Heavy cotton', text: '240g cotton tees with a print that lasts.' },
      { title: 'Small batches', text: 'Each design comes out in a small run and never repeats.' },
      { title: 'Made locally', text: 'Made here, and your order ships within 24h.' },
    ],
    awake: "We're up",
    awakeEnd: 'when you are.',
    shopCta: 'Shop the collection',
  },
}

export default function About() {
  const t = useT(TEXT)
  useSeo({ title: t.seoTitle, description: t.seoDescription })
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
        <p className="animate-fade-up font-mono text-xs uppercase tracking-[0.3em] text-ash">{t.eyebrow}</p>
        <SplitText
          as="h1"
          parts={t.title}
          step={20}
          className="mt-4 block max-w-5xl font-display text-6xl uppercase leading-[0.95] sm:text-8xl"
        />
      </section>

      <section className="mx-auto mt-16 grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20">
        <div className="relative mx-auto aspect-square w-full max-w-md animate-fade-in [animation-delay:200ms]">
          <div className="absolute inset-0 rounded-full border border-night-600" />
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(closest-side,rgba(255,59,47,0.14),transparent)]" />
          <img
            src="/images/2am-still-dreaming-back.webp"
            alt={t.imageAlt}
            width="950"
            height="902"
            loading="lazy"
            className="absolute inset-0 m-auto w-[82%] animate-float drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
          />
        </div>

        <Reveal className="space-y-6 text-lg text-ash">
          {t.story.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <blockquote className="border-l-2 border-alarm pl-6 font-display text-4xl uppercase leading-none text-bone sm:text-5xl">
            Same city, different thoughts.
          </blockquote>
        </Reveal>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6">
        <Reveal as="h2" className="font-mono text-xs uppercase tracking-[0.3em] text-ash">
          {t.different}
        </Reveal>
        {/* gap-px + pozadina = tanke linije između kartica */}
        <div className="mt-6 grid gap-px border border-night-600 bg-night-600 sm:grid-cols-3">
          {t.values.map((v, i) => (
            <Reveal key={v.title} delay={i * 100} className="bg-night p-8">
              <p className="font-mono text-xs text-alarm">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="mt-8 font-display text-3xl uppercase">{v.title}</h3>
              <p className="mt-3 text-ash">{v.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal as="section" className="mx-auto mt-24 max-w-7xl px-4 text-center sm:px-6">
        <p className="font-display text-5xl uppercase leading-[0.95] sm:text-7xl">
          {t.awake} <span className="whitespace-nowrap text-alarm">{t.awakeEnd}</span>
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/shop"
            className="bg-bone px-8 py-4 font-mono text-xs font-bold uppercase tracking-widest text-night transition-[background-color,scale] hover:bg-alarm active:scale-[0.97]"
          >
            {t.shopCta}
          </Link>
          {INSTAGRAM_URL && (
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-night-600 px-8 py-4 font-mono text-xs font-bold uppercase tracking-widest transition-[border-color,scale] hover:border-bone active:scale-[0.97]"
            >
              Instagram ↗
            </a>
          )}
        </div>
      </Reveal>
    </>
  )
}
