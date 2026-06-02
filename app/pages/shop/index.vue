<template>
  <section class="page">
    <div class="inner">
      <header class="header">
        <p class="eyebrow">Captive-bred clownfish for sale</p>
        <h1>Tank-raised clownfish</h1>
        <p>
          Browse current availability, compare beginner-friendly and premium designer morphs, and
          choose a feeding-ready clownfish for your reef.
        </p>
      </header>

      <section class="chooser" aria-label="Shopping help and guarantees">
        <div>
          <strong>Need help choosing?</strong>
          <span>Start with hardy Ocellaris or compare designer morphs before you add to cart.</span>
        </div>
        <NuxtLink to="/guides/clownfish-morphs">Read the morph guide</NuxtLink>
      </section>

      <div class="reassurance-strip" aria-label="Purchase reassurance">
        <span>30-day health guarantee</span>
        <span>Overnight live-fish shipping</span>
        <span>Ships Monday–Wednesday</span>
        <span>Captive-bred and feeding well</span>
      </div>

      <div v-if="pending" class="state state-panel">
        <img src="/images/shop-empty.svg" alt="" class="state-illustration" width="240" height="180" />
        <p>Loading clownfish from the hatchery…</p>
      </div>
      <div v-else-if="fetchError" class="state state-panel error">
        <img src="/images/shop-empty.svg" alt="" class="state-illustration" width="240" height="180" />
        <p>There was a problem loading clownfish. Please try again shortly.</p>
        <button type="button" class="btn-retry" @click="refresh()">Try again</button>
      </div>
      <div v-else-if="!clownfish?.length" class="state state-panel">
        <img src="/images/shop-empty.svg" alt="" class="state-illustration" width="240" height="180" />
        <p>No clownfish are available right now.</p>
        <p class="state-sub">Get notified when new batches are listed.</p>
        <form class="restock-form" @submit.prevent="handleRestockSubmit">
          <label class="sr-only" for="restock-email">Email for restock alerts</label>
          <input
            id="restock-email"
            v-model="restockEmail"
            type="email"
            name="restock-email"
            autocomplete="email"
            placeholder="you@example.com"
            required
          />
          <button type="submit" class="btn-restock">Notify me</button>
        </form>
        <p v-if="restockSubmitted" class="restock-success" role="status">
          Thanks! We'll email you when new clownfish are listed.
        </p>
      </div>

      <div v-else class="grid">
        <article v-for="fish in clownfish" :key="fish.id" class="card">
          <div class="badge">
            {{ clownfishCategory(fish) }}
          </div>

          <NuxtLink :to="`/shop/${fish.slug}`" class="image-link">
            <img
              v-if="fish.image_url"
              :src="fish.image_url"
              :alt="clownfishImageAlt(fish)"
              class="image"
              width="320"
              height="150"
              loading="lazy"
              decoding="async"
            />
            <div v-else class="image image-placeholder">
              <span class="placeholder">Clownfish preview</span>
            </div>
          </NuxtLink>

          <h2>
            <NuxtLink :to="`/shop/${fish.slug}`" class="product-link">{{ fish.name }}</NuxtLink>
          </h2>
          <p class="best-for">{{ clownfishBestFor(fish) }}</p>
          <p class="description">
            {{ compactDescription(fish) }}
          </p>

          <div class="meta">
            <span class="price">{{ formatPriceCents(fish.price_cents) }}</span>
            <span class="stock" :class="{ 'stock-out': !fish.in_stock }">
              {{ fish.in_stock ? 'In stock' : 'Temporarily unavailable' }}
            </span>
          </div>

          <div class="card-actions">
            <NuxtLink :to="`/shop/${fish.slug}`" class="btn btn-secondary">View details</NuxtLink>
            <button
              class="btn"
              type="button"
              :disabled="!fish.in_stock"
              @click="addToCart(fish)"
            >
              Add to cart
            </button>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import {
  clownfishBestFor,
  clownfishCategory,
  clownfishImageAlt,
  compactDescription,
  formatPriceCents,
} from '~/utils/clownfish'

const config = useRuntimeConfig()
const siteUrl = (config.public.siteUrl || 'https://www.blueeyedclowns.com').replace(/\/$/, '')

useSiteSeo({
  title: 'Shop Tank-Bred Clownfish',
  description:
    'Browse captive-bred clownfish — ocellaris, snowflake, black ice & more. In-stock updates weekly.',
})

const { data: clownfish, pending, error: fetchError, refresh } = await useAsyncData('shop-clownfish', () =>
  $fetch('/api/shop/clownfish')
)

if (clownfish.value?.length) {
  useJsonLd([
    buildItemListSchema(clownfish.value, siteUrl),
    ...clownfish.value.map((fish) => buildProductSchema(fish, siteUrl)),
  ])
}

const restockEmail = ref('')
const restockSubmitted = ref(false)
const cart = useCart()
const cartToast = useCartToast()

function addToCart(fish) {
  cart.addItem(fish, 1)
  cartToast.show(fish.name)
}

function handleRestockSubmit() {
  const email = restockEmail.value.trim()
  if (!email) return
  const subject = encodeURIComponent('Restock alert signup')
  const body = encodeURIComponent(`Please notify me when new clownfish are listed.\n\nEmail: ${email}`)
  window.location.href = `mailto:support@blueeyedclowns.com?subject=${subject}&body=${body}`
  restockSubmitted.value = true
}
</script>

<style scoped>
.page {
  padding: 3.5rem 1.5rem 4.5rem;
  background: radial-gradient(circle at top, rgba(15, 23, 42, 0.9), #020617 55%, #000 100%);
  color: #e5e7eb;
}

.inner {
  max-width: 1120px;
  margin: 0 auto;
}

.header h1 {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.eyebrow {
  margin: 0 0 0.45rem;
  color: #7dd3fc;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.header p {
  color: #cbd5f5;
  max-width: 40rem;
}

.chooser,
.reassurance-strip {
  margin-top: 1.25rem;
  border: 1px solid rgba(125, 211, 252, 0.22);
  border-radius: 1rem;
  background: rgba(15, 23, 42, 0.68);
}

.chooser {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.2rem;
}

.chooser div {
  display: grid;
  gap: 0.25rem;
}

.chooser strong {
  color: #e0f2fe;
}

.chooser span {
  color: #cbd5e1;
  font-size: 0.95rem;
}

.chooser a {
  color: #7dd3fc;
  font-weight: 700;
  white-space: nowrap;
  text-decoration: none;
}

.reassurance-strip {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.5rem;
  padding: 0.75rem;
}

.reassurance-strip span {
  border-radius: 0.75rem;
  padding: 0.65rem 0.75rem;
  background: rgba(8, 47, 73, 0.42);
  color: #dbeafe;
  font-size: 0.88rem;
  text-align: center;
}

.state {
  margin-top: 2.5rem;
  color: #cbd5f5;
}

.state-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 1.5rem;
  border-radius: 1.25rem;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(148, 163, 184, 0.25);
  max-width: 28rem;
  margin-left: auto;
  margin-right: auto;
}

.state-illustration {
  margin-bottom: 1.25rem;
  opacity: 0.85;
}

.state-sub {
  font-size: 0.9rem;
  color: #94a3b8;
  margin: 0.35rem 0 1rem;
}

.state.error {
  color: #fecaca;
}

.restock-form {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  width: 100%;
  max-width: 20rem;
}

.restock-form input {
  flex: 1;
  min-width: 10rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(148, 163, 184, 0.5);
  background: rgba(15, 23, 42, 0.9);
  color: #e5e7eb;
  padding: 0.55rem 0.75rem;
  font-size: 0.9rem;
}

.restock-form input:focus-visible {
  outline: 2px solid #22d3ee;
  outline-offset: 2px;
}

.btn-restock,
.btn-retry {
  border: none;
  border-radius: 999px;
  padding: 0.55rem 1rem;
  background: linear-gradient(to right, #22d3ee, #0ea5e9);
  color: #0f172a;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
}

.btn-retry {
  margin-top: 0.75rem;
}

.restock-success {
  margin: 0.75rem 0 0;
  font-size: 0.85rem;
  color: #7dd3fc;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.grid {
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
}

.card {
  position: relative;
  padding: 1.25rem 1.25rem 1.5rem;
  border-radius: 1.25rem;
  background: radial-gradient(circle at top left, #0f172a, #020617 60%, #000 100%);
  border: 1px solid rgba(148, 163, 184, 0.4);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.85);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  background: rgba(8, 47, 73, 0.9);
  color: #e0f2fe;
  z-index: 1;
}

.image-link {
  display: block;
  text-decoration: none;
}

.image {
  width: 100%;
  height: 150px;
  border-radius: 1rem;
  object-fit: cover;
  margin-bottom: 0.5rem;
  background-color: #020617;
}

.image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 0.85rem;
}

.placeholder {
  opacity: 0.9;
}

h2 {
  font-size: 1.1rem;
  margin: 0;
}

.product-link {
  color: inherit;
  text-decoration: none;
}

.product-link:hover {
  color: #7dd3fc;
}

.description {
  font-size: 0.9rem;
  color: #e5e7eb;
  flex: 1;
}

.best-for {
  margin: 0;
  color: #bae6fd;
  font-size: 0.88rem;
  font-weight: 700;
  line-height: 1.45;
}

.meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.9rem;
}

.price {
  font-weight: 600;
  color: #7dd3fc;
}

.stock {
  color: #bbf7d0;
}

.stock-out {
  color: #fed7aa;
}

.card-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.65rem;
  margin-top: 0.75rem;
}

.btn {
  border-radius: 999px;
  border: 1px solid transparent;
  padding: 0.6rem 1.1rem;
  background: linear-gradient(to right, #22d3ee, #0ea5e9);
  color: #0f172a;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-size: 0.8rem;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
}

.btn-secondary {
  background: transparent;
  color: #e2e8f0;
  border-color: rgba(148, 163, 184, 0.5);
}

.btn:disabled {
  cursor: not-allowed;
  filter: grayscale(0.3);
  opacity: 0.7;
}

@media (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .chooser,
  .reassurance-strip,
  .card-actions {
    grid-template-columns: 1fr;
  }

  .chooser {
    align-items: flex-start;
    flex-direction: column;
  }

  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
