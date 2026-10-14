// Traka sa tekstom koja beskonačno klizi (poruke ispod hero dijela, Instagram).
// Sadržaj se ponavlja `repeat` puta u svakoj od dvije polovine, da jedna polovina bude
// šira od ekrana, a druga polovina je tu da kraj neprimjetno pređe u početak (index.css).
// Čitač ekrana čuje samo prvu kopiju; ko je isključio animacije vidi traku kako stoji.
// U traku ide samo tekst, ne linkovi (kopije bi se inače mogle fokusirati tabom).
export default function Marquee({ children, speed = 30, reverse = false, repeat = 2, className = '' }) {
  const copies = (half) =>
    Array.from({ length: repeat }, (_, i) => (
      <div key={i} className="flex shrink-0 items-center" aria-hidden={half > 0 || i > 0 || undefined}>
        {children}
      </div>
    ))

  return (
    <div className={`marquee ${className}`} data-reverse={reverse || undefined}>
      <div className="marquee-track" style={{ '--marquee-speed': `${speed}s` }}>
        {copies(0)}
        {copies(1)}
      </div>
    </div>
  )
}
