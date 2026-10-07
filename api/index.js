// Vercel serverless funkcija: cijeli Express API (server/src/app.js) odgovara na /api/*
// (vercel.json preusmjerava sve /api/... zahtjeve ovdje)
import app from '../server/src/app.js'

export default app
