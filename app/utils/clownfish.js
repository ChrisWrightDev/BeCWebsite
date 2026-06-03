export function slugifyClownfishName(name) {
  if (!name || typeof name !== 'string') return ''
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function clownfishImageAlt(fish) {
  const parts = [fish.name]
  if (fish.pattern) parts.push(fish.pattern)
  parts.push('captive-bred ocellaris clownfish')
  return parts.join(' — ')
}

export function formatPriceCents(cents) {
  if (typeof cents !== 'number') return '$—'
  return `$${(cents / 100).toFixed(2)}`
}

export function compactDescription(fish) {
  const fallback = 'Captive-bred clownfish raised for hardy reef aquariums.'
  const text = fish?.description || fallback
  if (text.length <= 118) return text
  return `${text.slice(0, 115).trim().replace(/[,.!;:]$/, '')}…`
}

export function clownfishBestFor(fish) {
  const name = `${fish?.name || ''} ${fish?.pattern || ''}`.toLowerCase()
  if (name.includes('standard') || name.includes('mocha')) {
    return 'Best for beginner reef keepers seeking a hardy, peaceful starter clownfish.'
  }
  if (name.includes('wyoming')) return 'Best for aquariums that need a bright white centerpiece fish.'
  if (name.includes('snowflake')) return 'Best for hobbyists who want unique white patterning without premium pricing.'
  if (name.includes('davinci') || name.includes('gladiator')) {
    return 'Best for designer-morph fans who like bold swirls and orange contrast.'
  }
  if (name.includes('frostbite') || name.includes('bullethole')) {
    return 'Best for collectors looking for high-contrast designer patterning.'
  }
  if (name.includes('storm') || name.includes('ghost')) {
    return 'Best for premium designer displays and showpiece reef aquariums.'
  }
  return 'Best for reef aquariums that need a captive-bred, feeding-ready clownfish.'
}

export function clownfishCategory(fish) {
  const name = `${fish?.name || ''} ${fish?.pattern || ''}`.toLowerCase()
  if (name.includes('standard') || name.includes('mocha')) return 'Beginner friendly'
  if (name.includes('storm') || name.includes('ghost') || name.includes('snowstorm')) return 'Premium designer'
  if (name.includes('snow') || name.includes('frost') || name.includes('bullethole')) return 'Designer pattern'
  return fish?.pattern || 'Captive-bred'
}

export function productSeoTitle(fish) {
  if (!fish?.name) return 'Captive-Bred Clownfish for Sale'
  return `${fish.name} Clownfish for Sale | Captive-Bred | Blue-Eyed Clowns`
}

export function productSeoDescription(fish) {
  if (!fish?.name) return 'Shop captive-bred clownfish with overnight live-fish shipping Monday through Friday and a 3-day live guarantee.'
  const fit = clownfishBestFor(fish).replace(/^Best for /, '').replace(/\.$/, '')
  return `Shop captive-bred ${fish.name} clownfish — ${fit}. Overnight live-fish shipping Monday through Friday and a 3-day live guarantee from Blue-Eyed Clowns.`
}

export function quickFactsForClownfish(fish) {
  const name = fish?.name || 'Captive-bred clownfish'
  return [
    { label: 'Species / morph', value: `${name}${fish?.pattern ? ` (${fish.pattern})` : ''}` },
    { label: 'Captive-bred status', value: 'Tank-raised in aquaculture systems' },
    { label: 'Approximate size', value: 'Juvenile to young adult; confirm current batch size before shipping' },
    { label: 'Temperament', value: 'Peaceful to semi-aggressive ocellaris-type clownfish' },
    { label: 'Reef safe', value: 'Yes — suitable for established reef aquariums' },
    { label: 'Care level', value: name.toLowerCase().includes('standard') || name.toLowerCase().includes('mocha') ? 'Beginner friendly' : 'Beginner to intermediate' },
    { label: 'Suggested tank size', value: '20+ gallons for a single or pair' },
    { label: 'Pairing notes', value: 'Ask us about compatible singles or future pair availability' },
    { label: 'Diet', value: 'Feeding on prepared marine foods before shipping' },
    { label: 'Shipping schedule', value: 'Overnight live-fish shipping Monday through Friday' },
    { label: 'Guarantee', value: '3-day live guarantee with live-arrival support' },
  ]
}

export function relatedClownfish(current, catalog = []) {
  const currentSlug = current?.slug
  const samePattern = catalog.filter((fish) => fish.slug !== currentSlug && fish.pattern === current?.pattern)
  const others = catalog.filter((fish) => fish.slug !== currentSlug && fish.pattern !== current?.pattern)
  return [...samePattern, ...others].slice(0, 3)
}
