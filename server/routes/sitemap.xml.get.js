const INDEXABLE_PATHS = ['/', '/shop', '/about', '/contact']

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = (config.public.siteUrl || 'https://www.blueeyedclowns.com').replace(/\/$/, '')
  const lastmod = new Date().toISOString().slice(0, 10)

  const urls = INDEXABLE_PATHS.map(
    (path) => `  <url>
    <loc>${siteUrl}${path === '/' ? '' : path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${path === '/shop' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${path === '/' ? '1.0' : path === '/shop' ? '0.9' : '0.7'}</priority>
  </url>`
  ).join('\n')

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  return body
})
