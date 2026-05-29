const SITE_NAME = 'Blue-Eyed Clowns'
const DEFAULT_OG_IMAGE = '/images/og-default.png'

/**
 * Per-page SEO: title, description, canonical, Open Graph, Twitter, robots.
 * @param {{ title?: string, description?: string, ogImage?: string, noindex?: boolean, nofollow?: boolean }} options
 */
export function useSiteSeo(options = {}) {
  const route = useRoute()
  const config = useRuntimeConfig()
  const siteUrl = (config.public.siteUrl || 'https://www.blueeyedclowns.com').replace(/\/$/, '')

  const title = options.title ? `${options.title} | ${SITE_NAME}` : `${SITE_NAME} — Premium tank-bred clownfish`
  const description =
    options.description ||
    'Captive-bred ocellaris, snowflake & designer clownfish. 30-day health guarantee, safe overnight shipping.'
  const ogImage = options.ogImage || DEFAULT_OG_IMAGE
  const canonical = `${siteUrl}${route.path === '/' ? '' : route.path}`

  const robotsParts = []
  if (options.noindex) robotsParts.push('noindex')
  else robotsParts.push('index')
  if (options.nofollow) robotsParts.push('nofollow')
  else if (!options.noindex) robotsParts.push('follow')

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogImage: ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`,
    ogUrl: canonical,
    ogType: 'website',
    ogSiteName: SITE_NAME,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`,
    robots: robotsParts.join(', '),
  })

  useHead({
    link: [{ rel: 'canonical', href: canonical }],
  })
}
