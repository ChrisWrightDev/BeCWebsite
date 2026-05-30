import { useSupabaseAdmin } from './supabaseAdmin.js'

const CLOWNFISH_COLUMNS =
  'id, name, description, price_cents, pattern, image_url, in_stock'

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

function enrichClownfish(row) {
  return {
    ...row,
    slug: slugifyClownfishName(row.name),
  }
}

export async function fetchClownfishCatalog() {
  const supabase = useSupabaseAdmin()
  const { data, error } = await supabase
    .from('clownfish')
    .select(CLOWNFISH_COLUMNS)
    .order('price_cents')

  if (error) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Could not load clownfish catalog',
      data: { message: error.message },
    })
  }

  return (data || []).map(enrichClownfish)
}

export async function fetchClownfishBySlug(slug) {
  const catalog = await fetchClownfishCatalog()
  return catalog.find((fish) => fish.slug === slug) || null
}
