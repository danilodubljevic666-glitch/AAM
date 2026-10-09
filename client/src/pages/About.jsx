import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import SplitText from '../components/SplitText.jsx'
import { INSTAGRAM_URL } from '../lib/site.js'
import { useSeo } from '../lib/seo.js'

// Samo tvrdnje koje već stoje na sajtu (manifest na početnoj i opis brenda)
const VALUES = [
  { title: 'Teški pamuk', text: 'Majice od 240g pamuka, sa printom koji traje.' },
  { title: 'Male serije', text: 'Dizajn izlazi u malom broju komada i ne ponavlja se.' },
  { title: 'Lokalna izrada', text: 'Pravljeno ovdje, a porudžbina kreće u roku od 24h.' },
]

export default function About() {
  useSeo({
    title: 'O nama',
    description:
      'Priča iza 2AM — brenda za noćne ptice. Teški pamuk, male serije i lokalna izrada, dizajnirano noću, nošeno danju.',
  })
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
        <p className="animate-fade-up font-mono text-xs uppercase tracking-[0.3em] text-ash">O nama</p>
        <SplitText
          as="h1"
          parts={[{ t: 'Sve je počelo ' }, { t: 'u 2 ujutro.', c: 'text-alarm' }]}
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
            alt="2AM Still Dreaming majica — leđa sa natpisom Same city, different thoughts"
            width="950"
            height="902"
            loading="lazy"
            className="absolute inset-0 m-auto w-[82%] animate-float drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
          />
        </div>

        <Reveal className="space-y-6 text-lg text-ash">
          <p>
            aam je brend za noćne ptice, kreativce, studente pred ispit i sve koji svoje najbolje ideje dobiju kad bi
            trebalo da spavaju.
          </p>
          <p>
            Svaka majica je od teškog pamuka, sa printom koji traje. Male serije, lokalna izrada i dizajn koji se ne
            ponavlja.
          </p>
          <blockquote className="border-l-2 border-alarm pl-6 font-display text-4xl uppercase leading-none text-bone sm:text-5xl">
            Same city, different thoughts.
          </blockquote>
        </Reveal>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6">
        <Reveal as="h2" className="font-mono text-xs uppercase tracking-[0.3em] text-ash">
          Po čemu smo drugačiji
        </Reveal>
        {/* gap-px + pozadina = tanke linije između kartica */}
        <div className="mt-6 grid gap-px border border-night-600 bg-night-600 sm:grid-cols-3">
          {VALUES.map((v, i) => (
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
          Budni smo <span className="whitespace-nowrap text-alarm">kad i ti.</span>
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/shop"
            className="bg-bone px-8 py-4 font-mono text-xs font-bold uppercase tracking-widest text-night transition-[background-color,scale] hover:bg-alarm active:scale-[0.97]"
          >
            Pogledaj kolekciju
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
