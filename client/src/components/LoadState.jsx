// Prazne kartice dok se proizvodi učitavaju
export function SkeletonCards({ count }) {
  return Array.from({ length: count }, (_, i) => (
    <div key={i} aria-hidden="true">
      <div className="aspect-[4/5] animate-pulse bg-night-800" />
      <div className="mt-3 h-5 w-2/3 animate-pulse bg-night-800" />
    </div>
  ))
}

export function LoadError({ className = '' }) {
  return (
    <p className={`font-mono text-xs uppercase tracking-widest text-alarm ${className}`}>
      Proizvodi trenutno nisu dostupni. Pokušaj ponovo malo kasnije.
    </p>
  )
}
