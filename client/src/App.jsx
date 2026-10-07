import { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import BackToTop from './components/BackToTop.jsx'
import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import Product from './pages/Product.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'

// Admin (i Supabase klijent) se učitava tek kad neko otvori /admin
const Admin = lazy(() => import('./pages/Admin.jsx'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    // 'instant' — inače globalni scroll-behavior: smooth vidljivo klizi do vrha pri svakoj navigaciji
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

export default function App() {
  const { pathname } = useLocation()
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <CartDrawer />
      {/* key → svaka stranica se blago pojavi pri navigaciji */}
      <main key={pathname} className="flex-1 animate-page-in">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:slug" element={<Product />} />
          <Route path="/korpa" element={<Cart />} />
          <Route path="/narudzba" element={<Checkout />} />
          <Route path="/o-nama" element={<About />} />
          <Route path="/kontakt" element={<Contact />} />
          <Route path="/admin" element={<Suspense fallback={null}><Admin /></Suspense>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}
