import { ORGANIZATION_SAME_AS } from '~/utils/socialProfiles'

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
    email: 'blueeyedclowns@gmail.com',
    sameAs: ORGANIZATION_SAME_AS,
    description:
      'Captive-bred ocellaris, snowflake and designer clownfish with a 3-day live guarantee.',
  }
}

export function buildWebSiteSchema(siteUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Blue-Eyed Clowns',
    url: siteUrl,
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

export function buildBondedPairProductSchema(pair, siteUrl) {
  const url = `${siteUrl}/bonded-pairs/${pair.slug}`
  const availability =
    pair.status === 'available'
      ? 'https://schema.org/InStock'
      : pair.status === 'reserved'
        ? 'https://schema.org/LimitedAvailability'
        : 'https://schema.org/OutOfStock'

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: pair.name,
    description: pair.description || `${pair.name} — unique bonded clownfish pair from Blue-Eyed Clowns.`,
    url,
    image: pair.image_url || pair.video_poster_url || `${siteUrl}/images/og-default.svg`,
    sku: pair.id,
    brand: { '@type': 'Brand', name: 'Blue-Eyed Clowns' },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'USD',
      price: (pair.price_cents / 100).toFixed(2),
      availability,
    },
  }
}

export function buildBondedPairItemListSchema(pairs, siteUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: pairs.map((pair, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${siteUrl}/bonded-pairs/${pair.slug}`,
      name: pair.name,
    })),
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
      email: 'blueeyedclowns@gmail.com',
      url: siteUrl,
      sameAs: ORGANIZATION_SAME_AS,
    },
  }
}

export function buildAboutPageSchema(siteUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Blue-Eyed Clowns',
    url: `${siteUrl}/about`,
    mainEntity: {
      '@type': 'Organization',
      name: 'Blue-Eyed Clowns',
      url: siteUrl,
      sameAs: ORGANIZATION_SAME_AS,
      founder: [
        buildPersonSchema('Chris Wright', 'Co-Founder', siteUrl),
        buildPersonSchema('Mike Kay', 'Co-Founder', siteUrl),
      ],
    },
  }
}

function buildPersonSchema(name, jobTitle, siteUrl) {
  const slug = name.toLowerCase().replace(/\s+/g, '-')
  return {
    '@type': 'Person',
    name,
    jobTitle,
    worksFor: { '@type': 'Organization', name: 'Blue-Eyed Clowns', url: siteUrl },
    image: `${siteUrl}/images/founders/${slug}.svg`,
  }
}
