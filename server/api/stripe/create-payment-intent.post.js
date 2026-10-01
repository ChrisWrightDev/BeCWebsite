import Stripe from 'stripe'
import { resolveRetailCheckoutOrder } from '../../utils/retailOrderPricing.js'

// Amount is merchandise subtotal from public.clownfish.price_cents + server-side shipping.
// Client-sent price_cents is ignored.

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
  const order = await resolveRetailCheckoutOrder(items)

  if (order.totalCents < 50) {
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
      amount: order.totalCents,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: {
        merchandise_subtotal_cents: String(order.merchandiseSubtotalCents),
        shipping_cents: String(order.shippingCents),
      },
    })

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      merchandiseSubtotalCents: order.merchandiseSubtotalCents,
      shippingCents: order.shippingCents,
      totalCents: order.totalCents,
      lineItems: order.lineItems.map((row) => ({
        id: row.clownfish_id,
        name: row.product_name,
        quantity: row.quantity,
        price_cents: row.price_cents,
      })),
    }
  } catch (err) {
    console.error('[stripe] create-payment-intent error', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Could not create payment session.'
    })
  }
})
