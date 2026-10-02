import { enrichBondedPair, isShopVisibleBondedPair } from '#shared/bondedPairs.js'
import { useSupabaseAdmin } from './supabaseAdmin.js'

const BONDED_PAIR_COLUMNS =
  'id, slug, name, male_morph, female_morph, description, price_cents, status, image_url, video_path, video_poster_path, bonded_on, tank_label, sort_order'

const LOCAL_PREVIEW_PAIRS = [
  {
    id: 'local-mocha-bonded-pair',
    slug: 'mocha-ocellaris-bonded-pair-preview',
    name: 'Mocha Ocellaris Bonded Pair',
    male_morph: 'Mocha Ocellaris',
    female_morph: 'Mocha Ocellaris',
    description:
      'A unique WYSIWYG bonded pair. The media on this page shows the exact pair you receive.',
    price_cents: 4800,
    status: 'available',
    image_url: null,
    video_path: null,
    video_poster_path: null,
    bonded_on: null,
    tank_label: null,
    sort_order: 1,
  },
]

function hasSupabaseConfig() {
  const config = useRuntimeConfig()
  return Boolean(config.supabaseUrl && config.supabaseServiceRoleKey)
}

function supabasePublicUrl() {
  const config = useRuntimeConfig()
  return config.public?.supabaseUrl || config.supabaseUrl || ''
}

function getLocalPreviewPairs() {
  return LOCAL_PREVIEW_PAIRS.map((row) => enrichBondedPair(row, ''))
}

function catalogError(statusMessage, error) {
  throw createError({
    statusCode: 502,
    statusMessage,
    data: { message: error?.message },
  })
}

export async function fetchBondedPairsCatalog({ includeSold = false } = {}) {
  if (!hasSupabaseConfig()) {
    return getLocalPreviewPairs().filter((pair) => includeSold || isShopVisibleBondedPair(pair))
  }

  const supabase = useSupabaseAdmin()
  const { data, error } = await supabase
    .from('bonded_pairs')
    .select(BONDED_PAIR_COLUMNS)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    catalogError('Could not load bonded pairs', error)
  }

  const supabaseUrl = supabasePublicUrl()
  return (data || [])
    .map((row) => enrichBondedPair(row, supabaseUrl))
    .filter((pair) => includeSold || isShopVisibleBondedPair(pair))
}

export async function fetchBondedPairBySlug(slug) {
  const catalog = await fetchBondedPairsCatalog()
  return catalog.find((pair) => pair.slug === slug) || null
}

export async function fetchBondedPairsByIds(ids) {
  const uniqueIds = [...new Set((ids || []).map((id) => String(id)).filter(Boolean))]
  if (uniqueIds.length === 0) return []

  if (!hasSupabaseConfig()) {
    const catalog = getLocalPreviewPairs()
    return uniqueIds
      .map((id) => catalog.find((pair) => String(pair.id) === id))
      .filter(Boolean)
  }

  const supabase = useSupabaseAdmin()
  const { data, error } = await supabase
    .from('bonded_pairs')
    .select(BONDED_PAIR_COLUMNS)
    .in('id', uniqueIds)

  if (error) {
    catalogError('Could not load bonded pair prices', error)
  }

  const supabaseUrl = supabasePublicUrl()
  return (data || []).map((row) => enrichBondedPair(row, supabaseUrl))
}
