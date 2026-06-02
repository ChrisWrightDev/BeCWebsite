import { useSupabaseAdmin } from './supabaseAdmin.js'

const CLOWNFISH_COLUMNS =
  'id, name, description, price_cents, pattern, image_url, in_stock'

const LOCAL_PREVIEW_CLOWNFISH = [
  {
    id: 'local-standard-ocellaris',
    name: 'Standard Ocellaris',
    description:
      'Hardy captive-bred ocellaris clownfish that are feeding well and ready for beginner reef aquariums.',
    price_cents: 3999,
    pattern: 'Ocellaris',
    image_url: null,
    in_stock: true,
  },
  {
    id: 'local-snowflake-ocellaris',
    name: 'Snowflake Ocellaris',
    description:
      'Tank-raised snowflake ocellaris with unique white patterning and the steady temperament reef keepers expect from captive-bred clownfish.',
    price_cents: 6999,
    pattern: 'Snowflake',
    image_url: null,
    in_stock: true,
  },
  {
    id: 'local-black-ice-ocellaris',
    name: 'Black Ice Ocellaris',
    description:
      'Designer black ice ocellaris raised in aquaculture systems for high contrast reef displays.',
    price_cents: 8999,
    pattern: 'Black Ice',
    image_url: null,
    in_stock: false,
  },
]

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

function getLocalPreviewCatalog() {
  return LOCAL_PREVIEW_CLOWNFISH.map(enrichClownfish)
}

function hasSupabaseConfig() {
  const config = useRuntimeConfig()
  return Boolean(config.supabaseUrl && config.supabaseServiceRoleKey)
}

export async function fetchClownfishCatalog() {
  if (!hasSupabaseConfig()) {
    return getLocalPreviewCatalog()
  }

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
