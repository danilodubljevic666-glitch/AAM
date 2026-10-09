import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

const ToastContext = createContext(null)
const LIFETIME = 5000 // ms koliko poruka stoji prije nego sama nestane
const MAX = 3

// Kratke poruke u uglu ekrana ("Uklonjeno iz korpe", "Link kopiran"…).
// Vrijednost konteksta je stabilna, pa se stranice ne re-renderuju kad poruka iskoči.
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const lastId = useRef(0)

  const dismiss = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), [])

  const toast = useCallback(
    ({ title, text, action }) => {
      const id = ++lastId.current
      setToasts((list) => [...list.slice(-(MAX - 1)), { id, title, text, action }])
      setTimeout(() => dismiss(id), LIFETIME)
      return id
    },
    [dismiss],
  )

  const api = useMemo(() => ({ toast, dismiss }), [toast, dismiss])

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastViewport toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  )
}

function ToastViewport({ toasts, dismiss }) {
  return (
    <div
      aria-live="polite"
      // z-[55]: iznad korpe (z-50) i mobilnog menija (z-35) — poruka o uklanjanju
      // mora da se vidi i kad je korpa otvorena, jer se najčešće briše baš iz nje
      className="pointer-events-none fixed bottom-5 left-4 right-24 z-[55] flex flex-col gap-2 sm:right-auto sm:bottom-8 sm:left-8 sm:w-80"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex animate-toast-in items-start gap-3 border border-night-600 bg-night-800/95 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.55)] backdrop-blur"
        >
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-alarm" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="font-mono text-xs font-bold uppercase tracking-widest">{t.title}</p>
            {t.text && <p className="mt-1 truncate text-sm text-ash">{t.text}</p>}
            {t.action && (
              <button
                onClick={() => {
                  t.action.onClick()
                  dismiss(t.id)
                }}
                className="mt-2 font-mono text-[11px] uppercase tracking-widest text-alarm hover:underline"
              >
                {t.action.label}
              </button>
            )}
          </div>
          <button
            onClick={() => dismiss(t.id)}
            aria-label="Zatvori obavještenje"
            className="-m-1 shrink-0 p-1 text-ash transition-colors hover:text-bone"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast mora biti unutar ToastProvider-a')
  return ctx
}
