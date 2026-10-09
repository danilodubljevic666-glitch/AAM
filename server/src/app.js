import express from 'express'
import cors from 'cors'
import healthRouter from './routes/health.js'
import productsRouter from './routes/products.js'
import adminRouter from './routes/admin.js'
import contactRouter from './routes/contact.js'
import ordersRouter from './routes/orders.js'
import seoRouter from './routes/seo.js'
import { notFound, errorHandler } from './middleware/errors.js'
import { contactLimit, ordersLimit } from './middleware/rateLimit.js'

// Express aplikacija bez app.listen — lokalno je pokreće src/index.js, a na Vercelu api/index.js
const app = express()
app.disable('x-powered-by')

// Na hostingu je server obično iza proxyja: TRUST_PROXY=1 da limit ide po IP adresi kupca,
// a ne po adresi proxyja (inače bi svi posjetioci dijelili isti limit)
if (process.env.TRUST_PROXY) app.set('trust proxy', Number(process.env.TRUST_PROXY))

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/health', healthRouter)
app.use('/api/products', productsRouter)
app.use('/api/contact', contactLimit, contactRouter) // max 3 poruke na sat po IP adresi
app.use('/api/orders', ordersLimit, ordersRouter) // max 5 narudžbi na sat po IP adresi
app.use('/api/admin', adminRouter)

// Sitemap i pregled linka: Vercel ih preusmjerava ovamo sa /sitemap.xml i /shop/...
// Montirano dva puta namjerno — ako preusmjeravanje ikad promijeni putanju,
// /api/sitemap.xml ostaje kao rezervna adresa koja sigurno radi.
app.use(seoRouter)
app.use('/api', seoRouter)

app.use(notFound)
app.use(errorHandler)

export default app
