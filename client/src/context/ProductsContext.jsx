import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api.js'
import { useLang } from './LanguageContext.jsx'

const ProductsContext = createContext(null)

// Oznake iz admin forme, za proizvode kojima prevod oznake nije upisan
const TAG_EN = { Novo: 'New', Bestseller: 'Bestseller', Limitirano: 'Limited' }

// Na engleskoj verziji naziv, opis i oznaka dolaze iz *_en kolona; gdje prevoda nema, ostaje crnogorski.
// Kategorija se namjerno ne mijenja (po njoj se filtrira), njen prikaz prevodi categoryLabel().
function localize(p, lang) {
  if (lang !== 'en') return p
  return {
    ...p,
    name: p.name_en || p.name,
    description: p.description_en || p.description,
    tag: p.tag_en || TAG_EN[p.tag] || p.tag,
  }
}

// Katalog se učitava jednom (iz Supabase-a preko /api/products) i deli celoj aplikaciji
export function ProductsProvider({ children }) {
  const [state, setState] = useState({ products: [], status: 'loading' })
  const [version, setVersion] = useState(0)
  const { lang } = useLang()

  useEffect(() => {
    let cancelled = false
    api('/products')
      .then((products) => !cancelled && setState({ products, status: 'ready' }))
      .catch(() => !cancelled && setState({ products: [], status: 'error' }))
    return () => {
      cancelled = true
    }
  }, [version])

  // Admin panel zove reload() posle izmena, da sajt odmah prikaže novo stanje
  const reload = useCallback(() => setVersion((v) => v + 1), [])
  const products = useMemo(() => state.products.map((p) => localize(p, lang)), [state.products, lang])
  const value = useMemo(() => ({ ...state, products, reload }), [state, products, reload])

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}

export function useProducts() {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error('useProducts mora biti unutar ProductsProvider-a')
  return ctx
}
