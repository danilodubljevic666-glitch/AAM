import { useEffect, useRef, useState } from 'react'

// Broj koji "istrči" od nule kad dođe u vidno polje (npr. 240g, 100%, 24h).
// Ko je isključio animacije u sistemu odmah vidi konačnu vrijednost.
const stillMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Counter({ to, suffix = '', duration = 1400, className = '' }) {
  const ref = useRef(null)
  const [value, setValue] = useState(() => (stillMotion() ? to : 0))

  useEffect(() => {
    const el = ref.current
    if (!el || stillMotion()) return

    let frame = 0
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      const start = performance.now()
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration)
        setValue(Math.round(to * (1 - Math.pow(1 - t, 3)))) // usporava pred kraj
        if (t < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    })
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [to, duration])

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {value}
      {suffix}
    </span>
  )
}
