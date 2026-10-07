// Pravi admin nalog za /admin, ili postojećem nalogu daje admin prava.
// Pokretanje (iz glavnog foldera): npm run create-admin --prefix server -- tvoj@email.com
import { createInterface } from 'node:readline/promises'
import { supabase } from '../src/lib/supabase.js'

const email = process.argv[2]?.trim().toLowerCase()
if (!supabase || !email) {
  console.error('Upotreba: npm run create-admin --prefix server -- tvoj@email.com')
  process.exit(1)
}

async function findUser() {
  for (let page = 1; ; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 })
    if (error) throw error
    const user = data.users.find((u) => u.email === email)
    if (user || data.users.length < 1000) return user
  }
}

const existing = await findUser()

if (existing) {
  const { error } = await supabase.auth.admin.updateUserById(existing.id, {
    app_metadata: { ...existing.app_metadata, role: 'admin' },
  })
  if (error) throw error
  console.log(`✓ ${email} već postoji — sada ima admin prava.`)
} else {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  const password = await rl.question('Lozinka za novi admin nalog (min. 8 znakova): ')
  rl.close()
  if (password.length < 8) {
    console.error('Lozinka mora imati bar 8 znakova.')
    process.exit(1)
  }
  const { error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { role: 'admin' },
  })
  if (error) throw error
  console.log(`✓ Napravljen admin nalog ${email}.`)
}

console.log('Prijavi se na http://localhost:5173/admin')
