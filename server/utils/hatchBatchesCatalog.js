import { useSupabaseAdmin } from './supabaseAdmin.js'

const PUBLIC_COLUMNS = [
  'id',
  'batch_code',
  'egg_laid_date',
  'hatch_date',
  'first_feed_date',
  'transfer_date',
  'growout_date',
  'ready_for_sale_date',
  'initial_egg_count',
  'hatch_count',
  'transferred_count',
  'current_count',
  'stage',
  'status',
  'transfer_from_tank_label',
  'transfer_to_tank_label',
  'transfer_history',
  'public_title',
  'public_slug',
  'public_summary',
  'public_notes',
  'public_featured_image_url',
  'published_at',
  'days_to_hatch',
  'survival_rate_percent',
  'metadata',
].join(', ')

/** Customer-facing lifecycle steps from eggs → sale-ready adults. */
export const HATCH_LIFECYCLE_STEPS = [
  { key: 'eggs', label: 'Eggs', dateField: 'egg_laid_date', countField: 'initial_egg_count' },
  { key: 'hatched', label: 'Hatch', dateField: 'hatch_date', countField: 'hatch_count' },
  { key: 'first_feed', label: 'First feed', dateField: 'first_feed_date', countField: null },
  { key: 'transfer', label: 'Transfer', dateField: 'transfer_date', countField: 'transferred_count' },
  { key: 'growout', label: 'Grow-out', dateField: 'growout_date', countField: null },
  { key: 'ready', label: 'Ready for sale', dateField: 'ready_for_sale_date', countField: 'current_count' },
]

const STAGE_TO_STEP = {
  eggs: 'eggs',
  incubating: 'eggs',
  hatched: 'hatched',
  larval: 'first_feed',
  transfer: 'transfer',
  transferred: 'transfer',
  juvenile: 'growout',
  growout: 'growout',
  weaned: 'ready',
  ready: 'ready',
  ready_for_sale: 'ready',
}

const STAGE_LABELS = {
  eggs: 'Eggs',
  hatched: 'Hatched',
  transfer: 'Transferring',
  juvenile: 'Grow-out',
  weaned: 'Weaned',
  ready: 'Ready for sale',
}

const STATUS_LABELS = {
  active: 'In progress',
  watch: 'Watching',
  completed: 'Completed',
  lost: 'Lost batch',
}

function formatPublicDate(value) {
  if (!value) return null
  const date = new Date(`${value}T12:00:00`)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function normalizeTransferHistory(history) {
  if (!Array.isArray(history)) return []
  return history
    .map((entry) => ({
      date: entry?.date || null,
      date_label: formatPublicDate(entry?.date),
      from: entry?.from || null,
      to: entry?.to || null,
      count: typeof entry?.count === 'number' ? entry.count : null,
      notes: entry?.notes || null,
    }))
    .sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')))
}

function buildLifecycle(row) {
  const currentStepKey = STAGE_TO_STEP[row?.stage] || 'eggs'
  const currentIndex = HATCH_LIFECYCLE_STEPS.findIndex((step) => step.key === currentStepKey)

  return HATCH_LIFECYCLE_STEPS.map((step, index) => {
    const dateValue = row?.[step.dateField] || null
    const countValue = step.countField != null ? row?.[step.countField] : null
    const complete = Boolean(dateValue) || index < currentIndex
    const current = index === currentIndex

    return {
      key: step.key,
      label: step.label,
      date: dateValue,
      date_label: formatPublicDate(dateValue),
      count: typeof countValue === 'number' ? countValue : null,
      complete,
      current,
      upcoming: index > currentIndex && !dateValue,
    }
  })
}

export function normalizePublicHatchBatch(row) {
  const metadata = row?.metadata && typeof row.metadata === 'object' ? row.metadata : {}
  const title = row?.public_title?.trim() || row?.batch_code || 'Hatch batch'
  const slug = row?.public_slug || String(row?.batch_code || row?.id || '').toLowerCase()

  return {
    id: row.id,
    batch_code: row.batch_code,
    title,
    slug,
    summary: row.public_summary || 'Follow this clutch as it moves from eggs to reef-ready clownfish.',
    notes: row.public_notes || null,
    image_url: row.public_featured_image_url || null,
    stage: row.stage || 'eggs',
    stage_label: STAGE_LABELS[row.stage] || row.stage || 'Eggs',
    status: row.status || 'active',
    status_label: STATUS_LABELS[row.status] || row.status || 'In progress',
    pair_name: metadata.pair_name || null,
    parent_tank_label: metadata.parent_tank_label || row.transfer_from_tank_label || null,
    current_tank_label:
      metadata.current_tank_label || metadata.hatch_tank_label || row.transfer_to_tank_label || null,
    egg_laid_date: row.egg_laid_date,
    egg_laid_date_label: formatPublicDate(row.egg_laid_date),
    hatch_date: row.hatch_date,
    hatch_date_label: formatPublicDate(row.hatch_date),
    first_feed_date: row.first_feed_date,
    transfer_date: row.transfer_date,
    growout_date: row.growout_date,
    ready_for_sale_date: row.ready_for_sale_date,
    initial_egg_count: row.initial_egg_count,
    hatch_count: row.hatch_count,
    transferred_count: row.transferred_count,
    current_count: row.current_count,
    days_to_hatch: row.days_to_hatch,
    survival_rate_percent: row.survival_rate_percent,
    published_at: row.published_at,
    transfer_history: normalizeTransferHistory(row.transfer_history),
    lifecycle: buildLifecycle(row),
  }
}

export async function fetchPublicHatchBatches() {
  const supabase = useSupabaseAdmin()
  const { data, error } = await supabase
    .from('hatch_batches')
    .select(PUBLIC_COLUMNS)
    .eq('public_visible', true)
    .order('egg_laid_date', { ascending: false, nullsFirst: false })
    .order('hatch_date', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (error) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Could not load hatch batches',
      data: { message: error.message },
    })
  }

  return (data || []).map(normalizePublicHatchBatch)
}

export async function fetchPublicHatchBatchBySlug(slug) {
  if (!slug) return null
  const batches = await fetchPublicHatchBatches()
  return batches.find((batch) => batch.slug === slug) || null
}
