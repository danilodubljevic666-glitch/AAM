import express from 'express'
import cors from 'cors'
import healthRouter from './routes/health.js'
import productsRouter from './routes/products.js'
import adminRouter from './routes/admin.js'
import contactRouter from './routes/contact.js'
import ordersRouter from './routes/orders.js'
import { notFound, errorHandler } from './middleware/errors.js'
import { contactLimit, ordersLimit } from './middleware/rateLimit.js'

const app = express()
app.disable('x-powered-by')
const PORT = process.env.PORT || 5000

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

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`aam server radi na http://localhost:${PORT}`)
})
