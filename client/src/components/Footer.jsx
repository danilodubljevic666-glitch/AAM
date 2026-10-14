import { Link } from 'react-router-dom'
import { useProducts } from '../context/ProductsContext.jsx'
import { CATEGORIES } from '../lib/categories.js'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../lib/site.js'
import { BoxIcon, CashIcon, SparkIcon, TruckIcon } from './icons.jsx'

const YEAR = new Date().getFullYear()
const heading = 'font-mono text-xs uppercase tracking-widest text-ash'

// Linija ispod linka se izvlači slijeva na hover
const link =
  'relative inline-block py-1.5 transition-colors hover:text-alarm after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-alarm after:transition-transform after:duration-300 hover:after:scale-x-100'

// Ono što kupca najviše zanima prije prve kupovine
const TRUST = [
  [TruckIcon, 'Dostava', 'Širom Crne Gore'],
  [BoxIcon, 'Slanje', 'U roku od 24h'],
  [CashIcon, 'Plaćanje', 'Pouzećem, gotovinom kuriru'],
  [SparkIcon, 'Male serije', 'Dizajn koji se ne ponavlja'],
]

export default function Footer() {
  // Linkovi samo na kategorije u kojima ima nečega (dok se katalog učitava, sve)
  const { products, status } = useProducts()
  const categories =
    status === 'ready' ? CATEGORIES.filter((c) => products.some((p) => p.category === c.name)) : CATEGORIES

  return (
    <footer className="mt-24 overflow-hidden border-t border-night-600">
      <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-px border-b border-night-600 bg-night-600 lg:grid-cols-4">
        {TRUST.map(([Icon, title, text]) => (
          <li key={title} className="flex items-start gap-4 bg-night px-4 py-6 sm:px-6">
            <Icon className="mt-0.5 h-5 w-5 shrink-0 text-alarm" />
            <div>
              <p className={heading}>{title}</p>
              <p className="mt-1.5 text-sm">{text}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* na telefonu: logo preko cijele širine, a kolone linkova jedna pored druge */}
      <div className="mx-auto grid max-w-7xl grid-cols-3 gap-x-6 gap-y-10 px-4 py-14 sm:px-6 md:grid-cols-5">
        <div className="col-span-3 md:col-span-2">
          <Link to="/" aria-label="AAM Clothing, početna" className="inline-block transition-opacity hover:opacity-70">
            <img
              src="/brand/logo-full.webp"
              alt="AAM Clothing 2AM logo, Same city, different thoughts"
              width="1200"
              height="357"
              loading="lazy"
              className="h-auto w-64"
            />
          </Link>
          <p className="mt-4 max-w-sm text-sm text-ash">
            Majice za one koji su budni kad svi drugi spavaju. Dizajnirano noću, nošeno danju.
          </p>
          {/* Isto ime i grad na svakoj stranici: Google tako povezuje brend sa Nikšićem */}
          <p className="mt-3 font-mono text-xs uppercase tracking-widest text-bone">AAM Clothing · Nikšić, Crna Gora</p>
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
            <li><Link to="/shop" className={link}>Sve iz kolekcije</Link></li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link to={`/shop?kategorija=${c.slug}`} className={link}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className={heading}>Brend</h2>
          <ul className="mt-3 text-sm">
            <li><Link to="/o-nama" className={link}>O nama</Link></li>
            <li><Link to="/korpa" className={link}>Korpa</Link></li>
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

      {/* ogroman natpis koji se gubi u pozadini; čisto ukrasan, ime već stoji iznad */}
      <p
        aria-hidden="true"
        className="pointer-events-none -mb-[0.12em] select-none whitespace-nowrap bg-gradient-to-b from-night-600 to-night bg-clip-text text-center font-display text-[16.5vw] uppercase leading-[0.8] text-transparent"
      >
        AAM Clothing
      </p>

      <div className="relative border-t border-night-600 bg-night px-4 py-5 text-center font-mono text-[11px] uppercase tracking-widest text-ash">
        © {YEAR} AAM Clothing, Nikšić. Sva prava zadržana.
      </div>
    </footer>
  )
}
