import { Link } from 'react-router-dom'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../lib/site.js'

const YEAR = new Date().getFullYear()
const heading = 'font-mono text-xs uppercase tracking-widest text-ash'

// Linija ispod linka se izvlači slijeva na hover
const link =
  'relative inline-block py-1.5 transition-colors hover:text-alarm after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-alarm after:transition-transform after:duration-300 hover:after:scale-x-100'

// Ono što kupca najviše zanima prije prve kupovine
const TRUST = [
  ['Dostava', 'Širom Crne Gore'],
  ['Plaćanje', 'Pouzećem, gotovinom kuriru'],
  ['Slanje', 'U roku od 24h'],
]

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-night-600">
      <div className="mx-auto grid max-w-7xl gap-px border-b border-night-600 bg-night-600 sm:grid-cols-3">
        {TRUST.map(([title, text]) => (
          <div key={title} className="bg-night px-4 py-5 text-center sm:px-6">
            <p className={heading}>{title}</p>
            <p className="mt-1.5 text-sm">{text}</p>
          </div>
        ))}
      </div>

      {/* na telefonu: logo preko cijele širine, a dvije kolone linkova jedna pored druge */}
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="col-span-2">
          <Link to="/" aria-label="2AM — početna" className="inline-block transition-opacity hover:opacity-70">
            <img
              src="/brand/logo-full.webp"
              alt="2AM — Same city, different thoughts"
              width="1200"
              height="357"
              loading="lazy"
              className="h-auto w-64"
            />
          </Link>
          <p className="mt-4 max-w-sm text-sm text-ash">
            Majice za one koji su budni kad svi drugi spavaju. Dizajnirano noću, nošeno danju.
          </p>
          {INSTAGRAM_URL && (
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-5 inline-flex items-center gap-2.5 py-1.5 font-mono text-xs uppercase tracking-widest transition-colors hover:text-alarm"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5 transition-transform duration-300 group-hover:-rotate-6" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
              </svg>
              @{INSTAGRAM_HANDLE}
            </a>
          )}
        </div>
        <div>
          <h2 className={heading}>Shop</h2>
          <ul className="mt-3 text-sm">
            <li><Link to="/shop" className={link}>Sve majice</Link></li>
            <li><Link to="/korpa" className={link}>Korpa</Link></li>
            <li><Link to="/o-nama" className={link}>O nama</Link></li>
          </ul>
        </div>
        <div>
          <h2 className={heading}>Kontakt</h2>
          <ul className="mt-3 text-sm">
            <li><Link to="/kontakt" className={link}>Kontakt forma</Link></li>
            {INSTAGRAM_URL && (
              <li>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={link}>Instagram ↗</a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-night-600 px-4 py-5 text-center font-mono text-[11px] uppercase tracking-widest text-ash">
        © {YEAR} aam — sva prava zadržana
      </div>
    </footer>
  )
}
