import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { COLUMNS, SIZE_CHART } from '../data/sizes.js'

const STEPS = [
  ['Grudi', 'Izmjeri svoju omiljenu majicu položenu na sto — od šava do šava ispod rukava.'],
  ['Dužina', 'Od najviše tačke ramena pravo nadolje do donje ivice.'],
  ['Rukav', 'Od ramenog šava do kraja rukava.'],
]

// Vodič za veličine. Ako tabela mjera za tu kategoriju nije popunjena
// (data/sizes.js), prikazuje se samo uputstvo kako se mjeri.
export default function SizeGuide({ open, onClose, category }) {
  const closeRef = useRef(null)
  const rows = SIZE_CHART[category] ?? []

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      previous?.focus?.()
    }
  }, [open, onClose])

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`} inert={!open}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Vodič za veličine"
        className={`absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto border-t border-night-600 bg-night p-6 transition-[translate,opacity] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] sm:inset-0 sm:m-auto sm:h-fit sm:max-w-xl sm:border sm:p-8 ${
          open ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-ash">Vodič</p>
            <h2 className="mt-2 font-display text-4xl uppercase">Veličine</h2>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            className="-m-2 p-2 text-ash transition-colors hover:text-bone"
            aria-label="Zatvori vodič za veličine"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {rows.length > 0 && (
          <div className="mt-7 overflow-x-auto">
            <table className="w-full border-collapse text-left font-mono text-sm">
              <thead>
                <tr className="border-b border-night-600 text-ash">
                  <th scope="col" className="py-3 pr-4 text-xs uppercase tracking-widest">Veličina</th>
                  {COLUMNS.map((c) => (
                    <th key={c.key} scope="col" className="py-3 pr-4 text-xs uppercase tracking-widest">
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.size} className="border-b border-night-600/60">
                    <th scope="row" className="py-3 pr-4 font-display text-xl uppercase">{r.size}</th>
                    {COLUMNS.map((c) => (
                      <td key={c.key} className="py-3 pr-4">{r[c.key] ? `${r[c.key]} cm` : '—'}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-ash">
              Mjereno na raširenom komadu · odstupanje ±2 cm
            </p>
          </div>
        )}

        <div className="mt-7 border-t border-night-600 pt-6">
          <p className="font-mono text-xs uppercase tracking-widest text-ash">Kako da izmjeriš</p>
          <ol className="mt-4 space-y-4">
            {STEPS.map(([title, text], i) => (
              <li key={title} className="flex gap-4">
                <span className="mt-0.5 font-mono text-xs text-alarm">{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <span className="block font-display text-xl uppercase">{title}</span>
                  <span className="text-sm text-ash">{text}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <p className="mt-7 border-t border-night-600 pt-6 text-sm text-ash">
          Nisi siguran?{' '}
          <Link to="/kontakt" onClick={onClose} className="text-bone underline underline-offset-4 hover:text-alarm">
            Piši nam
          </Link>{' '}
          — reći ćemo ti tačnu mjeru za komad koji te zanima.
        </p>
      </div>
    </div>
  )
}
