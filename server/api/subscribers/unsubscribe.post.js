import { useSupabaseAdmin } from '../../utils/supabaseAdmin.js'
import { allowRequest, requestRateKey } from '../../utils/rateLimit.js'

function httpError(statusCode, statusMessage) {
  return createError({ statusCode, statusMessage, message: statusMessage })
}

export default defineEventHandler(async (event) => {
  if (!allowRequest(requestRateKey(event, 'unsubscribe'), { limit: 20, windowMs: 10 * 60 * 1000 })) {
    throw httpError(429, 'Too many attempts. Please wait a few minutes and try again.')
  }

  const body = await readBody(event)
  const token = String(body?.token || '').trim().toLowerCase()
  if (!/^[a-f0-9]{64}$/.test(token)) {
    throw httpError(400, 'This unsubscribe link is not valid.')
  }

  const supabase = useSupabaseAdmin()
  const now = new Date().toISOString()
  const { data: updated, error } = await supabase
    .from('subscribers')
    .update({ status: 'unsubscribed', unsubscribed_at: now })
    .eq('unsubscribe_token', token)
    .eq('status', 'subscribed')
    .select('id')
    .maybeSingle()

  if (error) {
    console.error('[subscribers] unsubscribe failed', error)
    throw httpError(500, 'Could not update your subscription. Please try again.')
  }
  if (updated) {
    return { ok: true, message: 'You have been unsubscribed from the release list.' }
  }

  const { data: existing, error: readError } = await supabase
    .from('subscribers')
    .select('status')
    .eq('unsubscribe_token', token)
    .maybeSingle()

  if (readError) {
    console.error('[subscribers] unsubscribe lookup failed', readError)
    throw httpError(500, 'Could not update your subscription. Please try again.')
  }
  if (!existing) {
    throw httpError(404, 'This unsubscribe link is not valid.')
  }
  return { ok: true, message: 'You are already unsubscribed from the release list.' }
})
