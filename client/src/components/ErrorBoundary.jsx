import { Component } from 'react'

// Sigurnosna mreža: ako nešto u aplikaciji pukne, korisnik dobije poruku
// i put nazad umjesto praznog bijelog ekrana.
export default class ErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error, info) {
    console.error('Greška u aplikaciji:', error, info)
  }

  render() {
    if (!this.state.failed) return this.props.children

    return (
      <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-ash">Nešto je puklo</p>
        <h1 className="mt-4 font-display text-6xl uppercase leading-none sm:text-7xl">
          02<span className="text-alarm">:</span>00
        </h1>
        <p className="mt-6 text-ash">
          Izvini — ova stranica se nije učitala kako treba. Osvježi je, pa bi trebalo da proradi.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="btn-shine bg-bone px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-widest text-night transition-[background-color,scale] hover:bg-alarm active:scale-[0.97]"
          >
            Osvježi stranicu
          </button>
          <a
            href="/"
            className="border border-night-600 px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-widest transition-[border-color,scale] hover:border-bone active:scale-[0.97]"
          >
            Početna
          </a>
        </div>
      </section>
    )
  }
}
