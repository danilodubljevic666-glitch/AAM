import { useState } from 'react'
import { inputClass as input, labelClass as label } from '../components/formStyles.js'
import Honeypot from '../components/Honeypot.jsx'
import { useLang, useT } from '../context/LanguageContext.jsx'
import SplitText from '../components/SplitText.jsx'
import { api } from '../lib/api.js'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../lib/site.js'
import { useSeo } from '../lib/seo.js'


const EMPTY = { name: '', email: '', message: '', website: '' }

const TEXT = {
  me: {
    seoTitle: 'Kontakt',
    seoDescription:
      'Kontakt za AAM Clothing iz Nikšića. Pitanje o porudžbini, veličini ili saradnji? Piši nam i odgovaramo na email. Budni smo i u 02:00.',
    sendFailed: 'Slanje nije uspjelo. Pokušaj ponovo malo kasnije.',
    eyebrow: 'Kontakt',
    title: [{ t: 'Piši nam' }, { t: '.', c: 'text-alarm' }],
    intro: 'Pitanje o porudžbini, veličini ili saradnji? Pošalji poruku i odgovaramo na email koji ostaviš. Budni smo i u 02:00.',
    instagramNote: 'Novi dropovi, iza scene, DM za brza pitanja →',
    soon: 'Uskoro',
    sent: 'Poruka je poslata',
    reply: (email) => `Javićemo ti se na ${email}.`,
    another: 'Pošalji još jednu →',
    name: 'Ime',
    email: 'Email',
    emailPlaceholder: 'tvoj@email.com',
    message: 'Poruka',
    sending: 'Šaljem…',
    send: 'Pošalji poruku',
  },
  en: {
    seoTitle: 'Contact',
    seoDescription:
      'Contact AAM Clothing from Nikšić. A question about an order, sizing or a collaboration? Write to us and we will reply by email. We are up at 02:00 too.',
    sendFailed: 'Sending failed. Please try again a little later.',
    // server odgovara na crnogorskom, pa engleska verzija ima svoje poruke
    errors: {
      400: 'Please check the form and try again.',
      429: 'You have sent too many messages in a short time. Please try again later.',
    },
    eyebrow: 'Contact',
    title: [{ t: 'Write to us' }, { t: '.', c: 'text-alarm' }],
    intro: 'A question about an order, sizing or a collaboration? Send a message and we will reply to the email you leave. We are up at 02:00 too.',
    instagramNote: 'New drops, behind the scenes, DM for quick questions →',
    soon: 'Coming soon',
    sent: 'Message sent',
    reply: (email) => `We will get back to you at ${email}.`,
    another: 'Send another →',
    name: 'Name',
    email: 'Email',
    emailPlaceholder: 'you@email.com',
    message: 'Message',
    sending: 'Sending…',
    send: 'Send message',
  },
}

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
  const { lang } = useLang()
  const t = useT(TEXT)
  useSeo({ title: t.seoTitle, description: t.seoDescription })
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
      const known = err.status && err.status < 500
      setError(!known ? t.sendFailed : lang === 'en' ? (t.errors[err.status] ?? t.sendFailed) : err.message)
      setStatus('error')
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <p className="animate-fade-up font-mono text-xs uppercase tracking-[0.3em] text-ash">{t.eyebrow}</p>
      <SplitText
        as="h1"
        parts={t.title}
        className="mt-6 block font-display text-7xl uppercase sm:text-8xl"
      />

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div className="min-w-0 animate-fade-up space-y-8 [animation-delay:200ms]">
          <p className="max-w-md text-lg text-ash">{t.intro}</p>

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
                  <span className="font-mono text-[11px] uppercase tracking-widest text-ash">{t.instagramNote}</span>
                </span>
              </a>
            ) : (
              <div className="mt-4 flex items-center gap-4 text-ash">
                <InstagramIcon className="h-10 w-10 shrink-0" />
                <span className="font-display text-3xl uppercase">{t.soon}</span>
              </div>
            )}
          </div>
        </div>

        {status === 'done' ? (
          <div className="flex min-w-0 animate-fade-up flex-col justify-center border border-night-600 p-10">
            <p className="font-display text-5xl uppercase">{t.sent}</p>
            <p className="mt-4 text-ash">{t.reply(sentTo)}</p>
            <button onClick={() => setStatus('idle')} className="mt-8 self-start font-mono text-xs uppercase tracking-widest text-alarm hover:underline">
              {t.another}
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="min-w-0 animate-fade-up space-y-6 [animation-delay:300ms]">
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className={label}>{t.name}</span>
                <input required maxLength={100} autoComplete="name" value={form.name} onChange={set('name')} className={input} />
              </label>
              <label className="block">
                <span className={label}>{t.email}</span>
                <input required type="email" autoComplete="email" value={form.email} onChange={set('email')} placeholder={t.emailPlaceholder} className={input} />
              </label>
            </div>
            <label className="block">
              <span className={label}>{t.message}</span>
              <textarea required minLength={5} maxLength={5000} rows={7} value={form.message} onChange={set('message')} className={`${input} resize-y font-sans`} />
            </label>

            <Honeypot value={form.website} onChange={set('website')} />

            {error && <p className="font-mono text-xs uppercase tracking-widest text-alarm">{error}</p>}

            <button
              disabled={status === 'sending'}
              className="bg-bone px-10 py-4 font-mono text-xs font-bold uppercase tracking-widest text-night transition-[background-color,scale] hover:bg-alarm active:scale-[0.97] disabled:opacity-60"
            >
              {status === 'sending' ? t.sending : t.send}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
