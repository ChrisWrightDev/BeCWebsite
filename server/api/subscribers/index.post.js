import { honeypotTripped, validateSubscriberInput } from '#shared/publicForms.js'
import { allowRequest, requestRateKey } from '../../utils/rateLimit.js'
import { useSupabaseAdmin } from '../../utils/supabaseAdmin.js'
import { upsertCustomer } from '../../utils/customers.js'
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
    return { ok: true, message: SUCCESS_MESSAGE }
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

  if (existing?.status === 'subscribed') {
    await rememberSubscriber(supabase, parsed.value)
    return { ok: true, message: SUCCESS_MESSAGE }
  }

  const token = randomBytes(32).toString('hex')
  if (existing) {
    const { error } = await supabase
      .from('subscribers')
      .update({
        status: 'subscribed',
        name: existing.name || name,
        source,
        unsubscribed_at: null,
        unsubscribe_token: token,
      })
      .eq('id', existing.id)
    if (error) {
      console.error('[subscribers] resubscribe failed', error)
      throw httpError(500, 'Could not save your signup. Please try again.')
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
      return { ok: true, message: SUCCESS_MESSAGE }
    }
    if (error) {
      console.error('[subscribers] insert failed', error)
      throw httpError(500, 'Could not save your signup. Please try again.')
    }
  }

  await rememberSubscriber(supabase, parsed.value)
  return {
    ok: true,
    message: existing
      ? "You're back on the list. We'll email you about new releases."
      : SUCCESS_MESSAGE,
  }
})

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
