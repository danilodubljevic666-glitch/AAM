import { useT } from '../context/LanguageContext.jsx'

// Prazne kartice dok se proizvodi učitavaju — oblik je isti kao kod prave kartice,
// pa stranica ne poskoči kad podaci stignu (bez "skakanja" rasporeda).
export function SkeletonCards({ count }) {
  return Array.from({ length: count }, (_, i) => (
    <div key={i} aria-hidden="true" className="animate-fade-in" style={{ animationDelay: `${i * 70}ms` }}>
      <div className="skeleton aspect-[4/5]" />
      <div className="skeleton mt-3 h-5 w-2/3" />
      <div className="skeleton mt-2 h-3 w-1/3" />
    </div>
  ))
}

const TEXT = {
  me: { title: 'Proizvodi trenutno nisu dostupni', text: 'Pokušaj ponovo malo kasnije.', reload: 'Osvježi stranicu' },
  en: { title: 'Products are not available right now', text: 'Please try again a little later.', reload: 'Refresh page' },
}

export function LoadError({ className = '' }) {
  const t = useT(TEXT)
  return (
    <div className={`border border-alarm/40 bg-alarm/5 px-6 py-8 text-center ${className}`}>
      <p className="font-mono text-xs uppercase tracking-widest text-alarm">{t.title}</p>
      <p className="mt-2 text-sm text-ash">{t.text}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-5 border border-night-600 px-5 py-2.5 font-mono text-xs uppercase tracking-widest transition-colors hover:border-bone"
      >
        {t.reload}
      </button>
    </div>
  )
}
