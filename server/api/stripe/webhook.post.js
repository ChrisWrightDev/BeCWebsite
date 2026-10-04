import { useSupabaseAdmin } from '../../utils/supabaseAdmin.js'
import { useStripe } from '../../utils/stripeClient.js'
import { fulfillPaidOrder } from '../../utils/fulfillPaidOrder.js'
import { getMailSettings } from '../../utils/mailer.js'

// Stripe signs the raw request body. Do not read it with readBody().

export default defineEventHandler(async (event) => {
  const { stripeWebhookSecret } = getMailSettings()
  if (!stripeWebhookSecret) {
    console.error('[stripe/webhook] STRIPE_WEBHOOK_SECRET is not set')
    throw createError({
      statusCode: 500,
      statusMessage: 'Stripe webhook is not configured.',
    })
  }

  const signature = getHeader(event, 'stripe-signature')
  const rawBody = await readRawBody(event, false)
  if (!signature || !rawBody) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing Stripe signature.',
    })
  }

  const stripe = useStripe()
  let stripeEvent
  try {
    stripeEvent = stripe.webhooks.constructEvent(rawBody, signature, stripeWebhookSecret)
  } catch (err) {
    console.error('[stripe/webhook] signature verification failed', err)
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid Stripe signature.',
    })
  }

  if (stripeEvent.type === 'payment_intent.succeeded') {
    const paymentIntent = stripeEvent.data.object
    try {
      const supabase = useSupabaseAdmin()
      await fulfillPaidOrder({ supabase, paymentIntent })
    } catch (err) {
      console.error('[stripe/webhook] could not record paid order', paymentIntent?.id, err)
      throw createError({
        statusCode: err.statusCode && err.statusCode < 500 ? 500 : (err.statusCode || 500),
        statusMessage: err.statusMessage || 'Could not record the paid order.',
      })
    }
  }

  return { received: true }
})
