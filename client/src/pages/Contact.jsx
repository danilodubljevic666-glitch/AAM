import { useState } from 'react'
import { inputClass as input, labelClass as label } from '../components/formStyles.js'
import Honeypot from '../components/Honeypot.jsx'
import SplitText from '../components/SplitText.jsx'
import { api } from '../lib/api.js'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../lib/site.js'
import { useSeo } from '../lib/seo.js'


const EMPTY = { name: '', email: '', message: '', website: '' }

function InstagramIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  )
}

export default function Contact() {
  useSeo({
    title: 'Kontakt',
    description: 'Pitanje o porudžbini, veličini ili saradnji? Piši nam — odgovaramo na email. Budni smo i u 02:00.',
  })
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState('idle') // idle | sending | done | error
  const [error, setError] = useState(null)
  const [sentTo, setSentTo] = useState('')

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    setError(null)
    try {
      await api('/contact', { method: 'POST', body: JSON.stringify(form) })
      setSentTo(form.email)
      setForm(EMPTY)
      setStatus('done')
    } catch (err) {
      setError(err.status && err.status < 500 ? err.message : 'Slanje nije uspjelo. Pokušaj ponovo malo kasnije.')
      setStatus('error')
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <p className="animate-fade-up font-mono text-xs uppercase tracking-[0.3em] text-ash">Kontakt</p>
      <SplitText
        as="h1"
        parts={[{ t: 'Piši nam' }, { t: '.', c: 'text-alarm' }]}
        className="mt-6 block font-display text-7xl uppercase sm:text-8xl"
      />

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div className="min-w-0 animate-fade-up space-y-8 [animation-delay:200ms]">
          <p className="max-w-md text-lg text-ash">
            Pitanje o porudžbini, veličini ili saradnji? Pošalji poruku — odgovaramo na email koji ostaviš. Budni smo i u
            02:00.
          </p>

          <div className="border border-night-600 bg-night-800 p-6">
            <p className={label}>Instagram</p>
            {INSTAGRAM_URL ? (
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-4 flex items-center gap-4"
              >
                <InstagramIcon className="h-10 w-10 shrink-0 transition-[color,rotate] duration-300 group-hover:-rotate-6 group-hover:text-alarm" />
                <span className="min-w-0">
                  <span className="block font-display text-2xl uppercase transition-colors [overflow-wrap:anywhere] group-hover:text-alarm sm:text-3xl">@{INSTAGRAM_HANDLE}</span>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-ash">Novi dropovi, iza scene, DM za brza pitanja →</span>
                </span>
              </a>
            ) : (
              <div className="mt-4 flex items-center gap-4 text-ash">
                <InstagramIcon className="h-10 w-10 shrink-0" />
                <span className="font-display text-3xl uppercase">Uskoro</span>
              </div>
            )}
          </div>
        </div>

        {status === 'done' ? (
          <div className="flex min-w-0 animate-fade-up flex-col justify-center border border-night-600 p-10">
            <p className="font-display text-5xl uppercase">Poruka je poslata</p>
            <p className="mt-4 text-ash">Javićemo ti se na {sentTo}.</p>
            <button onClick={() => setStatus('idle')} className="mt-8 self-start font-mono text-xs uppercase tracking-widest text-alarm hover:underline">
              Pošalji još jednu →
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="min-w-0 animate-fade-up space-y-6 [animation-delay:300ms]">
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className={label}>Ime</span>
                <input required maxLength={100} autoComplete="name" value={form.name} onChange={set('name')} className={input} />
              </label>
              <label className="block">
                <span className={label}>Email</span>
                <input required type="email" autoComplete="email" value={form.email} onChange={set('email')} placeholder="tvoj@email.com" className={input} />
              </label>
            </div>
            <label className="block">
              <span className={label}>Poruka</span>
              <textarea required minLength={5} maxLength={5000} rows={7} value={form.message} onChange={set('message')} className={`${input} resize-y font-sans`} />
            </label>

            <Honeypot value={form.website} onChange={set('website')} />

            {error && <p className="font-mono text-xs uppercase tracking-widest text-alarm">{error}</p>}

            <button
              disabled={status === 'sending'}
              className="bg-bone px-10 py-4 font-mono text-xs font-bold uppercase tracking-widest text-night transition-[background-color,scale] hover:bg-alarm active:scale-[0.97] disabled:opacity-60"
            >
              {status === 'sending' ? 'Šaljem…' : 'Pošalji poruku'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
