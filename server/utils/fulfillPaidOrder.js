import { resolvePaidOrderInput } from '#shared/checkoutMetadata.js'
import { isValidEmail, normalizeEmail } from '#shared/publicForms.js'
import {
  SHOP_NOTIFY_EMAIL,
  buildOrderConfirmation,
  buildShopOrderNotice,
  publicOrderNumber,
} from '#shared/orderEmail.js'
import {
  resolveRetailCheckoutOrder,
  shippingWorkOrderNote,
} from './retailOrderPricing.js'
import { upsertCustomer } from './customers.js'
import { getMailSettings, sendEmail } from './mailer.js'

function httpError(statusCode, statusMessage) {
  return createError({ statusCode, statusMessage, message: statusMessage })
}

function addressColumns(address) {
  const source = address || {}
  return {
    shipping_address_line1: source.line1 || null,
    shipping_address_line2: source.line2 || null,
    shipping_city: source.city || null,
    shipping_state: source.state || null,
    shipping_postal_code: source.postal_code || null,
    shipping_country: source.country || 'US',
  }
}

function workOrderNumberFor(orderId, now = new Date()) {
  return [
    'WO',
    `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`,
    `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`,
    String(orderId).slice(0, 8),
  ].join('-')
}

async function findOrder(supabase, paymentIntentId) {
  const { data, error } = await supabase
    .from('orders')
    .select('id, stripe_payment_intent_id, customer_email, customer_name, customer_id, shipping_address_line1, shipping_address_line2, shipping_city, shipping_state, shipping_postal_code, shipping_country, total_cents, confirmation_sent_at')
    .eq('stripe_payment_intent_id', paymentIntentId)
    .maybeSingle()
  if (error) throw error
  return data
}

async function loadOrderItems(supabase, orderId) {
  const { data, error } = await supabase
    .from('order_items')
    .select('product_name, quantity, price_cents')
    .eq('order_id', orderId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data || []
}

async function loadWorkOrder(supabase, orderId) {
  const { data, error } = await supabase
    .from('work_orders')
    .select('work_order_number')
    .eq('order_id', orderId)
    .maybeSingle()
  if (error) throw error
  return data
}

async function markPairsSold(supabase, items) {
  const pairIds = [...new Set(
    (items || [])
      .filter((row) => (row.type === 'bonded_pair' || row.itemType === 'bonded_pair') && (row.item_id || row.id))
      .map((row) => row.item_id || row.id)
  )]
  if (pairIds.length === 0) return

  const { error } = await supabase
    .from('bonded_pairs')
    .update({ status: 'sold' })
    .in('id', pairIds)

  if (error) {
    console.error('[orders] bonded_pairs sold update error', error)
    throw httpError(500, 'Order saved but pair availability could not be updated.')
  }
}

async function ensureOrderItems(supabase, orderId, lineItems) {
  const payload = lineItems.map((row) => ({
    clownfish_id: row.clownfish_id || null,
    product_name: row.product_name,
    quantity: row.quantity,
    price_cents: row.price_cents,
  }))

  const { error } = await supabase.rpc('insert_order_items_if_absent', {
    p_order_id: orderId,
    p_items: payload,
  })

  if (error) {
    console.error('[orders] order_items insert error', error)
    throw httpError(500, 'Could not save order items.')
  }
}

async function ensureWorkOrder(supabase, { orderId, customerName, customerEmail, address, lineItems, totalCents, shippingCents }) {
  const existing = await loadWorkOrder(supabase, orderId)
  if (existing) return existing

  const now = new Date()
  const payload = {
    work_order_number: workOrderNumberFor(orderId, now),
    order_id: orderId,
    customer_name: customerName || null,
    customer_email: customerEmail,
    ...addressColumns(address),
    line_items: lineItems.map((row) => ({
      product_name: row.product_name,
      quantity: row.quantity,
      price_cents: row.price_cents,
    })),
    total_cents: totalCents,
    status: 'pending',
    notes: shippingWorkOrderNote({
      shippingCents,
      lineItems,
    }),
    updated_at: now.toISOString(),
  }

  const { data, error } = await supabase
    .from('work_orders')
    .insert(payload)
    .select('work_order_number')
    .single()

  if (error?.code === '23505') {
    return loadWorkOrder(supabase, orderId)
  }
  if (error) {
    console.error('[orders] work_orders insert error', error)
    throw httpError(500, 'Order saved but work order failed. Contact support with your payment receipt.')
  }
  return data
}

function summaryFromParts({ order, items, workOrderNumber, merchandiseSubtotalCents, shippingCents, alreadyRecorded }) {
  return {
    orderId: order.id,
    orderNumber: publicOrderNumber(order.id),
    workOrderNumber: workOrderNumber || null,
    customerEmail: order.customer_email,
    customerName: order.customer_name,
    shippingAddress: {
      line1: order.shipping_address_line1,
      line2: order.shipping_address_line2,
      city: order.shipping_city,
      state: order.shipping_state,
      postal_code: order.shipping_postal_code,
      country: order.shipping_country || 'US',
    },
    items: items.map((row) => ({
      product_name: row.product_name,
      quantity: row.quantity,
      price_cents: row.price_cents,
    })),
    merchandiseSubtotalCents,
    shippingCents,
    totalCents: order.total_cents,
    alreadyRecorded: Boolean(alreadyRecorded),
  }
}

async function linkCustomer(supabase, order, customerId) {
  if (!customerId || order.customer_id) return order
  const { data, error } = await supabase
    .from('orders')
    .update({ customer_id: customerId, updated_at: new Date().toISOString() })
    .eq('id', order.id)
    .is('customer_id', null)
    .select('customer_id')
    .maybeSingle()
  if (error) {
    console.error('[orders] customer link failed', error)
    return order
  }
  if (data?.customer_id) order.customer_id = data.customer_id
  return order
}

async function rememberCustomer(supabase, order) {
  try {
    const customerId = await upsertCustomer(supabase, {
      email: order.customer_email,
      name: order.customer_name,
      source: 'website',
    })
    return linkCustomer(supabase, order, customerId)
  } catch (error) {
    console.error('[orders] customer upsert failed', error)
    return order
  }
}

async function sendOrderEmails(supabase, summary) {
  const { resendApiKey } = getMailSettings()
  if (!resendApiKey) {
    console.warn('[email] RESEND_API_KEY is not set; skipping order confirmation for', summary.orderNumber)
    return
  }

  const claimedAt = new Date().toISOString()
  const { data: claimed, error: claimError } = await supabase
    .from('orders')
    .update({ confirmation_sent_at: claimedAt })
    .eq('id', summary.orderId)
    .is('confirmation_sent_at', null)
    .select('id')
    .maybeSingle()

  if (claimError) {
    console.error('[email] could not claim order confirmation', claimError)
    return
  }
  if (!claimed) return

  const confirmation = buildOrderConfirmation(summary)
  const shopNotice = buildShopOrderNotice(summary)
  let buyerSent = false
  try {
    await sendEmail({
      to: summary.customerEmail,
      subject: confirmation.subject,
      html: confirmation.html,
      text: confirmation.text,
      replyTo: SHOP_NOTIFY_EMAIL,
    })
    buyerSent = true
    await sendEmail({
      to: SHOP_NOTIFY_EMAIL,
      subject: shopNotice.subject,
      html: shopNotice.html,
      text: shopNotice.text,
      replyTo: summary.customerEmail,
    })
  } catch (error) {
    console.error('[email] order confirmation failed', error)
    if (!buyerSent) {
      await supabase
        .from('orders')
        .update({ confirmation_sent_at: null })
        .eq('id', summary.orderId)
        .eq('confirmation_sent_at', claimedAt)
    }
  }
}

async function insertOrder(supabase, { paymentIntentId, customerEmail, customerName, address, totalCents, customerId }) {
  const { data, error } = await supabase
    .from('orders')
    .insert({
      stripe_payment_intent_id: paymentIntentId,
      customer_email: customerEmail,
      customer_name: customerName || null,
      ...addressColumns(address),
      total_cents: totalCents,
      status: 'paid',
      customer_id: customerId,
      updated_at: new Date().toISOString(),
    })
    .select('id, stripe_payment_intent_id, customer_email, customer_name, customer_id, shipping_address_line1, shipping_address_line2, shipping_city, shipping_state, shipping_postal_code, shipping_country, total_cents, confirmation_sent_at')
    .single()

  if (error?.code === '23505') return { order: null, duplicate: true }
  if (error) {
    console.error('[orders] insert error', error)
    throw httpError(500, 'Could not save order.')
  }
  return { order: data, duplicate: false }
}

export async function fulfillPaidOrder({ supabase, paymentIntent, fallback }) {
  if (!paymentIntent?.id) {
    throw httpError(400, 'Missing payment.')
  }
  if (paymentIntent.status !== 'succeeded') {
    throw httpError(400, `Payment has not succeeded. Current status: ${paymentIntent.status}`)
  }

  const input = resolvePaidOrderInput({
    metadata: paymentIntent.metadata,
    receiptEmail: paymentIntent.receipt_email,
    shipping: paymentIntent.shipping,
    fallback,
  })

  const existing = await findOrder(supabase, paymentIntent.id)
  if (existing) {
    const items = await loadOrderItems(supabase, existing.id)
    if (items.length > 0) {
      const merchandiseSubtotalCents = items.reduce(
        (sum, row) => sum + (row.price_cents * row.quantity),
        0
      )
      const shippingCents = Math.max(0, existing.total_cents - merchandiseSubtotalCents)
      const workOrder = await ensureWorkOrder(supabase, {
        orderId: existing.id,
        customerName: existing.customer_name,
        customerEmail: existing.customer_email,
        address: {
          line1: existing.shipping_address_line1,
          line2: existing.shipping_address_line2,
          city: existing.shipping_city,
          state: existing.shipping_state,
          postal_code: existing.shipping_postal_code,
          country: existing.shipping_country,
        },
        lineItems: items,
        totalCents: existing.total_cents,
        shippingCents,
      })
      await markPairsSold(supabase, input.items)
      await rememberCustomer(supabase, existing)
      const summary = summaryFromParts({
        order: existing,
        items,
        workOrderNumber: workOrder?.work_order_number,
        merchandiseSubtotalCents,
        shippingCents,
        alreadyRecorded: true,
      })
      await sendOrderEmails(supabase, summary)
      return summary
    }
  }

  const customerEmail = normalizeEmail(input.customerEmail)
  if (!isValidEmail(customerEmail) || !Array.isArray(input.items) || input.items.length === 0) {
    throw httpError(400, 'Payment is missing the email or cart needed to record the order.')
  }

  const orderTotals = await resolveRetailCheckoutOrder(input.items)
  if (paymentIntent.amount !== orderTotals.totalCents) {
    throw httpError(400, 'Payment amount does not match the current order total.')
  }

  let customerId = null
  try {
    customerId = await upsertCustomer(supabase, {
      email: customerEmail,
      name: input.customerName,
      source: 'website',
    })
  } catch (error) {
    console.error('[orders] customer upsert failed before insert', error)
  }

  let order = existing
  if (!order) {
    const inserted = await insertOrder(supabase, {
      paymentIntentId: paymentIntent.id,
      customerEmail,
      customerName: input.customerName,
      address: input.shippingAddress,
      totalCents: orderTotals.totalCents,
      customerId,
    })
    order = inserted.duplicate ? await findOrder(supabase, paymentIntent.id) : inserted.order
  }

  if (!order) {
    throw httpError(500, 'Could not save order.')
  }

  await ensureOrderItems(supabase, order.id, orderTotals.lineItems)
  await markPairsSold(supabase, orderTotals.lineItems)
  const workOrder = await ensureWorkOrder(supabase, {
    orderId: order.id,
    customerName: input.customerName,
    customerEmail,
    address: input.shippingAddress,
    lineItems: orderTotals.lineItems,
    totalCents: orderTotals.totalCents,
    shippingCents: orderTotals.shippingCents,
  })

  if (customerId && !order.customer_id) {
    await linkCustomer(supabase, order, customerId)
  }

  const storedItems = await loadOrderItems(supabase, order.id)
  const summary = summaryFromParts({
    order,
    items: storedItems.length ? storedItems : orderTotals.lineItems,
    workOrderNumber: workOrder?.work_order_number,
    merchandiseSubtotalCents: orderTotals.merchandiseSubtotalCents,
    shippingCents: orderTotals.shippingCents,
    alreadyRecorded: false,
  })
  await sendOrderEmails(supabase, summary)
  return summary
}
