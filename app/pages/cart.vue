<template>
  <section class="page">
    <div class="inner">
      <header class="header">
        <h1>Your cart</h1>
        <p v-if="!cartEmpty">
          {{ cartCount }} {{ cartCount === 1 ? 'item' : 'items' }} in your cart.
        </p>
      </header>

      <div v-if="cartEmpty" class="empty">
        <p>Your cart is empty.</p>
        <NuxtLink to="/shop" class="btn btn-primary">Shop clownfish</NuxtLink>
      </div>

      <div v-else class="cart-layout">
        <ul class="cart-list">
          <li v-for="item in cartItems" :key="item.id" class="cart-item">
            <div
              class="item-image"
              :style="item.image_url ? { backgroundImage: `url(${item.image_url})` } : null"
            >
              <span v-if="!item.image_url" class="img-placeholder">—</span>
            </div>
            <div class="item-details">
              <h2>{{ item.name }}</h2>
              <p class="item-price">{{ formatPrice(item.price_cents) }} each</p>
            </div>
            <div class="item-qty">
              <button
                type="button"
                class="qty-btn"
                aria-label="Decrease quantity"
                @click="cart.updateQuantity(item.id, item.quantity - 1)"
              >
                −
              </button>
              <span class="qty-value">{{ item.quantity }}</span>
              <button
                type="button"
                class="qty-btn"
                aria-label="Increase quantity"
                @click="cart.updateQuantity(item.id, item.quantity + 1)"
              >
                +
              </button>
            </div>
            <p class="item-line-total">{{ formatPrice(item.price_cents * item.quantity) }}</p>
            <button
              type="button"
              class="remove-btn"
              aria-label="Remove from cart"
              @click="cart.removeItem(item.id)"
            >
              Remove
            </button>
          </li>
        </ul>

        <aside class="cart-summary">
          <div class="summary-row">
            <span>Subtotal ({{ cartCount }} items)</span>
            <span>{{ formatPrice(cartTotal) }}</span>
          </div>
          <NuxtLink to="/checkout" class="btn btn-checkout">Proceed to checkout</NuxtLink>
          <NuxtLink to="/shop" class="btn btn-ghost">Continue shopping</NuxtLink>
        </aside>
      </div>
    </div>
  </section>
</template>

<script setup>
const cart = useCart()

const cartItems = computed(() => {
  const raw = cart.items
  if (Array.isArray(raw)) return raw
  return raw?.value ?? []
})

const cartEmpty = computed(() => {
  const v = cart.isEmpty
  return v?.value ?? v ?? true
})

const cartCount = computed(() => {
  const v = cart.itemCount
  return v?.value ?? v ?? 0
})

const cartTotal = computed(() => {
  const v = cart.totalCents
  return v?.value ?? v ?? 0
})

function formatPrice(cents) {
  if (typeof cents !== 'number') return '$—'
  return `$${(cents / 100).toFixed(2)}`
}
</script>

<style scoped>
.page {
  padding: 3rem 1.5rem 4rem;
  background: radial-gradient(circle at top, rgba(15, 23, 42, 0.9), #020617 55%, #000 100%);
  color: #e5e7eb;
}

.inner {
  max-width: 960px;
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

.empty {
  margin-top: 2rem;
  text-align: center;
  padding: 3rem 1rem;
}

.empty p {
  margin-bottom: 1rem;
}

.cart-layout {
  margin-top: 2rem;
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 2rem;
  align-items: start;
}

.cart-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.cart-item {
  display: grid;
  grid-template-columns: 80px 1fr auto auto auto auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.25);
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: 0.75rem;
  background: rgba(15, 23, 42, 0.9);
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 1.5rem;
}

.item-details h2 {
  font-size: 1rem;
  margin: 0 0 0.25rem;
}

.item-price {
  font-size: 0.875rem;
  color: #94a3b8;
  margin: 0;
}

.item-qty {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.qty-btn {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(148, 163, 184, 0.5);
  background: rgba(15, 23, 42, 0.8);
  color: #e5e7eb;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qty-btn:hover {
  border-color: #7dd3fc;
  color: #7dd3fc;
}

.qty-value {
  min-width: 1.5rem;
  text-align: center;
  font-weight: 600;
}

.item-line-total {
  font-weight: 600;
  color: #7dd3fc;
  margin: 0;
}

.remove-btn {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 0.85rem;
  cursor: pointer;
  text-decoration: underline;
}

.remove-btn:hover {
  color: #f87171;
}

.cart-summary {
  padding: 1.5rem;
  border-radius: 1rem;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.3);
  position: sticky;
  top: 6rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.25rem;
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  border: 1px solid transparent;
  cursor: pointer;
  width: 100%;
  margin-bottom: 0.5rem;
}

.btn-checkout {
  background: linear-gradient(to right, #22d3ee, #0ea5e9);
  color: #0f172a;
  margin-top: 0.5rem;
}

.btn-checkout:hover {
  filter: brightness(1.05);
}

.btn-ghost {
  background: transparent;
  color: #94a3b8;
  border-color: rgba(148, 163, 184, 0.5);
}

.btn-ghost:hover {
  border-color: #7dd3fc;
  color: #7dd3fc;
}

.btn-primary {
  background: linear-gradient(to right, #22d3ee, #0ea5e9);
  color: #0f172a;
  width: auto;
}

@media (max-width: 768px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }

  .cart-item {
    grid-template-columns: 60px 1fr;
    grid-template-rows: auto auto auto;
    gap: 0.5rem;
  }

  .item-qty {
    grid-column: 2;
  }

  .item-line-total {
    grid-column: 2;
  }

  .remove-btn {
    grid-column: 2;
  }

  .item-image {
    width: 60px;
    height: 60px;
  }

  .cart-summary {
    position: static;
  }
}
</style>
