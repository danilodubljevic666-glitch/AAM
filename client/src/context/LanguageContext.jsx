import { createContext, useContext, useEffect, useMemo, useState } from 'react'

// Jezik sajta: crnogorski (podrazumijevani) ili engleski.
// Izbor se pamti u browseru; prvi posjetioci i Google uvijek vide crnogorsku verziju.
const LanguageContext = createContext(null)
const STORAGE_KEY = 'aam-lang'
const HTML_LANG = { me: 'sr-Latn-ME', en: 'en' }

function loadLang() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'me'
  } catch {
    return 'me'
  }
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(loadLang)

  useEffect(() => {
    document.documentElement.lang = HTML_LANG[lang]
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // localStorage nije dostupan — izbor jezika samo neće preživjeti refresh
    }
  }, [lang])

  const value = useMemo(() => ({ lang, setLang }), [lang])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang mora biti unutar LanguageProvider-a')
  return ctx
}

// Tekstovi komponente na trenutnom jeziku. Svaka komponenta drži svoje tekstove na vrhu fajla:
//   const TEXT = { me: { title: 'Korpa' }, en: { title: 'Cart' } }
//   const t = useT(TEXT)  →  t.title
export function useT(dict) {
  const { lang } = useLang()
  return dict[lang] ?? dict.me
}
