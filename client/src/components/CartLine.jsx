import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { formatPrice } from '../lib/format.js'
import ProductImage from './ProductImage.jsx'

export default function CartLine({ item }) {
  const { updateQty, removeItem, setIsOpen } = useCart()

  return (
    <li className="flex animate-fade-in gap-4 py-5">
      <Link to={`/shop/${item.slug}`} onClick={() => setIsOpen(false)} className="shrink-0 bg-night-800">
        <ProductImage product={item} className="h-24 w-20 p-1" />
      </Link>
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between gap-2">
          <div>
            <p className="font-display text-lg uppercase leading-tight">{item.name}</p>
            <p className="font-mono text-xs text-ash">Veličina: {item.size}</p>
          </div>
          <p className="font-mono text-sm">{formatPrice(item.price * item.qty)}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center border border-night-600 font-mono text-sm">
            <button onClick={() => updateQty(item.id, item.size, item.qty - 1)} className="px-3 py-1 hover:text-alarm" aria-label="Smanji količinu">−</button>
            <span className="w-6 text-center">{item.qty}</span>
            <button onClick={() => updateQty(item.id, item.size, item.qty + 1)} className="px-3 py-1 hover:text-alarm" aria-label="Povećaj količinu">+</button>
          </div>
          <button onClick={() => removeItem(item.id, item.size)} className="font-mono text-[11px] uppercase tracking-widest text-ash hover:text-alarm">
            Ukloni
          </button>
        </div>
      </div>
    </li>
  )
}
