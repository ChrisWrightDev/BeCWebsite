/**
 * One-time seed of subscribed public.subscribers rows into the Resend
 * Hatch Club segment. Not part of npm test, postinstall, or the site runtime.
 *
 * Dry run (prints the rows, writes nothing):
 *   RESEND_API_KEY=re_... RESEND_HATCH_CLUB_SEGMENT_ID=... \
 *   NUXT_SUPABASE_URL=https://....supabase.co \
 *   NUXT_SUPABASE_SERVICE_ROLE_KEY=... \
 *   node scripts/seed-hatch-club-segment.mjs
 *
 * Apply:
 *   node scripts/seed-hatch-club-segment.mjs --apply
 *
 * Requires a Resend key that can manage contacts and segments. Does not send
 * email and does not delete Supabase rows.
 */
import { createClient } from '@supabase/supabase-js'
import { syncSubscribedContact } from '../server/utils/hatchClubResend.js'

const apply = process.argv.includes('--apply')

function required(name) {
  const value = String(process.env[name] || '').trim()
  if (!value) {
    console.error(`Missing ${name}. Export it before running this script.`)
    process.exit(1)
  }
  return value
}

const supabaseUrl = required('NUXT_SUPABASE_URL')
const serviceRoleKey = required('NUXT_SUPABASE_SERVICE_ROLE_KEY')
required('RESEND_API_KEY')
required('RESEND_HATCH_CLUB_SEGMENT_ID')

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const pageSize = 100
const rows = []
for (let from = 0; ; from += pageSize) {
  const { data, error } = await supabase
    .from('subscribers')
    .select('email, name, status')
    .eq('status', 'subscribed')
    .order('created_at', { ascending: true })
    .range(from, from + pageSize - 1)
  if (error) {
    console.error('Could not read public.subscribers:', error.message || error)
    process.exit(1)
  }
  rows.push(...(data || []))
  if (!data || data.length < pageSize) break
}

console.log(`${apply ? 'Applying' : 'Dry run'}: ${rows.length} subscribed row${rows.length === 1 ? '' : 's'}.`)
for (const row of rows) {
  console.log(`- ${row.email}${row.name ? ` (${row.name})` : ''}`)
}

if (!apply) {
  console.log('No Resend writes. Re-run with --apply to upsert these contacts into Hatch Club.')
  process.exit(0)
}

let failed = 0
for (const row of rows) {
  const result = await syncSubscribedContact({ email: row.email, name: row.name })
  if (!result.ok || result.skipped) {
    failed += 1
    console.error(`Failed ${row.email}: ${result.action || result.reason || 'unknown'}`)
  } else {
    console.log(`Synced ${row.email} (${result.action})`)
  }
}

if (failed) {
  console.error(`${failed} contact${failed === 1 ? '' : 's'} failed.`)
  process.exit(1)
}
console.log('Hatch Club seed finished.')
