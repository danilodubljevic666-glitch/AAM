import { Link } from 'react-router-dom'
import { INSTAGRAM_URL } from '../lib/site.js'

const YEAR = new Date().getFullYear()
const heading = 'font-mono text-xs uppercase tracking-widest text-ash'
const link = 'transition-colors hover:text-alarm'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-night-600">
      {/* na telefonu: logo preko cijele širine, a dvije kolone linkova jedna pored druge */}
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="col-span-2">
          <img
            src="/brand/logo-full.webp"
            alt="2AM — Same city, different thoughts"
            width="1200"
            height="357"
            loading="lazy"
            className="h-auto w-64"
          />
          <p className="mt-4 max-w-sm text-sm text-ash">
            Majice za one koji su budni kad svi drugi spavaju. Dizajnirano noću, nošeno danju.
          </p>
        </div>
        <div>
          <h2 className={heading}>Shop</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/shop" className={link}>Sve majice</Link></li>
            <li><Link to="/korpa" className={link}>Korpa</Link></li>
            <li><Link to="/o-nama" className={link}>O nama</Link></li>
          </ul>
        </div>
        <div>
          <h2 className={heading}>Kontakt</h2>
          <ul className="mt-4 space-y-2 text-sm">
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
