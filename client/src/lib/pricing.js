// Cijena po kojoj se proizvod trenutno prodaje (akcijska ako postoji). Server računa isto pri narudžbi.
export const priceOf = (p) => p.sale_price ?? p.price

// Popust u procentima (npr. 20 za -20%), ili 0 kad nema popusta
export const discountOf = (p) => (p.sale_price ? Math.round((1 - p.sale_price / p.price) * 100) : 0)
