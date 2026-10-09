import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { formatPrice } from '../lib/format.js'
import { shippingFor } from '../lib/shipping.js'
import CartLine from './CartLine.jsx'

export default function CartDrawer() {
  const { items, count, total, isOpen, setIsOpen } = useCart()
  const closeRef = useRef(null)
  const panelRef = useRef(null)
  const shipping = shippingFor(total)

  // Dok je korpa otvorena: Esc je zatvara, stranica iza se ne skroluje,
  // a Tab kruži unutar korpe (ne "pobjegne" na sadržaj iza).
  useEffect(() => {
    if (!isOpen) return
    const previous = document.activeElement

    const onKey = (e) => {
      if (e.key === 'Escape') return setIsOpen(false)
      if (e.key !== 'Tab') return

      const focusable = panelRef.current?.querySelectorAll(
        'a[href], button:not(:disabled), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      previous?.focus?.()
    }
  }, [isOpen, setIsOpen])

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? '' : 'pointer-events-none'}`} inert={!isOpen}>
      <div
        onClick={() => setIsOpen(false)}
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-400 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <aside
        ref={panelRef}
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-night-600 bg-night shadow-[-30px_0_60px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Korpa"
      >
        <div className="flex items-center justify-between border-b border-night-600 px-6 py-5">
          <h2 className="font-display text-2xl uppercase">
            Korpa
            {count > 0 && <span className="ml-2 font-mono text-xs tracking-widest text-ash">({count})</span>}
          </h2>
          <button
            ref={closeRef}
            onClick={() => setIsOpen(false)}
            className="-m-2 p-2 text-ash transition-colors hover:text-bone"
            aria-label="Zatvori korpu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="animate-fade-up font-display text-5xl text-night-600">02:00</p>
            <p className="animate-fade-up text-ash [animation-delay:80ms]">Korpa je prazna. Još je rano.</p>
            <Link
              to="/shop"
              onClick={() => setIsOpen(false)}
              className="animate-fade-up px-2 py-2 font-mono text-xs uppercase tracking-widest text-alarm [animation-delay:160ms] hover:underline"
            >
              Pogledaj majice →
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-night-600 overflow-y-auto px-6">
              {items.map((item) => (
                <CartLine key={`${item.id}-${item.size}`} item={item} />
              ))}
            </ul>
            <div className="border-t border-night-600 px-6 py-5">
              <dl className="space-y-2 font-mono text-sm">
                <div className="flex justify-between">
                  <dt className="uppercase text-ash">Međuzbir</dt>
                  <dd>{formatPrice(total)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="uppercase text-ash">Dostava</dt>
                  <dd>{shipping ? formatPrice(shipping) : 'Besplatno'}</dd>
                </div>
                <div className="flex justify-between border-t border-night-600 pt-2 text-base">
                  <dt className="uppercase">Ukupno</dt>
                  <dd>{formatPrice(total + shipping)}</dd>
                </div>
              </dl>
              <Link
                to="/narudzba"
                onClick={() => setIsOpen(false)}
                className="btn-shine mt-5 block bg-bone py-4 text-center font-mono text-xs font-bold uppercase tracking-widest text-night transition-[background-color,scale] hover:bg-alarm active:scale-[0.98]"
              >
                Naruči
              </Link>
              <Link
                to="/korpa"
                onClick={() => setIsOpen(false)}
                className="mt-2 block py-2 text-center font-mono text-[11px] uppercase tracking-widest text-ash transition-colors hover:text-bone"
              >
                Pregled korpe
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
