import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { formatPrice } from '../lib/format.js'
import CartLine from './CartLine.jsx'

export default function CartDrawer() {
  const { items, total, isOpen, setIsOpen } = useCart()
  const closeRef = useRef(null)

  // Dok je korpa otvorena: Esc je zatvara, stranica iza se ne skroluje, fokus je u korpi
  useEffect(() => {
    if (!isOpen) return
    const previous = document.activeElement
    const onKey = (e) => e.key === 'Escape' && setIsOpen(false)
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
        className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-night-600 bg-night transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Korpa"
      >
        <div className="flex items-center justify-between border-b border-night-600 px-6 py-5">
          <h2 className="font-display text-2xl uppercase">Korpa</h2>
          <button ref={closeRef} onClick={() => setIsOpen(false)} className="font-mono text-xs uppercase tracking-widest hover:text-alarm">
            Zatvori
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="font-display text-5xl text-night-600">02:00</p>
            <p className="text-ash">Korpa je prazna. Još je rano.</p>
            <Link to="/shop" onClick={() => setIsOpen(false)} className="font-mono text-xs uppercase tracking-widest text-alarm hover:underline">
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
              <div className="flex justify-between font-mono text-sm">
                <span className="uppercase text-ash">Ukupno</span>
                <span>{formatPrice(total)}</span>
              </div>
              <Link
                to="/narudzba"
                onClick={() => setIsOpen(false)}
                className="mt-4 block bg-bone py-4 text-center font-mono text-xs font-bold uppercase tracking-widest text-night transition-[background-color,scale] hover:bg-alarm active:scale-[0.98]"
              >
                Naruči
              </Link>
              <Link
                to="/korpa"
                onClick={() => setIsOpen(false)}
                className="mt-3 block text-center font-mono text-[11px] uppercase tracking-widest text-ash hover:text-bone"
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
