import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api.js'

const ProductsContext = createContext(null)

// Katalog se učitava jednom (iz Supabase-a preko /api/products) i deli celoj aplikaciji
export function ProductsProvider({ children }) {
  const [state, setState] = useState({ products: [], status: 'loading' })
  const [version, setVersion] = useState(0)

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
  const value = useMemo(() => ({ ...state, reload }), [state, reload])

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}

export function useProducts() {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error('useProducts mora biti unutar ProductsProvider-a')
  return ctx
}
