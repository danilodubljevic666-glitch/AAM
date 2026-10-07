import { useCallback, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import MobileMenu from './MobileMenu.jsx'

const links = [
  { to: '/shop', label: 'Shop' },
  { to: '/o-nama', label: 'O nama' },
  { to: '/kontakt', label: 'Kontakt' },
]

// Tri linije koje se pretvore u X
const bar = 'absolute right-0 top-1/2 -mt-px h-0.5 bg-current transition-[translate,rotate,opacity,scale,width] duration-300 ease-out'

export default function Navbar() {
  const { count, setIsOpen } = useCart()
  const { pathname } = useLocation()
  // Meni je otvoren samo na stranici na kojoj je otvoren — svaka navigacija ga zatvara
  const [menuOpenAt, setMenuOpenAt] = useState(null)
  const menuOpen = menuOpenAt === pathname
  const closeMenu = useCallback(() => setMenuOpenAt(null), [])

  const linkClass = ({ isActive }) =>
    `relative font-mono text-xs uppercase tracking-widest transition-colors hover:text-alarm after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:bg-alarm after:transition-transform after:duration-300 hover:after:scale-x-100 ${
      isActive ? 'text-alarm after:scale-x-100' : 'after:scale-x-0'
    }`

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-night-600 bg-night/85 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" onClick={closeMenu} aria-label="2AM — početna">
            <img src="/brand/logo-mark.webp" alt="2AM" width="491" height="120" className="h-7 w-auto" />
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                closeMenu()
                setIsOpen(true)
              }}
              className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest hover:text-alarm"
              aria-label={`Otvori korpu (${count})`}
            >
              Korpa
              <span key={count} className="grid h-6 min-w-6 animate-bump place-items-center rounded-full bg-bone px-1.5 text-[11px] font-bold text-night">
                {count}
              </span>
            </button>
            <button
              onClick={() => setMenuOpenAt(menuOpen ? null : pathname)}
              className="relative -mr-2 h-10 w-10 md:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Zatvori meni' : 'Otvori meni'}
            >
              <span className="absolute inset-y-0 left-2 right-2" aria-hidden="true">
                <span className={`${bar} w-full ${menuOpen ? 'translate-y-0 rotate-45' : '-translate-y-[7px]'}`} />
                <span className={`${bar} w-3/5 ${menuOpen ? 'scale-x-0 opacity-0' : ''}`} />
                <span className={`${bar} ${menuOpen ? 'w-full translate-y-0 -rotate-45' : 'w-4/5 translate-y-[7px]'}`} />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Van headera: backdrop-blur bi inače "zarobio" fixed meni u visinu headera */}
      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </>
  )
}
