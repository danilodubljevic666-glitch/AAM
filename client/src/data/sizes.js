// TABELA VELIČINA — prazna dok ne upišeš STVARNE mjere svojih komada.
// Dok je prazna, vodič na stranici proizvoda prikazuje samo uputstvo kako se mjeri
// (bolje nego izmišljeni brojevi po kojima bi kupac naručio pogrešnu veličinu).
//
// Mjere su u centimetrima, mjereno na raširenom komadu položenom na sto — ne na tijelu.
// Ključ mora da se poklapa sa nazivom kategorije iz lib/categories.js.
//
// Primjer kako izgleda popunjeno:
//
// export const SIZE_CHART = {
//   Majice: [
//     { size: 'S', chest: 52, length: 70, sleeve: 20 },
//     { size: 'M', chest: 55, length: 72, sleeve: 21 },
//     { size: 'L', chest: 58, length: 74, sleeve: 22 },
//   ],
// }

export const SIZE_CHART = {}

export const COLUMNS = [
  { key: 'chest', label: 'Grudi (pola obima)' },
  { key: 'length', label: 'Dužina' },
  { key: 'sleeve', label: 'Rukav' },
]
