const EUR = new Intl.NumberFormat('sr-RS', { style: 'currency', currency: 'EUR' })

// Cene se čuvaju u centima: 2990 → "29,90 €"
export const formatPrice = (cents) => EUR.format(cents / 100)
