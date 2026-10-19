import { Link } from 'react-router-dom'
import CartLine from '../components/CartLine.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useT } from '../context/LanguageContext.jsx'
import { formatPrice } from '../lib/format.js'
import { shippingFor } from '../lib/shipping.js'
import { useSeo } from '../lib/seo.js'

const TEXT = {
  me: {
    title: 'Korpa',
    empty: 'Korpa je prazna',
    back: 'Nazad u shop',
    summary: 'Pregled',
    subtotal: 'Međuzbir',
    shipping: 'Dostava',
    total: 'Ukupno',
    checkout: 'Naruči',
    cod: 'Plaćanje pouzećem',
  },
  en: {
    title: 'Cart',
    empty: 'Your cart is empty',
    back: 'Back to shop',
    summary: 'Summary',
    subtotal: 'Subtotal',
    shipping: 'Delivery',
    total: 'Total',
    checkout: 'Checkout',
    cod: 'Cash on delivery',
  },
}

export default function Cart() {
  const t = useT(TEXT)
  useSeo({ title: t.title, noIndex: true })
  const { items, total } = useCart()
  const shipping = shippingFor(total)

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6">
        <p className="animate-fade-up font-display text-8xl text-night-600">02:00</p>
        <h1 className="mt-4 animate-fade-up font-display text-4xl uppercase [animation-delay:100ms]">{t.empty}</h1>
        <Link to="/shop" className="mt-8 inline-block animate-fade-up bg-bone [animation-delay:200ms] px-8 py-4 font-mono text-xs font-bold uppercase tracking-widest text-night hover:bg-alarm">
          {t.back}
        </Link>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="animate-fade-up font-display text-7xl uppercase">{t.title}</h1>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
        <ul className="divide-y divide-night-600 border-y border-night-600">
          {items.map((item) => (
            <CartLine key={`${item.id}-${item.size}`} item={item} />
          ))}
        </ul>

        <aside className="h-fit animate-fade-up border border-night-600 bg-night-800 p-6 [animation-delay:150ms]">
          <h2 className="font-mono text-xs uppercase tracking-widest text-ash">{t.summary}</h2>
          <dl className="mt-6 space-y-3 font-mono text-sm">
            <div className="flex justify-between"><dt className="text-ash">{t.subtotal}</dt><dd>{formatPrice(total)}</dd></div>
            <div className="flex justify-between"><dt className="text-ash">{t.shipping}</dt><dd>{formatPrice(shipping)}</dd></div>
            <div className="flex justify-between border-t border-night-600 pt-3 text-base"><dt>{t.total}</dt><dd>{formatPrice(total + shipping)}</dd></div>
          </dl>
          <Link
            to="/narudzba"
            className="btn-shine mt-6 block w-full bg-bone py-4 text-center font-mono text-xs font-bold uppercase tracking-widest text-night transition-[background-color,scale] hover:bg-alarm active:scale-[0.98]"
          >
            {t.checkout}
          </Link>
          <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-widest text-ash">{t.cod}</p>
        </aside>
      </div>
    </section>
  )
}
