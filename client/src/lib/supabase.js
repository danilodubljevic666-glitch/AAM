import { createClient } from '@supabase/supabase-js'

// Klijentski Supabase (anon key) — za auth; podatke vučemo preko našeg backenda
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)
