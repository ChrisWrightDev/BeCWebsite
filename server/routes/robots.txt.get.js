export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = (config.public.siteUrl || 'https://www.blueeyedclowns.com').replace(/\/$/, '')

  const body = `User-Agent: *
Disallow: /ops/
Disallow: /api/

Sitemap: ${siteUrl}/sitemap.xml
`

  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  return body
})
