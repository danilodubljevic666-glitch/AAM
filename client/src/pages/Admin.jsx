import { useCallback, useEffect, useState } from 'react'
import ProductForm from '../components/admin/ProductForm.jsx'
import { inputClass, labelClass, primaryButton, secondaryButton } from '../components/formStyles.js'
import ProductImage from '../components/ProductImage.jsx'
import { useProducts } from '../context/ProductsContext.jsx'
import { api } from '../lib/api.js'
import Price from '../components/Price.jsx'
import { supabase } from '../lib/supabase.js'
import { usePageTitle } from '../lib/usePageTitle.js'

export default function Admin() {
  usePageTitle('Admin')
  const [session, setSession] = useState(undefined) // undefined = još proveravamo

  useEffect(() => {
    // Odmah javlja trenutnu sesiju, a zatim prijavu, odjavu i osvežavanje tokena
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {session === undefined ? null : session ? <Dashboard session={session} /> : <Login />}
    </section>
  )
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    // Uspešna prijava: onAuthStateChange prebacuje na Dashboard
    if (authError) {
      setError(authError.message === 'Invalid login credentials' ? 'Pogrešan email ili lozinka' : authError.message)
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm py-12">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-ash">Admin</p>
      <h1 className="mt-2 font-display text-6xl uppercase">Prijava</h1>
      <form onSubmit={submit} className="mt-8 space-y-5">
        <label className="block">
          <span className={labelClass}>Email</span>
          <input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </label>
        <label className="block">
          <span className={labelClass}>Lozinka</span>
          <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
        </label>
        {error && <p className="font-mono text-xs uppercase tracking-widest text-alarm">{error}</p>}
        <button disabled={busy} className={`${primaryButton} w-full py-4`}>
          {busy ? 'Prijavljivanje…' : 'Prijavi se'}
        </button>
      </form>
    </div>
  )
}

function Dashboard({ session }) {
  const token = session.access_token
  const { reload: reloadSite } = useProducts()
  const [products, setProducts] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [notice, setNotice] = useState(null)
  const [editing, setEditing] = useState(null) // null | 'new' | proizvod
  const [busyId, setBusyId] = useState(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let cancelled = false
    api('/admin/products', { token })
      .then((data) => {
        if (cancelled) return
        setProducts(data)
        setLoadError(null)
      })
      .catch((err) => !cancelled && setLoadError(err))
    return () => {
      cancelled = true
    }
  }, [token, version])

  const load = useCallback(() => setVersion((v) => v + 1), [])

  const afterChange = () => {
    load()
    reloadSite()
  }

  const act = async (product, request, message) => {
    setBusyId(product.id)
    setNotice(null)
    try {
      await request()
      afterChange()
      setNotice(message)
    } catch (err) {
      setNotice(`Greška: ${err.message}`)
    } finally {
      setBusyId(null)
    }
  }

  const toggleActive = (p) =>
    act(
      p,
      () => api(`/admin/products/${p.id}`, { method: 'PATCH', token, body: JSON.stringify({ ...p, active: !p.active }) }),
      `„${p.name}" je ${p.active ? 'sakrivena' : 'ponovo u shopu'}.`,
    )

  const remove = (p) => {
    if (!window.confirm(`Obrisati „${p.name}"? Ovo se ne može poništiti.`)) return
    act(p, () => api(`/admin/products/${p.id}`, { method: 'DELETE', token }), `„${p.name}" je obrisana.`)
  }

  const signOut = () => supabase.auth.signOut()

  if (loadError?.status === 401 || loadError?.status === 403) {
    return (
      <div className="mx-auto max-w-sm py-12">
        <h1 className="font-display text-5xl uppercase">Nema pristupa</h1>
        <p className="mt-4 text-ash">{loadError.message}.</p>
        <button onClick={signOut} className={`${secondaryButton} mt-8`}>Odjavi se</button>
      </div>
    )
  }

  if (editing) {
    return (
      <ProductForm
        product={editing === 'new' ? null : editing}
        token={token}
        onCancel={() => setEditing(null)}
        onSaved={() => {
          setNotice(editing === 'new' ? 'Majica je dodata.' : 'Izmjene su sačuvane.')
          setEditing(null)
          afterChange()
        }}
      />
    )
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-ash">Admin · {session.user.email}</p>
          <h1 className="mt-2 font-display text-6xl uppercase sm:text-7xl">Proizvodi</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setEditing('new')} className={primaryButton}>+ Nova majica</button>
          <button onClick={signOut} className={secondaryButton}>Odjavi se</button>
        </div>
      </div>

      {notice && <p className="mt-8 font-mono text-xs uppercase tracking-widest text-alarm">{notice}</p>}

      {loadError ? (
        <p className="mt-10 font-mono text-xs uppercase tracking-widest text-alarm">
          Lista nije učitana: {loadError.message}.{' '}
          <button onClick={load} className="underline hover:text-bone">Pokušaj ponovo</button>
        </p>
      ) : products === null ? (
        <p className="mt-10 font-mono text-xs uppercase tracking-widest text-ash">Učitavanje…</p>
      ) : products.length === 0 ? (
        <div className="mt-10 border-y border-night-600 py-20 text-center">
          <p className="font-display text-4xl uppercase">Još nema majica</p>
          <p className="mt-3 text-ash">Dodaj prvu — pojaviće se u shopu čim je sačuvaš.</p>
        </div>
      ) : (
        <ul className="mt-10 divide-y divide-night-600 border-y border-night-600">
          {products.map((p) => (
            <li key={p.id} className={`flex flex-wrap items-center gap-x-6 gap-y-4 py-5 ${busyId === p.id ? 'opacity-50' : ''}`}>
              <div className={`relative h-24 w-20 shrink-0 bg-night-800 ${p.active ? '' : 'opacity-40'}`}>
                <ProductImage product={p} className="absolute inset-0 h-full w-full p-1" />
              </div>
              <div className="min-w-48 flex-1">
                <p className="font-display text-2xl uppercase leading-tight">
                  {p.name}
                  {!p.active && <span className="ml-3 align-middle font-mono text-[10px] tracking-widest text-alarm">Sakriveno</span>}
                </p>
                <p className="mt-1 font-mono text-xs text-ash">
                  /shop/{p.slug} · {p.category} · {p.sizes.join(' ')}
                  {p.tag && ` · ${p.tag}`}
                </p>
              </div>
              <p className="w-36 font-mono text-sm">
                <Price product={p} />
              </p>
              <div className="flex flex-wrap gap-2">
                <button disabled={busyId !== null} onClick={() => setEditing(p)} className={`${secondaryButton} px-4 py-2`}>Izmijeni</button>
                <button disabled={busyId !== null} onClick={() => toggleActive(p)} className={`${secondaryButton} px-4 py-2`}>
                  {p.active ? 'Sakrij' : 'Prikaži'}
                </button>
                <button disabled={busyId !== null} onClick={() => remove(p)} className={`${secondaryButton} px-4 py-2 hover:border-alarm hover:text-alarm`}>
                  Obriši
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
