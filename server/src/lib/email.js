// Slanje emailova preko EmailJS REST API-ja (ključevi su u server/.env, nikad u browseru).
// U EmailJS nalogu uključi: Account → Security → "Allow EmailJS API for non-browser applications".
// Private Key je opcion (preporučen): ako je u EmailJS-u uključeno "Use Private Key", mora biti postavljen.
//
// Dva odvojena šablona: jedan za narudžbe, drugi za poruke sa kontakt forme.
// Servis je obično isti; EMAILJS_CONTACT_SERVICE_ID postoji za slučaj da kontakt ide
// kroz drugi nalog/servis, a ako nije zadat koristi se isti kao za narudžbe.
const {
  EMAILJS_SERVICE_ID,
  EMAILJS_PUBLIC_KEY,
  EMAILJS_PRIVATE_KEY,
  EMAILJS_ORDER_TEMPLATE_ID,
  EMAILJS_CONTACT_SERVICE_ID,
  EMAILJS_CONTACT_TEMPLATE_ID,
} = process.env

const contactServiceId = EMAILJS_CONTACT_SERVICE_ID || EMAILJS_SERVICE_ID

export const orderEmailConfigured = Boolean(EMAILJS_SERVICE_ID && EMAILJS_PUBLIC_KEY && EMAILJS_ORDER_TEMPLATE_ID)
export const contactEmailConfigured = Boolean(contactServiceId && EMAILJS_PUBLIC_KEY && EMAILJS_CONTACT_TEMPLATE_ID)

// Za /api/health: da li server vidi ključeve (bez otkrivanja vrijednosti) — korisno na Vercelu
const tail = (v) => (v ? `…${v.trim().slice(-4)}` : null)
export const emailStatus = {
  ready: orderEmailConfigured,
  serviceId: tail(EMAILJS_SERVICE_ID),
  templateId: tail(EMAILJS_ORDER_TEMPLATE_ID),
  publicKey: Boolean(EMAILJS_PUBLIC_KEY),
  privateKey: Boolean(EMAILJS_PRIVATE_KEY),
  contact: {
    ready: contactEmailConfigured,
    serviceId: tail(contactServiceId),
    templateId: tail(EMAILJS_CONTACT_TEMPLATE_ID),
  },
}

if (!orderEmailConfigured) {
  console.warn('⚠ EmailJS za narudžbe nije podešen u server/.env — narudžbe se samo čuvaju u bazi')
}
if (!contactEmailConfigured) {
  console.warn('⚠ EmailJS za kontakt formu nije podešen — poruke se samo čuvaju u bazi')
}

async function send(serviceId, templateId, templateParams) {
  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: EMAILJS_PUBLIC_KEY,
      ...(EMAILJS_PRIVATE_KEY && { accessToken: EMAILJS_PRIVATE_KEY }),
      template_params: templateParams,
    }),
  })
  if (!res.ok) throw new Error(`EmailJS ${res.status}: ${await res.text()}`)
}

// async: i greška "nije podešen" postaje odbijen Promise, a ne izuzetak koji preskoči Promise.allSettled
export async function sendOrderEmail(templateParams) {
  if (!orderEmailConfigured) throw new Error('EmailJS za narudžbe nije podešen')
  return send(EMAILJS_SERVICE_ID, EMAILJS_ORDER_TEMPLATE_ID, templateParams)
}

export async function sendContactEmail(templateParams) {
  if (!contactEmailConfigured) throw new Error('EmailJS za kontakt formu nije podešen')
  return send(contactServiceId, EMAILJS_CONTACT_TEMPLATE_ID, templateParams)
}
