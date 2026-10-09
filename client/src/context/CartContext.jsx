import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useProducts } from './ProductsContext.jsx'
import { priceOf } from '../lib/pricing.js'

const CartContext = createContext(null)
const STORAGE_KEY = 'aam-cart'

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch {
    return []
  }
}

const sameLine = (item, id, size) => item.id === id && item.size === size

// Sačuvana korpa može da zastari (admin promeni cenu ili obriše majicu) —
// kad katalog stigne, uzimamo sveže podatke i izbacujemo proizvode kojih više nema
function syncWithCatalog(items, products) {
  const byId = new Map(products.map((p) => [p.id, p]))
  return items.flatMap((i) => {
    const p = byId.get(i.id)
    if (!p) return []
    const { slug, name, images, color, ink, print } = p
    return [{ ...i, slug, name, price: priceOf(p), images, color, ink, print }]
  })
}

export function CartProvider({ children }) {
  const [stored, setItems] = useState(loadCart)
  const [isOpen, setIsOpen] = useState(false)
  const { products, status } = useProducts()
  const items = useMemo(
    () => (status === 'ready' ? syncWithCatalog(stored, products) : stored),
    [stored, products, status],
  )

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
    } catch {
      // localStorage nije dostupan — korpa samo neće preživeti refresh
    }
  }, [stored])

  const value = useMemo(() => {
    const addItem = (product, size, qty = 1) => {
      setItems((prev) => {
        if (prev.some((i) => sameLine(i, product.id, size))) {
          return prev.map((i) => (sameLine(i, product.id, size) ? { ...i, qty: i.qty + qty } : i))
        }
        const { id, slug, name, images, color, ink, print } = product
        return [...prev, { id, slug, name, price: priceOf(product), images, color, ink, print, size, qty }]
      })
      setIsOpen(true)
    }

    const updateQty = (id, size, qty) =>
      setItems((prev) =>
        qty <= 0
          ? prev.filter((i) => !sameLine(i, id, size))
          : prev.map((i) => (sameLine(i, id, size) ? { ...i, qty } : i)),
      )

    const removeItem = (id, size) => updateQty(id, size, 0)

    // Vraća upravo uklonjenu stavku (dugme "Vrati" u obavještenju).
    // Za razliku od addItem ne otvara korpu — korisnik je već tu gdje jeste.
    const restoreItem = (line) =>
      setItems((prev) => (prev.some((i) => sameLine(i, line.id, line.size)) ? prev : [...prev, line]))

    const clear = () => setItems([])

    const count = items.reduce((n, i) => n + i.qty, 0)
    const total = items.reduce((n, i) => n + i.qty * i.price, 0)

    return { items, count, total, isOpen, setIsOpen, addItem, updateQty, removeItem, restoreItem, clear }
  }, [items, isOpen])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart mora biti unutar CartProvider-a')
  return ctx
}
