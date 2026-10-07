# aam (2 am) — online shop

- `client/` — React + Vite + Tailwind CSS v4 (port 5173)
- `server/` — Node.js + Express + Supabase (port 5000)

## Pokretanje
1. Popuni `client/.env` i `server/.env` (vidi `.env.example`) podacima iz Supabase → Project Settings → API.
   Zatim u Supabase → SQL Editor pokreni `server/db/setup.sql` (tabele; proizvodi se dodaju kroz `/admin`).
2. `npm run install:all` (samo prvi put)
3. `npm run dev` — pokreće i klijent i server.

## Deploy na Vercel
Jedan Vercel projekat služi i sajt i API (`/api/*` → `api/index.js`, sve ostalo → `client/dist`).
Podešavanja su u `vercel.json`, a baza i slike ostaju u Supabase-u.

1. vercel.com → **Add New → Project** → importuj GitHub repo `AAM`.
2. **Root Directory** ostavi `./` (ne `client`), Framework Preset: **Other**.
3. **Environment Variables** — iste vrijednosti kao u `client/.env` i `server/.env`:
   `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,
   `TRUST_PROXY=1`, i kad budu spremni `EMAILJS_*` ključevi. (`PORT` i `CLIENT_URL` nisu potrebni.)
4. **Deploy**. Svaki sljedeći `git push` na `main` automatski objavljuje novu verziju.

## Narudžbe na email (EmailJS)
Svaka narudžba se čuva u Supabase tabeli `orders` i šalje na email preko [EmailJS](https://www.emailjs.com)
(besplatno do 200 emailova mjesečno). Cijene uvijek računa server iz baze.

1. **Email Services** → Add New Service (npr. Gmail) → zapamti **Service ID**.
2. **Email Templates** → Create New Template → zapamti **Template ID**.
   - *Subject:* `Nova narudžba {{reference}} — {{total}}`
   - *To Email:* tvoj email · *Reply To:* `{{reply_to}}` (odgovor ide direktno kupcu)
   - *Content:*
     ```
     Nova narudžba {{reference}}

     Kupac: {{customer_name}}
     Email: {{customer_email}}
     Telefon: {{customer_phone}}
     Adresa: {{customer_address}}, {{customer_city}}

     {{{items_html}}}

     Međuzbir: {{subtotal}}
     Dostava: {{shipping}}
     Ukupno: {{total}} — plaćanje pouzećem
     ```
3. **Account → General** → Public Key. **Account → Security** → Private Key, i uključi
   *"Allow EmailJS API for non-browser applications"*.
4. Upiši vrijednosti u `server/.env` (vidi `server/.env.example`) i restartuj server.
