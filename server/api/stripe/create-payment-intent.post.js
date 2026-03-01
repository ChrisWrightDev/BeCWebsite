import Stripe from 'stripe'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  if (!config.stripeSecretKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Stripe is not configured.'
    })
  }

  const body = await readBody(event)
  const items = body?.items

  if (!Array.isArray(items) || items.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Request must include an array of items with price_cents and quantity.'
    })
  }

  let totalCents = 0
  for (const row of items) {
    const q = Math.max(1, parseInt(row.quantity, 10) || 1)
    const cents = Math.max(0, parseInt(row.price_cents, 10) || 0)
    totalCents += q * cents
  }

  if (totalCents < 50) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Order total must be at least $0.50.'
    })
  }

  const stripe = new Stripe(config.stripeSecretKey, {
    apiVersion: '2024-12-18.acacia'
  })

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCents,
      currency: 'usd',
      automatic_payment_methods: { enabled: true }
    })

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    }
  } catch (err) {
    console.error('[stripe] create-payment-intent error', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Could not create payment session.'
    })
  }
})
