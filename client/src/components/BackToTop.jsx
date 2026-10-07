import { useEffect, useRef, useState } from 'react'

const SHOW_AFTER = 600 // px skrolovanja prije nego što se dugme pojavi
const R = 22
const CIRCUMFERENCE = 2 * Math.PI * R

// Dugme "nazad na vrh" u donjem desnom uglu; prsten oko strelice pokazuje koliko je stranice pređeno
export default function BackToTop() {
  const [visible, setVisible] = useState(() => window.scrollY > SHOW_AFTER)
  const ringRef = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0
      // prsten se crta direktno (bez re-rendera na svaki pomjeraj)
      ringRef.current?.setAttribute('stroke-dashoffset', String(CIRCUMFERENCE * (1 - progress)))
      setVisible(window.scrollY > SHOW_AFTER)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toTop = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  return (
    <button
      onClick={toTop}
      aria-label="Nazad na vrh stranice"
      inert={!visible}
      className={`group fixed bottom-5 right-5 z-30 grid h-14 w-14 place-items-center rounded-full bg-night/90 backdrop-blur transition-[opacity,translate,scale] duration-300 hover:text-alarm active:scale-90 sm:bottom-8 sm:right-8 ${
        visible ? 'opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="24" cy="24" r={R} fill="none" strokeWidth="2" className="stroke-night-600" />
        <circle
          ref={ringRef}
          cx="24"
          cy="24"
          r={R}
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
          className="stroke-alarm"
        />
      </svg>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  )
}
