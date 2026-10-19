import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useT } from '../context/LanguageContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { formatPrice } from '../lib/format.js'
import ProductImage from './ProductImage.jsx'

const TEXT = {
  me: {
    removed: 'Uklonjeno iz korpe',
    undo: 'Vrati nazad',
    size: 'Veličina',
    less: (name) => `Smanji količinu: ${name}`,
    more: (name) => `Povećaj količinu: ${name}`,
    remove: 'Ukloni',
  },
  en: {
    removed: 'Removed from cart',
    undo: 'Undo',
    size: 'Size',
    less: (name) => `Decrease quantity: ${name}`,
    more: (name) => `Increase quantity: ${name}`,
    remove: 'Remove',
  },
}

export default function CartLine({ item }) {
  const { updateQty, removeItem, restoreItem, setIsOpen } = useCart()
  const { toast } = useToast()
  const t = useT(TEXT)

  // Uklanjanje je lako pogriješiti — zato uvijek ide i dugme za povratak
  const remove = () => {
    removeItem(item.id, item.size)
    toast({
      title: t.removed,
      text: `${item.name} · ${item.size}`,
      action: { label: t.undo, onClick: () => restoreItem(item) },
    })
  }

  return (
    <li className="flex animate-fade-in gap-4 py-5">
      <Link
        to={`/shop/${item.slug}`}
        onClick={() => setIsOpen(false)}
        className="shrink-0 overflow-hidden bg-night-800 transition-colors hover:bg-night-700"
      >
        <ProductImage product={item} className="h-24 w-20 p-1 transition-transform duration-500 hover:scale-105" />
      </Link>
      <div className="flex flex-1 flex-col justify-between gap-3">
        <div className="flex justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-display text-lg uppercase leading-tight">{item.name}</p>
            <p className="font-mono text-xs text-ash">{t.size}: {item.size}</p>
          </div>
          <p className="whitespace-nowrap font-mono text-sm">{formatPrice(item.price * item.qty)}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center border border-night-600 font-mono text-sm transition-colors focus-within:border-bone hover:border-ash">
            <button
              onClick={() => updateQty(item.id, item.size, item.qty - 1)}
              className="px-3 py-1.5 transition-colors hover:text-alarm active:scale-90"
              aria-label={t.less(item.name)}
            >
              −
            </button>
            <span key={item.qty} className="w-7 animate-pop-in text-center tabular-nums">{item.qty}</span>
            <button
              onClick={() => updateQty(item.id, item.size, item.qty + 1)}
              className="px-3 py-1.5 transition-colors hover:text-alarm active:scale-90"
              aria-label={t.more(item.name)}
            >
              +
            </button>
          </div>
          <button
            onClick={remove}
            className="font-mono text-[11px] uppercase tracking-widest text-ash transition-colors hover:text-alarm"
          >
            {t.remove}
          </button>
        </div>
      </div>
    </li>
  )
}
