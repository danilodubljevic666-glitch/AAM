// Slanje emailova preko EmailJS REST API-ja (ključevi su u server/.env, nikad u browseru).
// U EmailJS nalogu uključi: Account → Security → "Allow EmailJS API for non-browser applications".
const { EMAILJS_SERVICE_ID, EMAILJS_PUBLIC_KEY, EMAILJS_PRIVATE_KEY, EMAILJS_ORDER_TEMPLATE_ID } = process.env

export const orderEmailConfigured = Boolean(
  EMAILJS_SERVICE_ID && EMAILJS_PUBLIC_KEY && EMAILJS_PRIVATE_KEY && EMAILJS_ORDER_TEMPLATE_ID,
)

if (!orderEmailConfigured) {
  console.warn('⚠ EmailJS nije podešen u server/.env — narudžbe se samo čuvaju u bazi, bez emaila')
}

async function send(templateId, templateParams) {
  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: templateId,
      user_id: EMAILJS_PUBLIC_KEY,
      accessToken: EMAILJS_PRIVATE_KEY,
      template_params: templateParams,
    }),
  })
  if (!res.ok) throw new Error(`EmailJS ${res.status}: ${await res.text()}`)
}

// async: i greška "nije podešen" postaje odbijen Promise, a ne izuzetak koji preskoči Promise.allSettled
export async function sendOrderEmail(templateParams) {
  if (!orderEmailConfigured) throw new Error('EmailJS nije podešen')
  return send(EMAILJS_ORDER_TEMPLATE_ID, templateParams)
}
