<template>
  <section class="page">
    <div class="inner">
      <header class="header">
        <p class="eyebrow">Unique WYSIWYG pairs</p>
        <h1>Bonded Clownfish Pairs for Sale</h1>
        <p>
          Each bonded pair is one of a kind. The video or photo on a listing is the exact pair you
          receive — what you see is what you get.
        </p>
      </header>

      <section class="chooser" aria-label="Shop single clownfish">
        <div>
          <strong>Looking for a single clownfish?</strong>
          <span>Browse feeding-ready singles in the regular shop. Pairs are listed only here.</span>
        </div>
        <NuxtLink to="/shop">Shop single clownfish</NuxtLink>
      </section>

      <div class="reassurance-strip" aria-label="Purchase reassurance">
        <span>Exact pair shown</span>
        <span>3-day live guarantee</span>
        <span>UPS or FedEx overnight, Monday through Thursday</span>
        <span>Captive-bred and feeding well</span>
      </div>

      <div v-if="pending" class="state state-panel">
        <img src="/images/shop-empty.svg" alt="" class="state-illustration" width="240" height="180" />
        <p>Loading bonded pairs from the hatchery…</p>
      </div>
      <div v-else-if="fetchError" class="state state-panel error">
        <img src="/images/shop-empty.svg" alt="" class="state-illustration" width="240" height="180" />
        <p>There was a problem loading bonded pairs. Please try again shortly.</p>
        <button type="button" class="btn-retry" @click="refresh()">Try again</button>
      </div>
      <div v-else-if="!pairs?.length" class="state state-panel">
        <img src="/images/shop-empty.svg" alt="" class="state-illustration" width="240" height="180" />
        <p>No bonded pairs are listed right now.</p>
        <NuxtLink to="/shop" class="btn btn-restock">Shop single clownfish</NuxtLink>
      </div>

      <div v-else class="grid">
        <article v-for="pair in pairs" :key="pair.id" class="card">
          <div class="badge" :class="{ reserved: pair.status === 'reserved' }">
            {{ pair.status === 'reserved' ? 'Reserved' : 'Available' }}
          </div>

          <NuxtLink :to="`/bonded-pairs/${pair.slug}`" class="image-link">
            <BondedPairMedia
              class="image"
              :video-url="pair.video_url"
              :poster-url="pair.video_poster_url"
              :image-url="pair.image_url"
              :alt="bondedPairImageAlt(pair)"
              :width="320"
              :height="180"
            />
          </NuxtLink>

          <h2>
            <NuxtLink :to="`/bonded-pairs/${pair.slug}`" class="product-link">{{ pair.name }}</NuxtLink>
          </h2>
          <p class="best-for">{{ bondedPairMorphLabel(pair) }}</p>
          <p class="description">
            {{ compactDescription(pair) }}
          </p>

          <div class="meta">
            <span class="price">{{ formatPriceCents(pair.price_cents) }}</span>
            <span class="stock" :class="{ 'stock-out': pair.status !== 'available' }">
              {{ pair.status === 'available' ? 'Ready to ship as a pair' : 'Reserved' }}
            </span>
          </div>

          <div class="card-actions">
            <NuxtLink :to="`/bonded-pairs/${pair.slug}`" class="btn btn-secondary">View pair</NuxtLink>
            <button
              class="btn"
              type="button"
              :disabled="pair.status !== 'available'"
              @click="addToCart(pair)"
            >
              {{ pair.status === 'available' ? 'Add to cart' : 'Reserved' }}
            </button>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { bondedPairImageAlt, bondedPairMorphLabel } from '~/utils/bondedPairs'
import { compactDescription, formatPriceCents } from '~/utils/clownfish'

const config = useRuntimeConfig()
const siteUrl = (config.public.siteUrl || 'https://www.blueeyedclowns.com').replace(/\/$/, '')

useSiteSeo({
  title: 'Bonded Clownfish Pairs for Sale',
  description:
    'Unique WYSIWYG bonded clownfish pairs. Each listing shows the exact pair you receive, with UPS or FedEx overnight shipping Monday through Thursday and a 3-day live guarantee.',
})

const { data: pairs, pending, error: fetchError, refresh } = await useAsyncData('shop-bonded-pairs', () =>
  $fetch('/api/shop/bonded-pairs')
)

if (pairs.value?.length) {
  useJsonLd([
    buildBondedPairItemListSchema(pairs.value, siteUrl),
    ...pairs.value.map((pair) => buildBondedPairProductSchema(pair, siteUrl)),
  ])
}

const cart = useCart()
const cartToast = useCartToast()

function addToCart(pair) {
  if (pair.status !== 'available') return
  cart.addItem({ ...pair, type: 'bonded_pair' }, 1)
  cartToast.show(pair.name)
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
  max-width: 42rem;
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

.state.error {
  color: #fecaca;
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
  text-decoration: none;
}

.btn-retry {
  margin-top: 0.75rem;
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

.badge.reserved {
  background: rgba(120, 53, 15, 0.92);
  color: #ffedd5;
}

.image-link {
  display: block;
  text-decoration: none;
}

.image {
  height: 180px;
  border-radius: 1rem;
  overflow: hidden;
  margin-bottom: 0.5rem;
  background-color: #020617;
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
  gap: 0.75rem;
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
