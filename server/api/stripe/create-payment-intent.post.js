import {
  CartMetadataError,
  assertCheckoutContact,
  buildPaymentIntentMetadata,
  normalizeCheckoutContact,
} from '#shared/checkoutMetadata.js'
import { resolveRetailCheckoutOrder } from '../../utils/retailOrderPricing.js'
import { useStripe } from '../../utils/stripeClient.js'

// Amount is merchandise subtotal from public.clownfish / public.bonded_pairs + server-side shipping.
// Client-sent price_cents is ignored. Pass paymentIntentId to attach contact details before confirm.

function httpError(statusCode, statusMessage) {
  return createError({ statusCode, statusMessage, message: statusMessage })
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  let order
  try {
    order = await resolveRetailCheckoutOrder(body?.items)
  } catch (error) {
    if (error?.name === 'CartMetadataError') {
      throw httpError(400, error.message)
    }
    throw error
  }

  if (order.totalCents < 50) {
    throw httpError(400, 'Order total must be at least $0.50.')
  }

  const contact = normalizeCheckoutContact(body)
  if (body?.requireContact) {
    const errors = assertCheckoutContact(contact)
    if (errors.length) throw httpError(400, errors[0])
  }

  let metadata
  try {
    metadata = buildPaymentIntentMetadata({
      items: body?.items,
      customerEmail: contact.customerEmail,
      customerName: contact.customerName,
      shippingAddress: contact.shippingAddress,
      merchandiseSubtotalCents: order.merchandiseSubtotalCents,
      shippingCents: order.shippingCents,
    })
  } catch (error) {
    if (error instanceof CartMetadataError || error?.name === 'CartMetadataError') {
      throw httpError(400, error.message)
    }
    throw error
  }

  const country = String(contact.shippingAddress.country || 'US').trim().toUpperCase()
  const params = {
    amount: order.totalCents,
    currency: 'usd',
    automatic_payment_methods: { enabled: true },
    metadata: Object.fromEntries(
      Object.entries(metadata).filter(([, value]) => value !== '')
    ),
  }
  if (contact.customerEmail) params.receipt_email = contact.customerEmail
  if (contact.shippingAddress.line1 && contact.shippingAddress.city && contact.shippingAddress.postal_code) {
    params.shipping = {
      name: contact.customerName || contact.customerEmail || 'Blue Eyed Clowns customer',
      address: {
        line1: contact.shippingAddress.line1,
        line2: contact.shippingAddress.line2 || undefined,
        city: contact.shippingAddress.city,
        state: contact.shippingAddress.state || undefined,
        postal_code: contact.shippingAddress.postal_code,
        country: /^[A-Z]{2}$/.test(country) ? country : 'US',
      },
    }
  }

  const stripe = useStripe()

  try {
    const paymentIntent = body?.paymentIntentId
      ? await stripe.paymentIntents.update(body.paymentIntentId, {
          amount: params.amount,
          metadata,
          ...(params.receipt_email ? { receipt_email: params.receipt_email } : {}),
          ...(params.shipping ? { shipping: params.shipping } : {}),
        })
      : await stripe.paymentIntents.create(params)

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      merchandiseSubtotalCents: order.merchandiseSubtotalCents,
      shippingCents: order.shippingCents,
      totalCents: order.totalCents,
      lineItems: order.lineItems.map((row) => ({
        id: row.item_id,
        type: row.type,
        name: row.product_name,
        quantity: row.quantity,
        price_cents: row.price_cents,
      })),
    }
  } catch (err) {
    console.error('[stripe] create-payment-intent error', err)
    throw httpError(500, body?.paymentIntentId
      ? 'Could not update the payment session.'
      : 'Could not create payment session.')
  }
})
