import { useCallback, useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import MobileMenu from './MobileMenu.jsx'

const links = [
  { to: '/shop', label: 'Shop' },
  { to: '/o-nama', label: 'O nama' },
  { to: '/kontakt', label: 'Kontakt' },
]

// Tri linije koje se pretvore u X
const bar =
  'absolute right-0 top-1/2 -mt-px h-0.5 bg-current transition-[translate,rotate,opacity,scale,width] duration-300 ease-out'

export default function Navbar() {
  const { count, isOpen, setIsOpen } = useCart()
  const { pathname } = useLocation()
  // Meni je otvoren samo na stranici na kojoj je otvoren — svaka navigacija ga zatvara
  const [menuOpenAt, setMenuOpenAt] = useState(null)
  const menuOpen = menuOpenAt === pathname
  const closeMenu = useCallback(() => setMenuOpenAt(null), [])

  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)

  // Zaglavlje se sklanja kad se skroluje nadolje (više prostora za sadržaj)
  // i odmah vraća čim se krene nagore. Dok je otvoren meni ili korpa — ostaje.
  useEffect(() => {
    if (menuOpen || isOpen) return // dok je nešto otvoreno, zaglavlje ostaje na mjestu
    let lastY = window.scrollY
    let ticking = false

    const update = () => {
      ticking = false
      const y = window.scrollY
      setScrolled(y > 12)
      setHidden(y > 180 && y > lastY + 4)
      lastY = y
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [menuOpen, isOpen])

  // Zaglavlje se nikad ne krije dok je otvoren meni ili korpa — iz njega se zatvaraju
  const hide = hidden && !menuOpen && !isOpen

  const linkClass = ({ isActive }) =>
    `relative font-mono text-xs uppercase tracking-widest transition-colors hover:text-alarm after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:bg-alarm after:transition-transform after:duration-300 hover:after:scale-x-100 ${
      isActive ? 'text-alarm after:scale-x-100' : 'after:scale-x-0'
    }`

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-[translate] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          hide ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div
          className={`border-b backdrop-blur transition-colors duration-300 ${
            scrolled ? 'border-night-600 bg-night/90' : 'border-night-600/50 bg-night/70'
          }`}
        >
          <nav
            className={`mx-auto flex max-w-7xl items-center justify-between px-4 transition-[padding] duration-300 sm:px-6 ${
              scrolled ? 'py-3' : 'py-4'
            }`}
          >
            <Link to="/" onClick={closeMenu} aria-label="2AM — početna" className="transition-opacity hover:opacity-70">
              <img
                src="/brand/logo-mark.webp"
                alt="2AM"
                width="491"
                height="120"
                className={`w-auto transition-[height] duration-300 ${scrolled ? 'h-6' : 'h-7'}`}
              />
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
                // -mr-1 px-1 h-11: ikonica je sama po sebi 20px, a prstu treba 44px
                className="group -mr-1 flex h-11 items-center gap-2 px-1 font-mono text-xs uppercase tracking-widest transition-colors hover:text-alarm"
                aria-label={`Otvori korpu (${count} ${count === 1 ? 'artikal' : 'artikala'})`}
              >
                <span className="relative">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  >
                    <path d="M5.5 7h13l-1.1 13.1H6.6L5.5 7Z" strokeLinejoin="round" />
                    <path d="M9 7V5.8a3 3 0 0 1 6 0V7" />
                  </svg>
                  {count > 0 && (
                    <span
                      key={count}
                      className="absolute -right-2 -top-2 grid h-[18px] min-w-[18px] animate-bump place-items-center rounded-full bg-alarm px-1 text-[10px] font-bold text-night"
                    >
                      {count}
                    </span>
                  )}
                </span>
                <span className="hidden sm:inline">Korpa</span>
              </button>

              <button
                onClick={() => setMenuOpenAt(menuOpen ? null : pathname)}
                className="relative -mr-2 h-11 w-11 md:hidden"
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
        </div>
      </header>

      {/* Van headera: backdrop-blur bi inače "zarobio" fixed meni u visinu headera */}
      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </>
  )
}
