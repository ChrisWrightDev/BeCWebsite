import { fetchClownfishCatalog } from '../utils/clownfishCatalog.js'
import { fetchPublishedBlogPosts } from '../utils/blogCatalog.js'
import { fetchPublicHatchBatches } from '../utils/hatchBatchesCatalog.js'

const INDEXABLE_PATHS = [
  '/',
  '/shop',
  '/about',
  '/contact',
  '/blog',
  '/why-captive-bred-clownfish-matter',
  '/3-day-live-guarantee',
  '/guides/clownfish-care',
  '/guides/clownfish-morphs',
  '/guides/shipping-live-clownfish',
]

function buildUrlEntry(siteUrl, path, options = {}) {
  const loc = `${siteUrl}${path === '/' ? '' : path}`
  const lastmod = new Date().toISOString().slice(0, 10)
  const changefreq = options.changefreq || (path === '/shop' ? 'weekly' : 'monthly')
  const priority = options.priority || (path === '/' ? '1.0' : path === '/shop' ? '0.9' : '0.7')

  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = (config.public.siteUrl || 'https://blueeyedclowns.com').replace(/\/$/, '')

  const staticUrls = INDEXABLE_PATHS.map((path) => buildUrlEntry(siteUrl, path))

  let productUrls = []
  try {
    const catalog = await fetchClownfishCatalog()
    productUrls = catalog
      .filter((fish) => fish.in_stock)
      .map((fish) =>
        buildUrlEntry(siteUrl, `/shop/${fish.slug}`, { changefreq: 'weekly', priority: '0.8' })
      )
  } catch {
    // Sitemap still serves static routes if catalog is unavailable
  }

  let blogUrls = []
  try {
    const posts = await fetchPublishedBlogPosts()
    blogUrls = posts.map((post) =>
      buildUrlEntry(siteUrl, `/blog/${post.slug}`, { changefreq: 'monthly', priority: '0.7' })
    )
  } catch {
    // Sitemap still serves without blog posts if unavailable
  }

  let hatchUrls = []
  try {
    const batches = await fetchPublicHatchBatches()
    hatchUrls = batches.map((batch) =>
      buildUrlEntry(siteUrl, `/blog/hatch/${batch.slug}`, { changefreq: 'weekly', priority: '0.6' })
    )
  } catch {
    // Sitemap still serves without hatch batches if unavailable
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...productUrls, ...blogUrls, ...hatchUrls].join('\n')}
</urlset>`

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  return body
})
