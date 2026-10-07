import { Link } from 'react-router-dom'
import { INSTAGRAM_URL } from '../lib/site.js'

const YEAR = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-night-600">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
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
          <h4 className="font-mono text-xs uppercase tracking-widest text-ash">Shop</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/shop" className="hover:text-alarm">Sve majice</Link></li>
            <li><Link to="/korpa" className="hover:text-alarm">Korpa</Link></li>
            <li><Link to="/o-nama" className="hover:text-alarm">O nama</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-mono text-xs uppercase tracking-widest text-ash">Kontakt</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/kontakt" className="hover:text-alarm">Kontakt forma</Link></li>
            <li>
              {INSTAGRAM_URL ? (
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-alarm">Instagram</a>
              ) : (
                'Instagram'
              )}
            </li>
            <li>TikTok</li>
            <li>info@aam.rs</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-night-600 px-4 py-5 text-center font-mono text-[11px] uppercase tracking-widest text-ash">
        © {YEAR} aam — sva prava zadržana
      </div>
    </footer>
  )
}
