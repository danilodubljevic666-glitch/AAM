export default function Marquee({ items, className = '' }) {
  const row = [...items, ...items]
  return (
    <div className={`overflow-hidden border-y border-night-600 py-3 ${className}`}>
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-display text-2xl uppercase tracking-wide hover:[animation-play-state:paused]">
        {[...row, ...row].map((item, i) => (
          <span key={i} className="flex items-center gap-10" aria-hidden={i >= items.length}>
            {item}
            <span className="text-alarm">✶</span>
          </span>
        ))}
      </div>
    </div>
  )
}
