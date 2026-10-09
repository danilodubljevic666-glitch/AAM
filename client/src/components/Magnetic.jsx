import { useEffect, useRef } from 'react'

// Dugme se "lijepi" za kursor dok je blizu, pa se vrati kad miš ode.
// Kašnjenje od 350ms je ono što daje osjećaj magneta, a ne trzaja.
export default function Magnetic({ children, strength = 0.3, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0

    const move = (e) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        const dx = (e.clientX - (r.left + r.width / 2)) * strength
        const dy = (e.clientY - (r.top + r.height / 2)) * strength
        el.style.translate = `${dx.toFixed(1)}px ${dy.toFixed(1)}px`
      })
    }

    const reset = () => {
      cancelAnimationFrame(frame)
      el.style.translate = ''
    }

    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', reset)
    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', reset)
    }
  }, [strength])

  return (
    <span ref={ref} className={`inline-block transition-[translate] duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${className}`}>
      {children}
    </span>
  )
}
