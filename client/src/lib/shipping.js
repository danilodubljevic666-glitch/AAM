// Iznosi u centima — moraju da se poklapaju sa server/src/routes/orders.js (server konačno računa cenu)
export const FREE_SHIPPING = 5000 // 50 €
export const SHIPPING_COST = 390 // 3,90 €

export const shippingFor = (subtotal) => (subtotal >= FREE_SHIPPING || subtotal === 0 ? 0 : SHIPPING_COST)
