import { Link, useLocation } from 'react-router-dom'
import { useSeo } from '../lib/seo.js'

const links = [
  { to: '/', label: 'Početna' },
  { to: '/shop', label: 'Shop' },
  { to: '/kontakt', label: 'Kontakt' },
]

// message — npr. za majicu koja ne postoji; inače opšta poruka
export default function NotFound({ message = 'Ova stranica je otišla na spavanje.' }) {
  useSeo({ title: 'Stranica ne postoji', noIndex: true })
  const { pathname } = useLocation()

  return (
    <section className="relative mx-auto flex max-w-7xl flex-col items-center overflow-hidden px-4 py-24 text-center sm:px-6">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 animate-glow rounded-full bg-alarm/10 blur-[110px]" />

      <p className="relative animate-fade-up font-mono text-xs uppercase tracking-[0.3em] text-ash">Greška 404</p>

      <h1 className="relative mt-4 animate-fade-up font-display text-[clamp(7rem,28vw,16rem)] leading-none [animation-delay:100ms]">
        4
        <span className="relative inline-block">
          <span className="animate-blink text-alarm">0</span>
          {/* "Z z z" — stranica spava */}
          <span aria-hidden="true" className="absolute -right-2 top-[18%] font-mono text-[0.12em] text-ash">
            {[0, 0.8, 1.6].map((delay) => (
              <span key={delay} className="absolute animate-zzz opacity-0" style={{ animationDelay: `${delay}s` }}>
                Z
              </span>
            ))}
          </span>
        </span>
        4
      </h1>

      <p className="relative mt-6 max-w-md animate-fade-up text-lg text-ash [animation-delay:200ms]">{message}</p>
      <p className="relative mt-2 max-w-full animate-fade-up truncate font-mono text-xs text-ash/60 [animation-delay:250ms]">{pathname}</p>

      <nav className="relative mt-10 flex animate-fade-up flex-wrap justify-center gap-3 [animation-delay:350ms]" aria-label="Korisni linkovi">
        {links.map((l, i) => (
          <Link
            key={l.to}
            to={l.to}
            className={`px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest transition-[background-color,border-color,scale] active:scale-[0.97] ${
              i === 0 ? 'bg-bone text-night hover:bg-alarm' : 'border border-night-600 hover:border-bone'
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </section>
  )
}
