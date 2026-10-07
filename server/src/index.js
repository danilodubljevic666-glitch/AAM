import app from './app.js'

// Lokalni server (npm run dev); na Vercelu se umjesto ovoga koristi api/index.js
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`aam server radi na http://localhost:${PORT}`)
})
