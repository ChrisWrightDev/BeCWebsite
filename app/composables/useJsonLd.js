/**
 * Inject JSON-LD structured data via useHead script tag.
 * @param {Record<string, unknown> | Record<string, unknown>[]} schema
 */
export function useJsonLd(schema) {
  const items = Array.isArray(schema) ? schema : [schema]

  useHead({
    script: items.map((item, index) => ({
      key: `jsonld-${index}`,
      type: 'application/ld+json',
      innerHTML: JSON.stringify(item),
    })),
  })
}

export function buildOrganizationSchema(siteUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Blue-Eyed Clowns',
    url: siteUrl,
    logo: `${siteUrl}/images/og-default.svg`,
    email: 'support@blueeyedclowns.com',
    description:
      'Captive-bred ocellaris, snowflake and designer clownfish with a 30-day health guarantee.',
  }
}

export function buildWebSiteSchema(siteUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Blue-Eyed Clowns',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/shop?pattern={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function buildProductSchema(fish, siteUrl) {
  const url = `${siteUrl}/shop/${fish.slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: fish.name,
    description: fish.description || `${fish.name} — tank-bred clownfish from Blue-Eyed Clowns.`,
    url,
    image: fish.image_url || `${siteUrl}/images/og-default.svg`,
    sku: fish.id,
    brand: { '@type': 'Brand', name: 'Blue-Eyed Clowns' },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'USD',
      price: (fish.price_cents / 100).toFixed(2),
      availability: fish.in_stock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  }
}

export function buildItemListSchema(fishList, siteUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: fishList.map((fish, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${siteUrl}/shop/${fish.slug}`,
      name: fish.name,
    })),
  }
}

export function buildBreadcrumbSchema(crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  }
}

export function buildContactPageSchema(siteUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Blue-Eyed Clowns',
    url: `${siteUrl}/contact`,
    mainEntity: {
      '@type': 'Organization',
      name: 'Blue-Eyed Clowns',
      email: 'support@blueeyedclowns.com',
      url: siteUrl,
    },
  }
}
