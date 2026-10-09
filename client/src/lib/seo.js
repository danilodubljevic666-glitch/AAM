import { useEffect } from 'react'
import { priceOf } from './pricing.js'

const SITE_NAME = '2AM'
const HOME_TITLE = '2AM — Same city, different thoughts'
const HOME_DESCRIPTION =
  '2AM — majice za one koji su budni kad svi drugi spavaju. Teški pamuk, minimalistički printovi, dostava širom Crne Gore.'

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
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : HOME_TITLE
    const desc = description || HOME_DESCRIPTION
    const url = window.location.origin + window.location.pathname


    document.title = fullTitle
    meta('description').content = desc
    meta('robots').content = noIndex ? 'noindex, nofollow' : 'index, follow'
    meta('og:title', 'property').content = fullTitle
    meta('og:description', 'property').content = desc
    meta('og:url', 'property').content = url
    meta('twitter:title').content = fullTitle
    meta('twitter:description').content = desc

    // Slika u pregledu linka: na stranici proizvoda njegova fotografija, inače opšta og.jpg.
    // Programi koji prave pregled (WhatsApp, Instagram) ne pokreću JavaScript — njima to
    // servira server (server/src/routes/seo.js); ovo je za Google i za dijeljenje iz browsera.
    const origin = window.location.origin
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
  }, [title, description, image, noIndex])
}

// Google u rezultatima pretrage može da prikaže cijenu i dostupnost majice.
// Cijene su u centima, schema.org ih traži kao "29.90".
export function useProductJsonLd(product) {
  useEffect(() => {
    if (!product) return

    const origin = window.location.origin
    const absolute = (src) => (src?.startsWith('http') ? src : `${origin}${src ?? ''}`)

    const breadcrumbs = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Početna', item: `${origin}/` },
        { '@type': 'ListItem', position: 2, name: 'Shop', item: `${origin}/shop` },
        { '@type': 'ListItem', position: 3, name: product.name },
      ],
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify([breadcrumbs, {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      sku: product.slug,
      category: product.category,
      image: (product.images ?? []).map(absolute),
      brand: { '@type': 'Brand', name: SITE_NAME },
      offers: {
        '@type': 'Offer',
        url: origin + window.location.pathname,
        priceCurrency: 'EUR',
        price: (priceOf(product) / 100).toFixed(2),
        availability: 'https://schema.org/InStock',
      },
    }])
    document.head.appendChild(script)
    return () => script.remove()
  }, [product])
}
