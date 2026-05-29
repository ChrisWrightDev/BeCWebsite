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
  parts.push('tank-bred clownfish')
  return parts.join(' — ')
}

export function formatPriceCents(cents) {
  if (typeof cents !== 'number') return '$—'
  return `$${(cents / 100).toFixed(2)}`
}
