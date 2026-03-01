<template>
  <section class="page">
    <div class="inner">
      <header class="header">
        <h1>Checkout</h1>
        <p>Complete your order with secure payment.</p>
      </header>

      <div v-if="cartEmpty && !mounted" class="state">Loading…</div>
      <div v-else-if="cartEmpty" class="state">
        Your cart is empty. <NuxtLink to="/shop">Shop clownfish</NuxtLink>.
      </div>

      <form v-else class="checkout-form" @submit.prevent="handleSubmit">
        <div class="two-col">
          <div class="panel">
            <h2>Contact & shipping</h2>
            <label>
              Email <span class="req">*</span>
              <input v-model="form.email" type="email" required placeholder="you@example.com" />
            </label>
            <label>
              Full name
              <input v-model="form.name" type="text" placeholder="Your name" />
            </label>
            <label>
              Address line 1 <span class="req">*</span>
              <input v-model="form.line1" type="text" required placeholder="Street address" />
            </label>
            <label>
              Address line 2
              <input v-model="form.line2" type="text" placeholder="Apt, suite, etc." />
            </label>
            <div class="row">
              <label>
                City <span class="req">*</span>
                <input v-model="form.city" type="text" required placeholder="City" />
              </label>
              <label>
                State
                <input v-model="form.state" type="text" placeholder="State" />
              </label>
              <label>
                ZIP <span class="req">*</span>
                <input v-model="form.postal_code" type="text" required placeholder="ZIP" />
              </label>
            </div>
            <label>
              Country
              <input v-model="form.country" type="text" placeholder="US" />
            </label>
          </div>

          <div class="panel">
            <h2>Payment</h2>
            <div ref="stripeMount" class="stripe-element"></div>
            <p v-if="stripeError" class="error-msg">{{ stripeError }}</p>

            <h3 class="summary-title">Order summary</h3>
            <ul class="summary-list">
              <li v-for="item in cartItems" :key="item.id" class="summary-row">
                <span>{{ item.name }} × {{ item.quantity }}</span>
                <span>{{ formatPrice(item.price_cents * item.quantity) }}</span>
              </li>
            </ul>
            <div class="summary-total">
              <span>Total</span>
              <span>{{ formatPrice(cartTotal) }}</span>
            </div>

            <button
              type="submit"
              class="btn-submit"
              :disabled="loading || !clientSecret"
            >
              {{ loading ? 'Processing…' : 'Place order' }}
            </button>
            <p v-if="submitError" class="error-msg">{{ submitError }}</p>
          </div>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
const cart = useCart()
const config = useRuntimeConfig()
const publishableKey = config.public.stripePublishableKey

const cartItems = computed(() => {
  const raw = cart.items
  return Array.isArray(raw) ? raw : (raw?.value ?? [])
})
const cartEmpty = computed(() => {
  const v = cart.isEmpty
  return v?.value ?? v ?? true
})
const cartTotal = computed(() => {
  const v = cart.totalCents
  return v?.value ?? v ?? 0
})

const stripeMount = ref(null)
const clientSecret = ref(null)
const loading = ref(false)
const mounted = ref(false)
const stripeError = ref('')
const submitError = ref('')

const form = reactive({
  email: '',
  name: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postal_code: '',
  country: 'US'
})

let stripe = null
let elements = null

function formatPrice(cents) {
  if (typeof cents !== 'number') return '$—'
  return `$${(cents / 100).toFixed(2)}`
}

onMounted(async () => {
  mounted.value = true
  if (cartEmpty.value) return

  try {
    const { clientSecret: secret } = await $fetch('/api/stripe/create-payment-intent', {
      method: 'POST',
      body: {
        items: cartItems.value.map((i) => ({
          id: i.id,
          name: i.name,
          price_cents: i.price_cents,
          quantity: i.quantity
        }))
      }
    })

    clientSecret.value = secret
    if (!secret || !stripeMount.value) return

    const { loadStripe } = await import('@stripe/stripe-js')
    stripe = await loadStripe(publishableKey)
    if (!stripe) {
      stripeError.value = 'Could not load payment form.'
      return
    }

    elements = stripe.elements({
      clientSecret: secret,
      appearance: { theme: 'night' }
    })
    const paymentElement = elements.create('payment', {
      layout: 'tabs'
    })
    paymentElement.mount(stripeMount.value)
  } catch (e) {
    console.error('[checkout] payment intent or Stripe load', e)
    stripeError.value = e?.data?.message || 'Could not load payment form.'
  }
})

async function handleSubmit() {
  if (!stripe || !elements || !clientSecret.value || loading.value) return

  loading.value = true
  submitError.value = ''

  const orderPayload = {
    customerEmail: form.email,
    customerName: form.name || null,
    shippingAddress: {
      line1: form.line1,
      line2: form.line2 || null,
      city: form.city,
      state: form.state || null,
      postal_code: form.postal_code,
      country: form.country || 'US'
    },
    items: cartItems.value.map((i) => ({
      id: i.id,
      name: i.name,
      price_cents: i.price_cents,
      quantity: i.quantity
    }))
  }

  try {
    sessionStorage.setItem('bec-checkout-pending', JSON.stringify(orderPayload))

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
        receipt_email: form.email || undefined,
        payment_method_data: {
          billing_details: {
            name: form.name || undefined,
            address: {
              line1: form.line1 || undefined,
              line2: form.line2 || undefined,
              city: form.city || undefined,
              state: form.state || undefined,
              postal_code: form.postal_code || undefined,
              country: form.country || 'US'
            }
          }
        }
      }
    })

    if (error) {
      submitError.value = error.message || 'Payment failed.'
      loading.value = false
      return
    }

    const paymentIntent = await stripe.retrievePaymentIntent(clientSecret.value)
    const pi = paymentIntent.paymentIntent
    if (pi?.status === 'succeeded') {
      await $fetch('/api/orders/complete', {
        method: 'POST',
        body: { paymentIntentId: pi.id, ...orderPayload }
      })
      sessionStorage.removeItem('bec-checkout-pending')
      cart.clearCart()
      await navigateTo('/checkout/success')
    }
  } catch (e) {
    console.error('[checkout] submit error', e)
    submitError.value = e?.data?.message || 'Could not complete order. Try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.page {
  padding: 3rem 1.5rem 4rem;
  background: radial-gradient(circle at top, rgba(15, 23, 42, 0.9), #020617 55%, #000 100%);
  color: #e5e7eb;
}

.inner {
  max-width: 900px;
  margin: 0 auto;
}

.header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.header p {
  color: #94a3b8;
  margin: 0;
}

.state {
  margin-top: 2rem;
  color: #94a3b8;
}

.state a {
  color: #7dd3fc;
}

.checkout-form {
  margin-top: 2rem;
}

.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.panel {
  padding: 1.5rem;
  border-radius: 1rem;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.25);
}

.panel h2 {
  font-size: 1.1rem;
  margin: 0 0 1rem;
}

.panel label {
  display: block;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
}

.panel label input {
  width: 100%;
  margin-top: 0.25rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(148, 163, 184, 0.5);
  background: rgba(2, 6, 23, 0.9);
  color: #e5e7eb;
  font-size: 0.95rem;
}

.panel .row {
  display: grid;
  grid-template-columns: 1fr 80px 100px;
  gap: 0.5rem;
}

.req {
  color: #f87171;
}

.stripe-element {
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 0.75rem;
  background: rgba(2, 6, 23, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.35);
}

.summary-title {
  font-size: 1rem;
  margin: 1rem 0 0.5rem;
}

.summary-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  margin-bottom: 0.35rem;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(148, 163, 184, 0.3);
}

.btn-submit {
  width: 100%;
  margin-top: 1rem;
  padding: 0.85rem 1.25rem;
  border: none;
  border-radius: 999px;
  background: linear-gradient(to right, #22d3ee, #0ea5e9);
  color: #0f172a;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
}

.btn-submit:hover:not(:disabled) {
  filter: brightness(1.05);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-msg {
  color: #fecaca;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

@media (max-width: 720px) {
  .two-col {
    grid-template-columns: 1fr;
  }

  .panel .row {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
</style>
