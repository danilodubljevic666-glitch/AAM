import { useLang } from '../context/LanguageContext.jsx'

// Prekidač ME / EN u zaglavlju. Naziv jezika se čitaču ekrana izgovara na tom jeziku.
const LANGS = [
  { code: 'me', label: 'ME', name: 'Crnogorski', htmlLang: 'sr-Latn-ME' },
  { code: 'en', label: 'EN', name: 'English', htmlLang: 'en' },
]

export default function LanguageSwitch() {
  const { lang, setLang } = useLang()

  return (
    <div role="group" aria-label={lang === 'en' ? 'Language' : 'Jezik'} className="flex items-center font-mono text-xs tracking-widest">
      {LANGS.map((l, i) => (
        <span key={l.code} className="flex items-center">
          {i > 0 && (
            <span aria-hidden="true" className="text-night-600">
              /
            </span>
          )}
          <button
            type="button"
            onClick={() => setLang(l.code)}
            aria-pressed={lang === l.code}
            aria-label={l.name}
            lang={l.htmlLang}
            className={`h-11 px-1.5 transition-colors ${lang === l.code ? 'text-bone' : 'text-ash hover:text-alarm'}`}
          >
            {l.label}
          </button>
        </span>
      ))}
    </div>
  )
}
