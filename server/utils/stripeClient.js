import Stripe from 'stripe'

const STRIPE_API_VERSION = '2024-12-18.acacia'

export function useStripe() {
  const config = useRuntimeConfig()
  if (!config.stripeSecretKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Stripe is not configured.',
    })
  }
  return new Stripe(config.stripeSecretKey, {
    apiVersion: STRIPE_API_VERSION,
  })
}
