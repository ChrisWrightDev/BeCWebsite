import { useSupabaseAdmin } from '../../utils/supabaseAdmin.js'
import { useStripe } from '../../utils/stripeClient.js'
import { fulfillPaidOrder } from '../../utils/fulfillPaidOrder.js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const paymentIntentId = body?.paymentIntentId
  if (!paymentIntentId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing paymentIntentId.',
      message: 'Missing paymentIntentId.',
    })
  }

  const stripe = useStripe()
  let paymentIntent
  try {
    paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
  } catch (err) {
    console.error('[orders/complete] Stripe retrieve error', err)
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid payment.',
      message: 'Invalid payment.',
    })
  }

  const supabase = useSupabaseAdmin()
  const summary = await fulfillPaidOrder({
    supabase,
    paymentIntent,
    fallback: body,
  })

  return {
    ...summary,
    message: summary.alreadyRecorded
      ? 'Order already recorded.'
      : 'Order and work order created.',
  }
})
