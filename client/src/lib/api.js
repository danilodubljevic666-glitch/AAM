// Poziva backend; u dev modu Vite proxy prosleđuje /api na localhost:5000
const BASE = import.meta.env.VITE_API_URL || '/api'

// token = Supabase access token (za /admin rute)
export async function api(path, { token, ...options } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  })
  const body = await res.json().catch(() => null)
  if (!res.ok) {
    const err = new Error(body?.error || `API error ${res.status}`)
    err.status = res.status
    throw err
  }
  return body
}
