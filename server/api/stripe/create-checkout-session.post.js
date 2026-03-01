import Stripe from 'stripe'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  if (!config.stripeSecretKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Stripe secret key is not configured on the server.'
    })
  }

  const stripe = new Stripe(config.stripeSecretKey, {
    apiVersion: '2024-12-18.acacia' // Use latest stable API version from your Stripe dashboard
  })

  const body = await readBody(event)

  // For now we ignore the incoming body and always sell a single clownfish.
  // Later, we can extend this to support different variants or quantities.
  const protocol = getRequestProtocol(event)
  const host = getRequestHeader(event, 'host')
  const baseUrl = `${protocol}://${host}`

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Captive-bred Clownfish',
              description: 'Healthy captive-bred clownfish from our aquaculture facility.'
            },
            unit_amount: 5000 // $50.00 in cents
          },
          quantity: 1
        }
      ],
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancelled`
    })

    return {
      id: session.id,
      url: session.url
    }
  } catch (error) {
    console.error('[stripe] error creating checkout session', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Unable to create checkout session.'
    })
  }
})

