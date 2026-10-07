export function notFound(req, res) {
  res.status(404).json({ error: `Ruta ${req.originalUrl} ne postoji` })
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error(err)
  const status = err.status || err.statusCode || 500
  // Detalji greške (npr. poruke iz baze) ostaju u logu — korisnik vidi samo opštu poruku
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Neispravan zahtjev' })
  res.status(status).json({ error: status < 500 && err.message ? err.message : 'Greška na serveru' })
}
