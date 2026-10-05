import { honeypotTripped, validateSubscriberInput } from '#shared/publicForms.js'
import { releaseListWelcomeDecision } from '#shared/releaseListEmail.js'
import { allowRequest, requestRateKey } from '../../utils/rateLimit.js'
import { useSupabaseAdmin } from '../../utils/supabaseAdmin.js'
import { upsertCustomer } from '../../utils/customers.js'
import { sendReleaseListWelcome } from '../../utils/releaseListMail.js'
import { syncSubscribedContact } from '../../utils/hatchClubResend.js'
import { randomBytes } from 'node:crypto'

const SUCCESS_MESSAGE = "You're on the list. We'll email you when new morphs and batches are released."

function httpError(statusCode, statusMessage) {
  return createError({ statusCode, statusMessage, message: statusMessage })
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!allowRequest(requestRateKey(event, 'subscribers'))) {
    throw httpError(429, 'Too many signup attempts. Please wait a few minutes and try again.')
  }
  if (honeypotTripped(body)) {
    return { ok: true, already: false, welcomeSent: false, message: SUCCESS_MESSAGE }
  }

  const parsed = validateSubscriberInput(body)
  if (!parsed.ok) throw httpError(400, parsed.error)

  const supabase = useSupabaseAdmin()
  const { email, name, source } = parsed.value
  const { data: existing, error: readError } = await supabase
    .from('subscribers')
    .select('id, status, name')
    .eq('email', email)
    .maybeSingle()

  if (readError) {
    console.error('[subscribers] lookup failed', readError)
    throw httpError(500, 'Could not save your signup. Please try again.')
  }

  const decision = releaseListWelcomeDecision(existing?.status)
  if (decision === 'skip') {
    await rememberSubscriber(supabase, parsed.value)
    return { ok: true, already: true, welcomeSent: false, message: SUCCESS_MESSAGE }
  }

  const token = randomBytes(32).toString('hex')
  const storedName = decision === 'resubscribe' ? (existing.name || name) : name
  if (decision === 'resubscribe') {
    const { data: updated, error } = await supabase
      .from('subscribers')
      .update({
        status: 'subscribed',
        name: storedName,
        source,
        unsubscribed_at: null,
        unsubscribe_token: token,
        unsubscribe_reason: null,
        unsubscribe_feedback: null,
      })
      .eq('id', existing.id)
      .eq('status', 'unsubscribed')
      .select('id')
      .maybeSingle()
    if (error) {
      console.error('[subscribers] resubscribe failed', error)
      throw httpError(500, 'Could not save your signup. Please try again.')
    }
    if (!updated) {
      await rememberSubscriber(supabase, parsed.value)
      return { ok: true, already: true, welcomeSent: false, message: SUCCESS_MESSAGE }
    }
  } else {
    const { error } = await supabase.from('subscribers').insert({
      email,
      name,
      source,
      status: 'subscribed',
      unsubscribe_token: token,
    })
    if (error?.code === '23505') {
      await rememberSubscriber(supabase, parsed.value)
      return { ok: true, already: true, welcomeSent: false, message: SUCCESS_MESSAGE }
    }
    if (error) {
      console.error('[subscribers] insert failed', error)
      throw httpError(500, 'Could not save your signup. Please try again.')
    }
  }

  await rememberSubscriber(supabase, parsed.value)
  const welcomeSent = await deliverWelcome({
    email,
    name: storedName,
    token,
  })
  await syncHatchClub({ email, name: storedName })
  return {
    ok: true,
    already: false,
    welcomeSent,
    message: decision === 'resubscribe'
      ? "You're back on the list. We'll email you about new releases."
      : SUCCESS_MESSAGE,
  }
})

async function deliverWelcome(subscriber) {
  try {
    const result = await sendReleaseListWelcome(subscriber)
    return result?.sent === true
  } catch (error) {
    console.error('[subscribers] welcome email failed', error)
    return false
  }
}

async function syncHatchClub(subscriber) {
  try {
    await syncSubscribedContact(subscriber)
  } catch (error) {
    console.error('[subscribers] hatch club sync failed', error)
  }
}

async function rememberSubscriber(supabase, subscriber) {
  try {
    await upsertCustomer(supabase, {
      email: subscriber.email,
      name: subscriber.name,
      source: 'subscriber',
    })
  } catch (error) {
    console.error('[subscribers] customer upsert failed', error)
  }
}
