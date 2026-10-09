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

## Podešavanja koja ćeš možda htjeti da promijeniš

### 1. Adresa sajta (bitno za Google i za dijeljenje linkova)
Kad dobiješ pravi domen, na Vercelu: **Settings → Environment Variables → `VITE_SITE_URL`**
(npr. `https://2am.me`) pa **Redeploy**. Ta adresa ide u `canonical`, u pregled linka na
Instagramu/WhatsAppu (`og:image`), u `robots.txt` i `sitemap.xml`. Dok se ne postavi,
koristi se `https://aam.vercel.app`.

### 2. Tabela veličina
`client/src/data/sizes.js` je namjerno **prazan**. Dok je prazan, dugme „Vodič za veličine"
na stranici proizvoda prikazuje samo uputstvo kako se mjeri. Čim upišeš stvarne mjere
(primjer je u komentaru u fajlu), iznad uputstva se pojavi i tabela.

### 3. Slika za dijeljenje linka
`client/public/og.jpg` (1200×630) je ono što se vidi kad neko okači link u poruku.
Zamijeni je svojom ako želiš drugu, ali zadrži isti naziv i dimenzije.

### 4. Preloader
Brendirani ekran dok se sajt učitava je u `client/index.html` (ugrađen, bez biblioteka),
a sklanja ga `client/src/lib/preloader.js` čim su fontovi i prvi ekran spremni.
Pun preloader se prikazuje jednom po posjeti; pri kretanju kroz sajt se više ne pojavljuje.

### 5. Prelaz slike između stranica
Klik na karticu u shopu „prenosi" sliku na stranicu proizvoda
(`client/src/lib/morph.js`, View Transitions API). Browseri bez podrške dobiju
običnu navigaciju, bez ikakve razlike u funkcionalnosti.

## Poruke sa kontakt forme na email

Kontakt forma ima **svoj** EmailJS šablon, odvojen od narudžbi. Poruka istovremeno ide
u Supabase tabelu `contact_messages` i na email — dovoljno je da uspije jedno od to dvoje.

Ključevi su u `server/.env`:

```
EMAILJS_CONTACT_SERVICE_ID=service_0dlcj8o
EMAILJS_CONTACT_TEMPLATE_ID=template_sna5k4a
```

Public i Private Key su zajednički sa narudžbama (`EMAILJS_PUBLIC_KEY`, `EMAILJS_PRIVATE_KEY`).

### Šta šablon mora da sadrži

U EmailJS → Email Templates → `template_sna5k4a` podesi **Reply To: `{{reply_to}}`**
(bez toga odgovor ide tebi samom, a ne onome ko je pisao).

Server šalje ove promjenljive — koristi koje hoćeš, višak se ignoriše:

| promjenljiva | šta je unutra |
|---|---|
| `{{name}}` / `{{from_name}}` | ime pošiljaoca |
| `{{email}}` / `{{from_email}}` / `{{reply_to}}` | njegov email |
| `{{message}}` | tekst poruke |
| `{{subject}}` / `{{title}}` | „Nova poruka sa sajta — Ime" |
| `{{time}}` | vrijeme po crnogorskom vremenu |

Primjer sadržaja šablona:

```
Nova poruka sa sajta

Od: {{name}} ({{email}})
Vrijeme: {{time}}

{{message}}
```

Da li server vidi ključeve provjeri na `/api/health` — pod `email.contact.ready` treba `true`.

## SEO

Urađeno i provjereno:

- **Naslov, opis i canonical** se mijenjaju na svakoj stranici; korpa, narudžba, `/admin`
  i stranica 404 su označene sa `noindex`.
- **`/sitemap.xml` pravi server** (`server/src/routes/seo.js`) u trenutku poziva, pa nova
  majica dodata kroz `/admin` odmah uđe — bez novog deploya. Rezervna adresa: `/api/sitemap.xml`.
- **`robots.txt`** se pravi pri buildu i pokazuje na sitemap.
- **Podaci za Google** (JSON-LD): prodavnica + sajt na svakoj stranici, a na stranici
  proizvoda još i sam proizvod (cijena, dostupnost, slike) i putanja Početna → Shop → naziv.
- **Pregled linka kad se majica podijeli** (Instagram DM, WhatsApp, Viber, Messenger, Telegram):
  ti programi ne pokreću JavaScript, pa bi inače svaka majica pokazivala istu opštu sliku.
  Vercel njih — i samo njih — šalje na `server/src/routes/seo.js`, koji vrati pravu
  fotografiju, naziv i cijenu. Pravi posjetioci i Googlebot dobijaju sajt kao i do sad
  (spisak programa je u `vercel.json`).
- **Slika za dijeljenje** je `client/public/og.jpg` (1200×630) za opšte stranice.

Kad sajt bude na pravom domenu:

1. Postavi `VITE_SITE_URL` (vidi gore) i uradi **Redeploy**.
2. [Google Search Console](https://search.google.com/search-console) → dodaj domen →
   **Sitemaps** → upiši `sitemap.xml` → **Submit**.
3. Pregled linka provjeri na [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
   — zalijepi adresu neke majice i klikni *Scrape Again*.
