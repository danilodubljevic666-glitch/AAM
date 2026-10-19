import { Link } from 'react-router-dom'
import { useLang, useT } from '../context/LanguageContext.jsx'
import { useProducts } from '../context/ProductsContext.jsx'
import { CATEGORIES, categoryLabel } from '../lib/categories.js'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../lib/site.js'
import { BoxIcon, CashIcon, SparkIcon, TruckIcon } from './icons.jsx'

const YEAR = new Date().getFullYear()
const heading = 'font-mono text-xs uppercase tracking-widest text-ash'

// Linija ispod linka se izvlači slijeva na hover
const link =
  'relative inline-block py-1.5 transition-colors hover:text-alarm after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-alarm after:transition-transform after:duration-300 hover:after:scale-x-100'

// trust = ono što kupca najviše zanima prije prve kupovine; ikonice idu istim redom
const TRUST_ICONS = [TruckIcon, BoxIcon, CashIcon, SparkIcon]

const TEXT = {
  me: {
    trust: [
      ['Dostava', 'Širom Crne Gore'],
      ['Slanje', 'U roku od 24h'],
      ['Plaćanje', 'Pouzećem, gotovinom kuriru'],
      ['Male serije', 'Dizajn koji se ne ponavlja'],
    ],
    home: 'AAM Clothing, početna',
    tagline: 'Majice za one koji su budni kad svi drugi spavaju. Dizajnirano noću, nošeno danju.',
    place: 'AAM Clothing · Nikšić, Crna Gora',
    shop: 'Shop',
    all: 'Sve iz kolekcije',
    brand: 'Brend',
    about: 'O nama',
    cart: 'Korpa',
    contact: 'Kontakt',
    form: 'Kontakt forma',
    rights: 'Sva prava zadržana.',
  },
  en: {
    trust: [
      ['Delivery', 'Across Montenegro'],
      ['Dispatch', 'Within 24h'],
      ['Payment', 'Cash on delivery'],
      ['Small batches', 'Designs that never repeat'],
    ],
    home: 'AAM Clothing, home',
    tagline: 'Tees for those who are awake while everyone else sleeps. Designed at night, worn by day.',
    place: 'AAM Clothing · Nikšić, Montenegro',
    shop: 'Shop',
    all: 'Full collection',
    brand: 'Brand',
    about: 'About us',
    cart: 'Cart',
    contact: 'Contact',
    form: 'Contact form',
    rights: 'All rights reserved.',
  },
}

export default function Footer() {
  const { lang } = useLang()
  const t = useT(TEXT)
  const trust = t.trust.map(([title, text], i) => [TRUST_ICONS[i], title, text])
  // Linkovi samo na kategorije u kojima ima nečega (dok se katalog učitava, sve)
  const { products, status } = useProducts()
  const categories =
    status === 'ready' ? CATEGORIES.filter((c) => products.some((p) => p.category === c.name)) : CATEGORIES

  return (
    <footer className="mt-24 overflow-hidden border-t border-night-600">
      <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-px border-b border-night-600 bg-night-600 lg:grid-cols-4">
        {trust.map(([Icon, title, text]) => (
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
          <Link to="/" aria-label={t.home} className="inline-block transition-opacity hover:opacity-70">
            <img
              src="/brand/logo-full.webp"
              alt="AAM Clothing 2AM logo, Same city, different thoughts"
              width="1200"
              height="357"
              loading="lazy"
              className="h-auto w-64"
            />
          </Link>
          <p className="mt-4 max-w-sm text-sm text-ash">{t.tagline}</p>
          {/* Isto ime i grad na svakoj stranici: Google tako povezuje brend sa Nikšićem */}
          <p className="mt-3 font-mono text-xs uppercase tracking-widest text-bone">{t.place}</p>
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
          <h2 className={heading}>{t.shop}</h2>
          <ul className="mt-3 text-sm">
            <li><Link to="/shop" className={link}>{t.all}</Link></li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link to={`/shop?kategorija=${c.slug}`} className={link}>{categoryLabel(c.name, lang)}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className={heading}>{t.brand}</h2>
          <ul className="mt-3 text-sm">
            <li><Link to="/o-nama" className={link}>{t.about}</Link></li>
            <li><Link to="/korpa" className={link}>{t.cart}</Link></li>
          </ul>
        </div>
        <div>
          <h2 className={heading}>{t.contact}</h2>
          <ul className="mt-3 text-sm">
            <li><Link to="/kontakt" className={link}>{t.form}</Link></li>
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

      <div className="relative border-t border-night-600 bg-night px-4 py-5 font-mono text-[11px] uppercase tracking-widest text-ash">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:px-2">
          <p>© {YEAR} AAM Clothing, Nikšić. {t.rights}</p>
          <p>
            Designed by{' '}
            <a
              href="https://www.softivo.me"
              target="_blank"
              rel="noopener"
              className="-my-2 inline-block py-2 text-bone transition-colors hover:text-alarm"
            >
              Softivo
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
