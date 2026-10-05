import { validateUnsubscribeInput } from '#shared/publicForms.js'
import { useSupabaseAdmin } from '../../utils/supabaseAdmin.js'
import { allowRequest, requestRateKey } from '../../utils/rateLimit.js'
import { syncUnsubscribedContact } from '../../utils/hatchClubResend.js'

const DONE_MESSAGE = "You're off the release list. We won't email you about new morphs."

function httpError(statusCode, statusMessage) {
  return createError({ statusCode, statusMessage, message: statusMessage })
}

export default defineEventHandler(async (event) => {
  if (!allowRequest(requestRateKey(event, 'unsubscribe'), { limit: 20, windowMs: 10 * 60 * 1000 })) {
    throw httpError(429, 'Too many attempts. Please wait a few minutes and try again.')
  }

  const body = await readBody(event)
  const parsed = validateUnsubscribeInput(body)
  if (!parsed.ok) throw httpError(400, parsed.error)

  const { token, reason, feedback } = parsed.value
  const supabase = useSupabaseAdmin()
  const now = new Date().toISOString()

  // Keep the row. Status changes to unsubscribed; the address is not deleted.
  const { data: updated, error } = await supabase
    .from('subscribers')
    .update({
      status: 'unsubscribed',
      unsubscribed_at: now,
      unsubscribe_reason: reason,
      unsubscribe_feedback: feedback,
    })
    .eq('unsubscribe_token', token)
    .eq('status', 'subscribed')
    .select('id, email')
    .maybeSingle()

  if (error) {
    console.error('[subscribers] unsubscribe failed', error)
    throw httpError(500, 'Could not update your subscription. Please try again.')
  }
  if (updated) {
    await syncHatchClub(updated.email)
    return { ok: true, already: false, message: DONE_MESSAGE }
  }

  const { data: existing, error: readError } = await supabase
    .from('subscribers')
    .select('id, email')
    .eq('unsubscribe_token', token)
    .maybeSingle()

  if (readError) {
    console.error('[subscribers] unsubscribe lookup failed', readError)
    throw httpError(500, 'Could not update your subscription. Please try again.')
  }
  if (!existing) {
    throw httpError(404, 'This unsubscribe link is invalid or no longer works.')
  }

  const { error: noteError } = await supabase
    .from('subscribers')
    .update({
      status: 'unsubscribed',
      unsubscribe_reason: reason,
      unsubscribe_feedback: feedback,
    })
    .eq('id', existing.id)

  if (noteError) {
    console.error('[subscribers] unsubscribe note failed', noteError)
    throw httpError(500, 'Could not update your subscription. Please try again.')
  }

  await syncHatchClub(existing.email)
  return { ok: true, already: true, message: DONE_MESSAGE }
})

async function syncHatchClub(email) {
  try {
    await syncUnsubscribedContact({ email })
  } catch (error) {
    console.error('[subscribers] hatch club sync failed', error)
  }
}
