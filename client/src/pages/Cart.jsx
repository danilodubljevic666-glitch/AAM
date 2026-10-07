import { Link } from 'react-router-dom'
import CartLine from '../components/CartLine.jsx'
import { useCart } from '../context/CartContext.jsx'
import { formatPrice } from '../lib/format.js'
import { FREE_SHIPPING, shippingFor } from '../lib/shipping.js'
import { usePageTitle } from '../lib/usePageTitle.js'

export default function Cart() {
  usePageTitle('Korpa')
  const { items, total } = useCart()
  const shipping = shippingFor(total)

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6">
        <p className="animate-fade-up font-display text-8xl text-night-600">02:00</p>
        <h1 className="mt-4 animate-fade-up font-display text-4xl uppercase [animation-delay:100ms]">Korpa je prazna</h1>
        <Link to="/shop" className="mt-8 inline-block animate-fade-up bg-bone [animation-delay:200ms] px-8 py-4 font-mono text-xs font-bold uppercase tracking-widest text-night hover:bg-alarm">
          Nazad u shop
        </Link>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="animate-fade-up font-display text-7xl uppercase">Korpa</h1>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
        <ul className="divide-y divide-night-600 border-y border-night-600">
          {items.map((item) => (
            <CartLine key={`${item.id}-${item.size}`} item={item} />
          ))}
        </ul>

        <aside className="h-fit animate-fade-up border border-night-600 bg-night-800 p-6 [animation-delay:150ms]">
          <h2 className="font-mono text-xs uppercase tracking-widest text-ash">Pregled</h2>
          <dl className="mt-6 space-y-3 font-mono text-sm">
            <div className="flex justify-between"><dt className="text-ash">Međuzbir</dt><dd>{formatPrice(total)}</dd></div>
            <div className="flex justify-between"><dt className="text-ash">Dostava</dt><dd>{shipping ? formatPrice(shipping) : 'Besplatno'}</dd></div>
            <div className="flex justify-between border-t border-night-600 pt-3 text-base"><dt>Ukupno</dt><dd>{formatPrice(total + shipping)}</dd></div>
          </dl>
          {shipping > 0 && (
            <p className="mt-4 font-mono text-[11px] uppercase text-alarm">
              Još {formatPrice(FREE_SHIPPING - total)} do besplatne dostave
            </p>
          )}
          <Link
            to="/narudzba"
            className="mt-6 block w-full bg-bone py-4 text-center font-mono text-xs font-bold uppercase tracking-widest text-night transition-[background-color,scale] hover:bg-alarm active:scale-[0.98]"
          >
            Naruči
          </Link>
          <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-widest text-ash">Plaćanje pouzećem</p>
        </aside>
      </div>
    </section>
  )
}
