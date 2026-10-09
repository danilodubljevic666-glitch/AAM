import { useCallback } from 'react'
import { flushSync } from 'react-dom'
import { useNavigate } from 'react-router-dom'

// Slika proizvoda "putuje" sa liste na stranicu proizvoda (View Transitions API).
//
// Zašto ručno, a ne preko react-router-a: njegov useViewTransitionState radi samo uz
// createBrowserRouter, a ovaj projekat koristi <BrowserRouter>. Ovako nema prepravke
// cijelog rutiranja, a browseri bez podrške jednostavno dobiju običnu navigaciju.

const NAME = 'product-image'
let pending = false

const canMorph = () =>
  typeof document !== 'undefined' &&
  typeof document.startViewTransition === 'function' &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Browser dozvoljava samo jedno isto ime po stranici — prije nego ga damo novoj
// slici, skidamo ga sa svih ostalih.
function markTarget(el) {
  document.querySelectorAll(`[data-morph="${NAME}"]`).forEach((other) => {
    other.removeAttribute('data-morph')
    other.style.viewTransitionName = ''
  })
  if (!el) return
  el.dataset.morph = NAME
  el.style.viewTransitionName = NAME
}

// Čita se pri renderu stranice proizvoda — zato ne smije da mijenja stanje
export const isMorphing = () => pending
export const endMorph = () => {
  pending = false
}

// Vraća funkciju: klik na karticu → označi sliku i pređi na stranicu proizvoda
export function useMorphNavigate() {
  const navigate = useNavigate()

  return useCallback(
    (to, imageEl) => {
      if (!canMorph()) return navigate(to)

      markTarget(imageEl)
      pending = true
      document.startViewTransition(() => {
        // flushSync: nova stranica mora biti u DOM-u prije nego je browser "fotografiše"
        flushSync(() => navigate(to))
        window.scrollTo({ top: 0, behavior: 'instant' })
      })
    },
    [navigate],
  )
}

// Klik koji treba prepustiti browseru (novi tab, srednji taster…)
export const isPlainClick = (e) =>
  e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey
