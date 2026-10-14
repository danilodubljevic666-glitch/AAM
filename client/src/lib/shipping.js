// Iznosi u centima — moraju da se poklapaju sa server/src/routes/orders.js (server konačno računa cenu)
// Dostava se naplaćuje uvijek, bez obzira na iznos korpe (besplatne dostave nema).
export const SHIPPING_COST = 390 // 3,90 €

export const shippingFor = (subtotal) => (subtotal === 0 ? 0 : SHIPPING_COST)
