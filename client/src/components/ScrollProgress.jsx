import { useEffect, useRef } from 'react'

// Tanka crvena linija na vrhu ekrana — pokazuje koliko je stranice pročitano.
// Piše se direktno u DOM (bez re-rendera), pa ne opterećuje skrolovanje.
export default function ScrollProgress() {
  const barRef = useRef(null)

  useEffect(() => {
    let ticking = false

    const update = () => {
      ticking = false
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 40 ? Math.min(1, window.scrollY / max) : 0
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5" aria-hidden="true">
      <div ref={barRef} className="h-full origin-left scale-x-0 bg-alarm" />
    </div>
  )
}
