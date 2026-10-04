<template>
  <section class="page">
    <div class="inner">
      <div v-if="status === 'loading'" class="state">Completing your order…</div>
      <div v-else-if="status === 'error'" class="state error">
        <p>{{ errorMessage }}</p>
        <NuxtLink to="/cart" class="btn">Back to cart</NuxtLink>
      </div>
      <div v-else-if="status === 'missing'" class="state">
        <p>We couldn't find a completed payment on this page.</p>
        <NuxtLink to="/shop" class="btn">Back to the shop</NuxtLink>
      </div>
      <div v-else class="success-content">
        <h1>Thank you for your order</h1>
        <p class="lead">
          Your payment was successful. We've created a work order and will prepare your clownfish for
          shipping.
        </p>
        <p v-if="order?.orderNumber" class="order-number">Order {{ order.orderNumber }}</p>
        <p class="detail">
          <template v-if="customerEmail">
            You'll receive an order confirmation email at {{ customerEmail }}.
          </template>
          <template v-else>
            You'll receive an order confirmation email shortly.
          </template>
          Shipping and tracking details will be sent when your order ships.
          Live animals ship Monday through Thursday via UPS or FedEx overnight.
        </p>

        <div v-if="order" class="receipt">
          <ul class="items">
            <li v-for="(item, index) in order.items" :key="`${item.product_name}-${index}`">
              <span>{{ item.product_name }} × {{ item.quantity }}</span>
              <span>{{ formatPrice(item.price_cents * item.quantity) }}</span>
            </li>
          </ul>
          <p><span>Merchandise</span><span>{{ formatPrice(order.merchandiseSubtotalCents) }}</span></p>
          <p>
            <span>Shipping</span>
            <span>{{ order.shippingCents === 0 ? 'Free' : formatPrice(order.shippingCents) }}</span>
          </p>
          <p class="total"><span>Total</span><span>{{ formatPrice(order.totalCents) }}</span></p>
          <p v-if="addressLines.length" class="address">
            Ships to<br />
            <span v-for="(line, index) in addressLines" :key="index">{{ line }}<br /></span>
          </p>
        </div>

        <NuxtLink to="/shop" class="btn btn-primary">Continue shopping</NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
useSiteSeo({
  title: 'Order Confirmed',
  noindex: true,
  nofollow: true,
})

const route = useRoute()
const paymentIntentFromRoute = typeof route.query.payment_intent === 'string'
  ? route.query.payment_intent
  : ''
const status = ref(paymentIntentFromRoute ? 'loading' : 'missing')
const errorMessage = ref('')
const customerEmail = ref('')
const order = ref(null)

const addressLines = computed(() => {
  const address = order.value?.shippingAddress
  if (!address) return []
  const cityLine = [address.city, address.state, address.postal_code].filter(Boolean).join(', ')
  return [address.line1, address.line2, cityLine, address.country].filter(Boolean)
})

function formatPrice(cents) {
  if (typeof cents !== 'number') return '$—'
  return `$${(cents / 100).toFixed(2)}`
}

function readPending() {
  try {
    const raw = sessionStorage.getItem('bec-checkout-pending')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

onMounted(async () => {
  const paymentIntentId = typeof route.query.payment_intent === 'string'
    ? route.query.payment_intent
    : ''
  const redirectStatus = typeof route.query.redirect_status === 'string'
    ? route.query.redirect_status
    : ''

  if (!paymentIntentId) {
    status.value = 'missing'
    return
  }

  if (redirectStatus && redirectStatus !== 'succeeded' && redirectStatus !== 'processing') {
    errorMessage.value = 'Payment was not completed. You were not charged.'
    status.value = 'error'
    return
  }

  const pending = readPending()
  const attempts = redirectStatus === 'processing' ? 4 : 1
  let lastError = null

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const result = await $fetch('/api/orders/complete', {
        method: 'POST',
        body: {
          paymentIntentId,
          customerEmail: pending?.customerEmail,
          customerName: pending?.customerName,
          shippingAddress: pending?.shippingAddress,
          items: pending?.items,
        },
      })
      order.value = result
      customerEmail.value = result.customerEmail || pending?.customerEmail || ''
      sessionStorage.removeItem('bec-checkout-pending')
      const cart = useCart()
      cart.clearCart()
      status.value = 'ok'
      return
    } catch (err) {
      lastError = err
      const message = err?.data?.statusMessage || err?.data?.message || ''
      if (attempt < attempts - 1 && /has not succeeded/i.test(message)) {
        await delay(1500)
        continue
      }
      break
    }
  }

  console.error('[checkout/success] complete order', lastError)
  errorMessage.value = lastError?.data?.statusMessage
    || lastError?.data?.message
    || 'Could not finalize order. Contact us with your payment details.'
  status.value = 'error'
})
</script>

<style scoped>
.page {
  padding: 4rem 1.5rem;
  background: radial-gradient(circle at top, rgba(15, 23, 42, 0.9), #020617 55%, #000 100%);
  color: #e5e7eb;
  min-height: 50vh;
}

.inner {
  max-width: 560px;
  margin: 0 auto;
  text-align: center;
}

.state {
  color: #94a3b8;
}

.state.error {
  color: #fecaca;
}

.state.error .btn,
.state .btn {
  margin-top: 1rem;
}

.success-content h1 {
  font-size: 1.75rem;
  margin-bottom: 1rem;
}

.lead {
  color: #cbd5e1;
  margin-bottom: 0.75rem;
}

.order-number {
  margin: 0 0 0.75rem;
  color: #e0f2fe;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.detail {
  font-size: 0.95rem;
  color: #94a3b8;
  margin-bottom: 1.5rem;
}

.receipt {
  margin: 0 auto 1.5rem;
  padding: 1rem 1.1rem;
  text-align: left;
  border-radius: 1rem;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.25);
}

.items,
.receipt p {
  margin: 0;
}

.items {
  list-style: none;
  padding: 0 0 0.5rem;
}

.items li,
.receipt p {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.92rem;
  margin-bottom: 0.35rem;
}

.total {
  padding-top: 0.45rem;
  border-top: 1px solid rgba(148, 163, 184, 0.3);
  font-weight: 700;
}

.address {
  display: block;
  margin-top: 0.8rem;
  color: #cbd5e1;
  line-height: 1.45;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 999px;
  font-weight: 600;
  text-decoration: none;
  color: #7dd3fc;
}

.btn-primary {
  background: linear-gradient(to right, #22d3ee, #0ea5e9);
  color: #0f172a;
}

.btn-primary:hover {
  filter: brightness(1.05);
}
</style>
