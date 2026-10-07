import { useState } from 'react'
import { Link } from 'react-router-dom'
import { inputClass, labelClass } from '../components/formStyles.js'
import Honeypot from '../components/Honeypot.jsx'
import ProductImage from '../components/ProductImage.jsx'
import { useCart } from '../context/CartContext.jsx'
import { api } from '../lib/api.js'
import { formatPrice } from '../lib/format.js'
import { shippingFor } from '../lib/shipping.js'
import { usePageTitle } from '../lib/usePageTitle.js'

const CITIES = [
  'Podgorica', 'Nikšić', 'Bar', 'Budva', 'Herceg Novi', 'Bijelo Polje', 'Pljevlja', 'Cetinje', 'Kotor', 'Tivat',
  'Ulcinj', 'Berane', 'Rožaje', 'Danilovgrad', 'Kolašin', 'Mojkovac', 'Plav', 'Žabljak', 'Andrijevica', 'Šavnik',
  'Plužine', 'Gusinje', 'Petnjica', 'Tuzi', 'Zeta',
]

const EMPTY = { firstName: '', lastName: '', email: '', phone: '', address: '', city: '', website: '' }

function Field({ label, className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className={labelClass}>{label}</span>
      <input required className={inputClass} {...props} />
    </label>
  )
}

export default function Checkout() {
  usePageTitle('Narudžba')
  const { items, total, clear } = useCart()
  const [form, setForm] = useState(EMPTY)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)
  const [placed, setPlaced] = useState(null) // { reference, name, email } posle uspešne narudžbe

  const shipping = shippingFor(total)
  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setSending(true)
    setError(null)
    try {
      const { website, ...customer } = form
      const { reference } = await api('/orders', {
        method: 'POST',
        body: JSON.stringify({ customer, website, items: items.map(({ id, size, qty }) => ({ id, size, qty })) }),
      })
      setPlaced({ reference, name: form.firstName, email: form.email })
      clear()
    } catch (err) {
      setError(err.status && err.status < 500 ? err.message : 'Narudžba trenutno ne može da se pošalje. Pokušaj ponovo ili nas kontaktiraj.')
      setSending(false)
    }
  }

  if (placed) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <p className="animate-fade-up font-mono text-xs uppercase tracking-[0.3em] text-ash">Narudžba primljena</p>
        <h1 className="mt-6 animate-fade-up font-display text-6xl uppercase [animation-delay:100ms] sm:text-7xl">
          Hvala, {placed.name}<span className="text-alarm">!</span>
        </h1>
        <p className="mt-6 animate-fade-up text-lg text-ash [animation-delay:200ms]">
          Broj narudžbe: <span className="font-mono text-bone">{placed.reference}</span>
        </p>
        <p className="mt-2 animate-fade-up text-ash [animation-delay:250ms]">
          Javićemo ti se na {placed.email} ili telefonom da potvrdimo dostavu.
        </p>
        <Link
          to="/shop"
          className="mt-10 inline-block animate-fade-up bg-bone px-8 py-4 font-mono text-xs font-bold uppercase tracking-widest text-night transition-[background-color,scale] [animation-delay:350ms] hover:bg-alarm active:scale-[0.97]"
        >
          Nazad u shop
        </Link>
      </section>
    )
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6">
        <p className="animate-fade-up font-display text-8xl text-night-600">02:00</p>
        <h1 className="mt-4 animate-fade-up font-display text-4xl uppercase [animation-delay:100ms]">Korpa je prazna</h1>
        <Link to="/shop" className="mt-8 inline-block animate-fade-up bg-bone px-8 py-4 font-mono text-xs font-bold uppercase tracking-widest text-night [animation-delay:200ms] hover:bg-alarm">
          Nazad u shop
        </Link>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <Link to="/korpa" className="animate-fade-up font-mono text-xs uppercase tracking-widest text-ash hover:text-alarm">
        ← Nazad u korpu
      </Link>
      <h1 className="mt-4 animate-fade-up font-display text-7xl uppercase [animation-delay:100ms]">Naruči</h1>

      <form onSubmit={submit} className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px]">
        <div className="min-w-0 animate-fade-up space-y-6 [animation-delay:200ms]">
          <h2 className={labelClass}>Podaci za dostavu</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Ime" autoComplete="given-name" maxLength={60} value={form.firstName} onChange={set('firstName')} />
            <Field label="Prezime" autoComplete="family-name" maxLength={60} value={form.lastName} onChange={set('lastName')} />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Email" type="email" autoComplete="email" value={form.email} onChange={set('email')} placeholder="tvoj@email.com" />
            <Field label="Telefon" type="tel" autoComplete="tel" pattern="\+?[\d\s\/\(\)\-]{6,20}" title="Npr. 067 123 456" value={form.phone} onChange={set('phone')} placeholder="067 123 456" />
          </div>
          <Field label="Adresa" autoComplete="street-address" maxLength={200} value={form.address} onChange={set('address')} placeholder="Ulica i broj" />
          <Field label="Grad" autoComplete="address-level2" maxLength={80} list="checkout-cities" value={form.city} onChange={set('city')} />
          <datalist id="checkout-cities">
            {CITIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>

          <Honeypot value={form.website} onChange={set('website')} />

          <div className="border border-night-600 p-5">
            <p className={labelClass}>Plaćanje</p>
            <p className="mt-2">Pouzećem — plaćaš kuriru gotovinom pri preuzimanju paketa.</p>
          </div>
        </div>

        <aside className="h-fit animate-fade-up border border-night-600 bg-night-800 p-6 [animation-delay:300ms] lg:sticky lg:top-24">
          <h2 className={labelClass}>Tvoja narudžba</h2>
          <ul className="mt-4 divide-y divide-night-600">
            {items.map((item) => (
              <li key={`${item.id}-${item.size}`} className="flex items-center gap-4 py-3">
                <div className="relative h-16 w-14 shrink-0 bg-night">
                  <ProductImage product={item} className="absolute inset-0 h-full w-full p-1" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-lg uppercase leading-tight">{item.name}</p>
                  <p className="font-mono text-xs text-ash">
                    {item.size} · {item.qty} kom
                  </p>
                </div>
                <p className="font-mono text-sm">{formatPrice(item.price * item.qty)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-3 border-t border-night-600 pt-4 font-mono text-sm">
            <div className="flex justify-between"><dt className="text-ash">Međuzbir</dt><dd>{formatPrice(total)}</dd></div>
            <div className="flex justify-between"><dt className="text-ash">Dostava</dt><dd>{shipping ? formatPrice(shipping) : 'Besplatno'}</dd></div>
            <div className="flex justify-between border-t border-night-600 pt-3 text-base"><dt>Ukupno</dt><dd>{formatPrice(total + shipping)}</dd></div>
          </dl>

          {error && <p className="mt-4 font-mono text-xs uppercase tracking-widest text-alarm">{error}</p>}

          <button
            disabled={sending}
            className="mt-6 w-full bg-bone py-4 font-mono text-xs font-bold uppercase tracking-widest text-night transition-[background-color,scale] hover:bg-alarm active:scale-[0.98] disabled:opacity-60"
          >
            {sending ? 'Šaljem narudžbu…' : 'Potvrdi narudžbu'}
          </button>
        </aside>
      </form>
    </section>
  )
}
