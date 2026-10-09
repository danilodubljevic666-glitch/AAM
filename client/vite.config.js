import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'

// Jedno mjesto za adresu sajta: upisuje se u index.html (canonical, og:image, JSON-LD)
// i u robots.txt pri buildu. Sam sitemap.xml pravi server (routes/seo.js), da bi
// nova majica dodata kroz /admin odmah ušla u njega, bez novog deploya.
// Promjena domena = Vercel → Settings → Environment Variables → VITE_SITE_URL.
function siteUrlPlugin(siteUrl) {
  return {
    name: 'aam-site-url',
    transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', siteUrl),
    generateBundle() {
      const robots = [
        'User-agent: *',
        'Allow: /',
        '',
        '# Admin panel i korak naručivanja ne idu u pretragu',
        'Disallow: /admin',
        'Disallow: /narudzba',
        '',
        `Sitemap: ${siteUrl}/sitemap.xml`,
        '',
      ].join('\n')

      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = (env.VITE_SITE_URL || 'https://aam.vercel.app').replace(/\/+$/, '')

  return {
    plugins: [react(), tailwindcss(), siteUrlPlugin(siteUrl)],
    server: {
      port: 5173,
      proxy: {
        '/api': 'http://localhost:5000',
      },
    },
    build: {
      // admin panel + Supabase klijent idu u svoj fajl, da ne terete prvi utisak
      chunkSizeWarningLimit: 700,
    },
  }
})
