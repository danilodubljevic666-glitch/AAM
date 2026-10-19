import { useEffect } from 'react'
import { useLang } from '../context/LanguageContext.jsx'
import { priceOf } from './pricing.js'
import { SHIPPING_COST } from './shipping.js'

// Uvijek pravi domen (vite.config.js), a ne adresa na kojoj je stranica otvorena —
// da Google ne vidi aam.vercel.app i verziju bez www. kao duplikate.
const SITE_URL = import.meta.env.VITE_SITE_URL
// Ljudi brend traže kao "aam clothing" / "aamclothing", pa to ime ide u svaki naslov.
// Isti tekstovi stoje i u index.html (to Google vidi prije nego što se JavaScript pokrene).
const SITE_NAME = 'AAM Clothing'
// Engleski tekstovi važe samo za posjetioce koji su izabrali EN (Google vidi crnogorsku verziju)
const TEXT = {
  me: {
    homeTitle: 'AAM Clothing Nikšić | 2AM majice i duksevi, Crna Gora',
    homeDescription:
      'AAM Clothing iz Nikšića. 2AM majice, duksevi i kačketi od teškog pamuka, u malim serijama. Plaćanje pouzećem, dostava širom Crne Gore za 2 do 3 radna dana.',
    productIntro: (name) => `${name}, AAM Clothing iz Nikšića. Male serije, dizajn koji se ne ponavlja.`,
    productOutro: 'Plaćanje pouzećem, dostava širom Crne Gore za 2 do 3 radna dana.',
    home: 'Početna',
    locale: 'sr_ME',
  },
  en: {
    homeTitle: 'AAM Clothing Nikšić | 2AM tees and hoodies, Montenegro',
    homeDescription:
      'AAM Clothing from Nikšić. 2AM tees, hoodies and caps in heavy cotton, made in small batches. Cash on delivery, shipping across Montenegro in 2 to 3 business days.',
    productIntro: (name) => `${name}, AAM Clothing from Nikšić. Small batches, designs that never repeat.`,
    productOutro: 'Cash on delivery, shipping across Montenegro in 2 to 3 business days.',
    home: 'Home',
    locale: 'en_US',
  },
}

// Opis proizvoda za Google i pregled linka. Proizvodi bez opisa u admin panelu dobijaju
// rečenicu o brendu, inače bi Google ispod naslova prikazao samo naziv.
export function productDescription(product, lang = 'me') {
  const t = TEXT[lang]
  const own = product.description?.trim()
  return `${own || t.productIntro(product.name)} ${t.productOutro}`
}

// React Router mijenja samo sadržaj stranice; naslov, opis i canonical u <head>
// moramo sami da osvježimo — njih čitaju Google i pregled linka u Viberu/WhatsAppu.
function meta(key, attr = 'name') {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  return el
}

export function useSeo({ title, description, image, noIndex = false } = {}) {
  const { lang } = useLang()

  useEffect(() => {
    const t = TEXT[lang]
    const fullTitle = title ? `${title} | ${SITE_NAME}` : t.homeTitle
    const desc = description || t.homeDescription
    const url = SITE_URL + window.location.pathname

    document.title = fullTitle
    meta('description').content = desc
    meta('robots').content = noIndex ? 'noindex, nofollow' : 'index, follow'
    meta('og:locale', 'property').content = t.locale
    meta('og:title', 'property').content = fullTitle
    meta('og:description', 'property').content = desc
    meta('og:url', 'property').content = url
    meta('twitter:title').content = fullTitle
    meta('twitter:description').content = desc

    // Slika u pregledu linka: na stranici proizvoda njegova fotografija, inače opšta og.jpg.
    // Programi koji prave pregled (WhatsApp, Instagram) ne pokreću JavaScript — njima to
    // servira server (server/src/routes/seo.js); ovo je za Google i za dijeljenje iz browsera.
    const origin = SITE_URL
    const ogImage = image ? (image.startsWith('http') ? image : origin + image) : `${origin}/og.jpg`
    meta('og:image', 'property').content = ogImage
    meta('twitter:image').content = ogImage

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url
  }, [title, description, image, noIndex, lang])
}

// Google u rezultatima pretrage može da prikaže cijenu i dostupnost majice.
// Cijene su u centima, schema.org ih traži kao "29.90".
export function useProductJsonLd(product) {
  const { lang } = useLang()

  useEffect(() => {
    if (!product) return

    const origin = SITE_URL
    const absolute = (src) => (src?.startsWith('http') ? src : `${origin}${src ?? ''}`)

    const breadcrumbs = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: TEXT[lang].home, item: `${origin}/` },
        { '@type': 'ListItem', position: 2, name: 'Shop', item: `${origin}/shop` },
        { '@type': 'ListItem', position: 3, name: product.name },
      ],
    }

    const price = priceOf(product)
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify([breadcrumbs, {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: productDescription(product, lang),
      sku: product.slug,
      category: product.category,
      image: (product.images ?? []).map(absolute),
      brand: { '@type': 'Brand', name: SITE_NAME },
      offers: {
        '@type': 'Offer',
        url: SITE_URL + window.location.pathname,
        priceCurrency: 'EUR',
        price: (price / 100).toFixed(2),
        availability: 'https://schema.org/InStock',
        // Dostava samo po Crnoj Gori, uvijek ista cijena;
        // slanje u roku od 24h, kurir 2 do 3 radna dana
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'ME' },
          shippingRate: { '@type': 'MonetaryAmount', value: (SHIPPING_COST / 100).toFixed(2), currency: 'EUR' },
          deliveryTime: {
            '@type': 'ShippingDeliveryTime',
            handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY' },
            transitTime: { '@type': 'QuantitativeValue', minValue: 2, maxValue: 3, unitCode: 'DAY' },
          },
        },
      },
    }])
    document.head.appendChild(script)
    return () => script.remove()
  }, [product, lang])
}
