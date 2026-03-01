<template>
  <section class="page">
    <div class="inner">
      <div v-if="status === 'loading'" class="state">Completing your order…</div>
      <div v-else-if="status === 'error'" class="state error">
        <p>{{ errorMessage }}</p>
        <NuxtLink to="/cart" class="btn">Back to cart</NuxtLink>
      </div>
      <div v-else class="success-content">
        <h1>Thank you for your order</h1>
        <p class="lead">
          Your payment was successful. We've created a work order and will prepare your clownfish for
          shipping.
        </p>
        <p class="detail">You will receive an email confirmation at {{ customerEmail }}.</p>
        <NuxtLink to="/shop" class="btn btn-primary">Continue shopping</NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
const route = useRoute()
const status = ref('loading')
const errorMessage = ref('')
const customerEmail = ref('')

onMounted(async () => {
  const paymentIntentId = route.query.payment_intent
  const redirectStatus = route.query.redirect_status

  if (redirectStatus === 'succeeded' && paymentIntentId) {
    let pending
    try {
      const raw = sessionStorage.getItem('bec-checkout-pending')
      pending = raw ? JSON.parse(raw) : null
    } catch (e) {
      pending = null
    }

    if (pending) {
      try {
        await $fetch('/api/orders/complete', {
          method: 'POST',
          body: {
            paymentIntentId,
            customerEmail: pending.customerEmail,
            customerName: pending.customerName,
            shippingAddress: pending.shippingAddress,
            items: pending.items
          }
        })
        customerEmail.value = pending.customerEmail
        sessionStorage.removeItem('bec-checkout-pending')
        const cart = useCart()
        cart.clearCart()
        status.value = 'ok'
      } catch (e) {
        console.error('[checkout/success] complete order', e)
        errorMessage.value = e?.data?.message || 'Could not finalize order. Contact us with your payment details.'
        status.value = 'error'
      }
    } else {
      status.value = 'ok'
      customerEmail.value = ''
    }
  } else if (paymentIntentId && redirectStatus !== 'succeeded') {
    errorMessage.value = 'Payment was not completed. You were not charged.'
    status.value = 'error'
  } else {
    status.value = 'ok'
    customerEmail.value = ''
  }
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

.state.error .btn {
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

.detail {
  font-size: 0.95rem;
  color: #94a3b8;
  margin-bottom: 1.5rem;
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
