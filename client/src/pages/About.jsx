import { Link } from 'react-router-dom'
import { usePageTitle } from '../lib/usePageTitle.js'

export default function About() {
  usePageTitle('O nama')
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <p className="animate-fade-up font-mono text-xs uppercase tracking-[0.3em] text-ash">O nama</p>
      <h1 className="mt-4 animate-fade-up font-display [animation-delay:100ms] text-6xl uppercase leading-[0.95] sm:text-8xl">
        Sve je počelo <span className="text-alarm">u 2 ujutro.</span>
      </h1>
      <div className="mt-12 grid animate-fade-up gap-8 text-lg text-ash [animation-delay:250ms] md:grid-cols-2">
        <p>
          aam je brend za noćne ptice, kreativce, studente pred ispit i sve koji svoje najbolje ideje dobiju kad bi
          trebalo da spavaju.
        </p>
        <p>
          Svaka majica je od teškog pamuka, sa printom koji traje. Male serije, lokalna izrada i dizajn koji se ne
          ponavlja.
        </p>
      </div>
      <Link to="/shop" className="mt-12 inline-block animate-fade-up bg-bone px-8 py-4 font-mono text-xs font-bold uppercase tracking-widest text-night transition-[background-color,scale] [animation-delay:400ms] hover:bg-alarm active:scale-[0.97]">
        Pogledaj kolekciju
      </Link>
    </section>
  )
}
