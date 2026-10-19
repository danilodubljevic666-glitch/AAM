// Vrste proizvoda — filter u shopu i izbor u admin panelu.
// Moraju da se poklapaju sa CATEGORIES u server/src/lib/products.js
export const CATEGORIES = [
  { name: 'Majice', slug: 'majice', en: 'T-shirts' },
  { name: 'Duksevi', slug: 'duksevi', en: 'Hoodies' },
  { name: 'Kačketi', slug: 'kacketi', en: 'Caps' },
  { name: 'Komplet', slug: 'komplet', en: 'Sets' },
]

// Naziv kategorije za prikaz na izabranom jeziku; u bazi i u adresi uvijek ostaje crnogorski
export const categoryLabel = (name, lang) => (lang === 'en' && CATEGORIES.find((c) => c.name === name)?.en) || name
