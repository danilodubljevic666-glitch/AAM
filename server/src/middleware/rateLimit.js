import { rateLimit } from 'express-rate-limit'

const HOUR = 60 * 60 * 1000

// Ograničenje po IP adresi (IPv6 po mreži /56). Neuspješni zahtjevi — npr. greška u formi — se ne broje,
// pa kupac koji pogriješi broj telefona ne potroši pokušaj.
function perHour(limit, message) {
  return rateLimit({
    windowMs: HOUR,
    limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    skipFailedRequests: true,
    handler: (req, res) => {
      const msLeft = (req.rateLimit.resetTime?.getTime() ?? Date.now() + HOUR) - Date.now()
      const minutes = Math.max(1, Math.ceil(msLeft / 60000))
      res.status(429).json({ error: `${message} Pokušaj ponovo za ${minutes} min.` })
    },
  })
}

export const contactLimit = perHour(3, 'Poslao si previše poruka u kratkom roku.')
export const ordersLimit = perHour(5, 'Previše narudžbi u kratkom roku — ako je nešto pošlo naopako, piši nam preko kontakt forme.')
