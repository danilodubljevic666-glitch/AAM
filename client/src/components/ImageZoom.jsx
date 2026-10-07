import { useRef, useState } from 'react'

const clamp = (n) => Math.min(100, Math.max(0, n))

// Zum slike proizvoda. Mišem: slika se uveća čim pređeš preko nje i prati kursor (klik isključi/uključi).
// Na telefonu: dodir uključi/isključi zum, a prevlačenjem prsta razgledaš detalje.
export default function ImageZoom({ children, scale = 2.2, className = '' }) {
  const [zoomed, setZoomed] = useState(false)
  const innerRef = useRef(null)

  // Tačka uveličanja se pomjera direktno kroz style (bez re-rendera na svaki pokret miša)
  const aim = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const x = clamp(((e.clientX - r.left) / r.width) * 100)
    const y = clamp(((e.clientY - r.top) / r.height) * 100)
    innerRef.current.style.transformOrigin = `${x}% ${y}%`
  }

  return (
    <div
      className={`overflow-hidden ${zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'} ${className}`}
      // dok je zum uključen na telefonu, prevlačenje pomjera sliku umjesto da skroluje stranicu
      style={{ touchAction: zoomed ? 'none' : undefined }}
      onPointerEnter={(e) => {
        if (e.pointerType !== 'mouse') return
        aim(e)
        setZoomed(true)
      }}
      onPointerMove={(e) => (e.pointerType === 'mouse' || zoomed) && aim(e)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setZoomed(false)}
      onClick={(e) => {
        aim(e)
        setZoomed((z) => !z)
      }}
    >
      <div
        ref={innerRef}
        className="relative h-full w-full transition-transform duration-300 ease-out"
        style={{ transform: zoomed ? `scale(${scale})` : undefined }}
      >
        {children}
      </div>

      <span
        aria-hidden="true"
        className={`pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 bg-night/80 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-ash transition-opacity duration-300 ${
          zoomed ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-4-4M11 8v6M8 11h6" />
        </svg>
        <span className="pointer-coarse:hidden">Pređi mišem za zum</span>
        <span className="hidden pointer-coarse:inline">Dodirni za zum</span>
      </span>
    </div>
  )
}
