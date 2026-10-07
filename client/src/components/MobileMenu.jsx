import { useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { CATEGORIES } from '../lib/categories.js'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../lib/site.js'

const LINKS = [
  { to: '/', label: 'Početna', end: true },
  { to: '/shop', label: 'Shop' },
  { to: '/o-nama', label: 'O nama' },
  { to: '/kontakt', label: 'Kontakt' },
]

// Krug se širi iz ugla u kom je dugme menija (gore desno)
const ORIGIN = 'calc(100% - 2.25rem) 2.1rem'

// Kaskadni ulazak stavki pri otvaranju; pri zatvaranju sve nestaje odjednom.
// extra = ostale klase elementa (spajaju se, da ih spread ne pregazi)
const enter = (open, i, extra = '') => ({
  className: `${extra} transition-[opacity,translate] duration-500 ease-out ${open ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`,
  style: { transitionDelay: open ? `${180 + i * 70}ms` : '0ms' },
})

// Meni preko čitavog ekrana — samo na telefonu (na većim ekranima linkovi su u navbaru)
export default function MobileMenu({ open, onClose }) {
  const firstLinkRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement
    const onKey = (e) => e.key === 'Escape' && onClose()
    // ako se ekran proširi (npr. tablet okrenut položeno), meni nestaje — zatvori ga da stranica ne ostane zaključana
    const desktop = window.matchMedia('(min-width: 48rem)')
    const onDesktop = (e) => e.matches && onClose()

    window.addEventListener('keydown', onKey)
    desktop.addEventListener('change', onDesktop)
    document.body.style.overflow = 'hidden'
    firstLinkRef.current?.focus({ preventScroll: true })
    return () => {
      window.removeEventListener('keydown', onKey)
      desktop.removeEventListener('change', onDesktop)
      document.body.style.overflow = ''
      previous?.focus?.()
    }
  }, [open, onClose])

  return (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Meni"
      inert={!open}
      className="fixed inset-0 z-[35] flex flex-col overflow-y-auto bg-night px-6 pb-8 pt-28 transition-[clip-path] duration-700 ease-[cubic-bezier(0.7,0,0.2,1)] md:hidden"
      style={{ clipPath: `circle(${open ? '150%' : '0%'} at ${ORIGIN})` }}
    >
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-alarm/15 blur-[100px]" />

      <nav className="relative flex flex-col gap-1">
        {LINKS.map((l, i) => (
          <div key={l.to} {...enter(open, i)}>
            <NavLink
              ref={i === 0 ? firstLinkRef : undefined}
              to={l.to}
              end={l.end}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-start gap-4 py-1 font-display text-[clamp(3rem,15vw,4.5rem)] uppercase leading-none transition-colors ${
                  isActive ? 'text-alarm' : 'active:text-alarm'
                }`
              }
            >
              <span className="mt-2 w-6 shrink-0 font-mono text-xs text-ash">{String(i + 1).padStart(2, '0')}</span>
              <span className="transition-transform duration-300 group-hover:translate-x-2">{l.label}</span>
            </NavLink>
          </div>
        ))}
      </nav>

      <div {...enter(open, LINKS.length, 'relative mt-10')}>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ash">Kategorije</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to={`/shop?kategorija=${c.slug}`}
              onClick={onClose}
              className="border border-night-600 px-3 py-2 font-mono text-xs uppercase tracking-widest transition-colors active:border-bone active:bg-bone active:text-night"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      <div {...enter(open, LINKS.length + 1, 'relative mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-night-600 pt-6')}>
        <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.3em] text-ash">
          Same city,
          <br />
          different thoughts
        </p>
        {INSTAGRAM_URL && (
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="font-mono text-xs uppercase tracking-widest active:text-alarm">
            @{INSTAGRAM_HANDLE} ↗
          </a>
        )}
      </div>
    </div>
  )
}
