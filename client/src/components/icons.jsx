// Ikonice koje se ponavljaju na više mjesta (dostava, plaćanje, slanje).
// Linijske, iste debljine kao ikonica korpe u navbaru; boja dolazi iz teksta (currentColor).
const line = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export function TruckIcon({ className = 'h-5 w-5' }) {
  return (
    <svg {...line} className={className}>
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </svg>
  )
}

export function CashIcon({ className = 'h-5 w-5' }) {
  return (
    <svg {...line} className={className}>
      <rect width="20" height="12" x="2" y="6" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  )
}

export function BoxIcon({ className = 'h-5 w-5' }) {
  return (
    <svg {...line} className={className}>
      <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
      <path d="M12 22V12" />
      <path d="m3.3 7 7.7 4.73a2 2 0 0 0 2 0L20.7 7" />
      <path d="m7.5 4.27 9 5.15" />
    </svg>
  )
}

// Zvjezdica sa četiri kraka: razdjelnik u pokretnim trakama i oznaka u listama prednosti
export function SparkIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 0c0 6.63 5.37 12 12 12-6.63 0-12 5.37-12 12 0-6.63-5.37-12-12-12 6.63 0 12-5.37 12-12Z" />
    </svg>
  )
}
