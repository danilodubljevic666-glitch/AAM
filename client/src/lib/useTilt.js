import { useEffect, useRef } from 'react'

// Kartica se blago naginje za kursorom — kao da je fizički predmet pod staklom.
// Ugao ide kroz CSS promjenljive (--rx/--ry), pa React ne re-renderuje ništa.
export function useTilt(max = 7) {
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
        const x = (e.clientX - r.left) / r.width - 0.5
        const y = (e.clientY - r.top) / r.height - 0.5
        el.style.setProperty('--ry', `${(x * max * 2).toFixed(2)}deg`)
        el.style.setProperty('--rx', `${(-y * max * 2).toFixed(2)}deg`)
      })
    }

    const reset = () => {
      cancelAnimationFrame(frame)
      el.style.setProperty('--rx', '0deg')
      el.style.setProperty('--ry', '0deg')
    }

    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', reset)
    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', reset)
    }
  }, [max])

  return ref
}
