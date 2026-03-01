import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  if (!config.stripeSecretKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Server is not configured: add NUXT_STRIPE_SECRET_KEY to your .env'
    })
  }
  if (!config.supabaseServiceRoleKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Server is not configured: add NUXT_SUPABASE_SERVICE_ROLE_KEY to your .env (Project Settings → API → service_role in Supabase)'
    })
  }
  if (!config.supabaseUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Server is not configured: add NUXT_SUPABASE_URL to your .env'
    })
  }

  const body = await readBody(event)
  const {
    paymentIntentId,
    customerEmail,
    customerName,
    shippingAddress,
    items
  } = body || {}

  if (!paymentIntentId || !customerEmail || !Array.isArray(items) || items.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing paymentIntentId, customerEmail, or items.'
    })
  }

  const stripe = new Stripe(config.stripeSecretKey, {
    apiVersion: '2024-12-18.acacia'
  })

  let paymentIntent
  try {
    paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
  } catch (err) {
    console.error('[orders/complete] Stripe retrieve error', err)
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid payment.'
    })
  }

  if (paymentIntent.status !== 'succeeded') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Payment has not succeeded. Current status: ' + paymentIntent.status
    })
  }

  const address = shippingAddress || {}
  let totalCents = 0
  const lineItems = items.map((i) => {
    const q = Math.max(1, parseInt(i.quantity, 10) || 1)
    const cents = Math.max(0, parseInt(i.price_cents, 10) || 0)
    totalCents += q * cents
    return {
      clownfish_id: i.id || null,
      product_name: i.name || 'Clownfish',
      quantity: q,
      price_cents: cents
    }
  })

  const supabase = createClient(
    config.supabaseUrl,
    config.supabaseServiceRoleKey
  )

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      stripe_payment_intent_id: paymentIntentId,
      customer_email: customerEmail,
      customer_name: customerName || null,
      shipping_address_line1: address.line1 || null,
      shipping_address_line2: address.line2 || null,
      shipping_city: address.city || null,
      shipping_state: address.state || null,
      shipping_postal_code: address.postal_code || null,
      shipping_country: address.country || 'US',
      total_cents: totalCents,
      status: 'paid',
      updated_at: new Date().toISOString()
    })
    .select('id')
    .single()

  if (orderError) {
    console.error('[orders/complete] Supabase orders insert error', orderError)
    throw createError({
      statusCode: 500,
      statusMessage: 'Could not save order.'
    })
  }

  const orderId = order.id

  const orderRows = lineItems.map((row) => ({
    order_id: orderId,
    clownfish_id: row.clownfish_id,
    product_name: row.product_name,
    quantity: row.quantity,
    price_cents: row.price_cents
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(orderRows)

  if (itemsError) {
    console.error('[orders/complete] Supabase order_items insert error', itemsError)
    throw createError({
      statusCode: 500,
      statusMessage: 'Could not save order items.'
    })
  }

  const now = new Date()
  const workOrderNumber =
    'WO-' +
    now.getFullYear() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') +
    '-' +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0') +
    String(now.getSeconds()).padStart(2, '0') +
    '-' +
    orderId.slice(0, 8)

  const workOrderPayload = {
    work_order_number: workOrderNumber,
    order_id: orderId,
    customer_name: customerName || null,
    customer_email: customerEmail,
    shipping_address_line1: address.line1 || null,
    shipping_address_line2: address.line2 || null,
    shipping_city: address.city || null,
    shipping_state: address.state || null,
    shipping_postal_code: address.postal_code || null,
    shipping_country: address.country || 'US',
    line_items: lineItems.map((row) => ({
      product_name: row.product_name,
      quantity: row.quantity,
      price_cents: row.price_cents
    })),
    total_cents: totalCents,
    status: 'pending',
    notes: `Fulfill and ship. ${lineItems.length} line(s).`,
    updated_at: now.toISOString()
  }

  const { error: workOrderError } = await supabase.from('work_orders').insert(workOrderPayload)

  if (workOrderError) {
    console.error('[orders/complete] Supabase work_orders insert error', workOrderError)
    throw createError({
      statusCode: 500,
      statusMessage: 'Order saved but work order failed. Contact support with order ID: ' + orderId
    })
  }

  return {
    orderId,
    workOrderNumber,
    message: 'Order and work order created.'
  }
})
