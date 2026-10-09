import { useEffect, useRef } from 'react'

// Blago pomjeranje slojeva za kursorom — daje dubinu bez teških biblioteka.
// Ref ide na zajednički okvir; pomjeraju se djeca koja imaju data-depth
// (npr. data-depth="0.5" = upola slabije od data-depth="1").
// Isključeno na telefonu (nema kursora) i kad korisnik traži manje animacija.
export function useParallax(strength = 34) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(hover: hover)').matches) return

    const layers = el.querySelectorAll('[data-depth]')
    let frame = 0

    const move = (e) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width - 0.5
        const y = (e.clientY - r.top) / r.height - 0.5
        layers.forEach((layer) => {
          const depth = Number(layer.dataset.depth) || 0
          layer.style.setProperty('--px', (x * depth * strength).toFixed(2))
          layer.style.setProperty('--py', (y * depth * strength).toFixed(2))
        })
      })
    }

    const reset = () => {
      cancelAnimationFrame(frame)
      layers.forEach((layer) => {
        layer.style.setProperty('--px', '0')
        layer.style.setProperty('--py', '0')
      })
    }

    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', reset)
    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', reset)
    }
  }, [strength])

  return ref
}
