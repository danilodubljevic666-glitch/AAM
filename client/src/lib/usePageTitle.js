import { useEffect } from 'react'

// Naslov taba u browseru: "Shop — 2AM"; bez argumenta je naslov početne
export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — 2AM` : '2AM — Same city, different thoughts'
  }, [title])
}
