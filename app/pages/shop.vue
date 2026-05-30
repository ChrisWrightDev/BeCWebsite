<template>
  <section class="page">
    <div class="inner">
      <header class="header">
        <h1>Tank-raised clownfish</h1>
        <p>
          Browse our current availability of captive-bred clownfish. Filter by pattern category and
          choose the fish that fits your reef.
        </p>
      </header>

      <section class="filters" v-if="uniquePatterns.length" aria-label="Filter by pattern">
        <button
          v-for="pattern in ['All', ...uniquePatterns]"
          :key="pattern"
          type="button"
          class="filter-chip"
          :class="{ active: isPatternActive(pattern) }"
          :aria-pressed="isPatternActive(pattern)"
          @click="handlePatternClick(pattern)"
        >
          {{ pattern }}
        </button>
      </section>

      <div v-if="pending" class="state state-panel">
        <img src="/images/shop-empty.svg" alt="" class="state-illustration" width="240" height="180" />
        <p>Loading clownfish from the hatchery…</p>
      </div>
      <div v-else-if="fetchError" class="state state-panel error">
        <img src="/images/shop-empty.svg" alt="" class="state-illustration" width="240" height="180" />
        <p>There was a problem loading clownfish. Please try again shortly.</p>
        <button type="button" class="btn-retry" @click="refresh()">Try again</button>
      </div>
      <div v-else-if="filteredClownfish.length === 0" class="state state-panel">
        <img src="/images/shop-empty.svg" alt="" class="state-illustration" width="240" height="180" />
        <p>No clownfish are available in this pattern right now.</p>
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
        <article v-for="fish in filteredClownfish" :key="fish.id" class="card">
          <div class="badge" v-if="fish.pattern">
            {{ fish.pattern }}
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
          <p class="category" v-if="fish.category_name">
            Category: {{ fish.category_name }}
          </p>
          <p class="description">
            {{ fish.description || 'Tank-raised clownfish ready for your reef aquarium.' }}
          </p>

          <div class="meta">
            <span class="price">{{ formatPriceCents(fish.price_cents) }}</span>
            <span class="stock" :class="{ 'stock-out': !fish.in_stock }">
              {{ fish.in_stock ? 'In stock' : 'Temporarily unavailable' }}
            </span>
          </div>

          <button
            class="btn"
            type="button"
            :disabled="!fish.in_stock"
            @click="addToCart(fish)"
          >
            Add to cart
          </button>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { clownfishImageAlt, formatPriceCents } from '~/utils/clownfish'

const config = useRuntimeConfig()
const siteUrl = (config.public.siteUrl || 'https://www.blueeyedclowns.com').replace(/\/$/, '')
const route = useRoute()
const router = useRouter()

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

const selectedPattern = ref(null)
const restockEmail = ref('')
const restockSubmitted = ref(false)
const cart = useCart()
const cartToast = useCartToast()

function patternFromQuery(query) {
  const raw = query.pattern
  if (!raw || raw === 'All') return null
  const value = Array.isArray(raw) ? raw[0] : raw
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function syncPatternFromRoute() {
  const fromQuery = patternFromQuery(route.query)
  if (!fromQuery) {
    selectedPattern.value = null
    return
  }
  if (uniquePatterns.value.length && !uniquePatterns.value.includes(fromQuery)) {
    selectedPattern.value = null
    if (route.query.pattern) {
      const query = { ...route.query }
      delete query.pattern
      router.replace({ path: route.path, query })
    }
    return
  }
  selectedPattern.value = fromQuery
}

const uniquePatterns = computed(() => {
  const patterns = new Set()
  ;(clownfish.value || []).forEach((fish) => {
    if (fish.pattern) patterns.add(fish.pattern)
  })
  return Array.from(patterns)
})

const filteredClownfish = computed(() => {
  const list = clownfish.value || []
  if (!selectedPattern.value || selectedPattern.value === 'All') return list
  return list.filter((fish) => fish.pattern === selectedPattern.value)
})

function isPatternActive(pattern) {
  if (pattern === 'All') return !selectedPattern.value || selectedPattern.value === 'All'
  return selectedPattern.value === pattern
}

function handlePatternClick(pattern) {
  const next = pattern === 'All' ? null : pattern
  selectedPattern.value = next
  const query = { ...route.query }
  if (next) query.pattern = next
  else delete query.pattern
  router.replace({ path: route.path, query })
}

watch(
  () => route.query.pattern,
  () => {
    syncPatternFromRoute()
  }
)

watch(clownfish, () => syncPatternFromRoute(), { immediate: true })

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

.header p {
  color: #cbd5f5;
  max-width: 40rem;
}

.filters {
  margin-top: 2rem;
  margin-bottom: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.filter-chip {
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.5);
  padding: 0.45rem 0.85rem;
  background: rgba(15, 23, 42, 0.8);
  color: #e5e7eb;
  font-size: 0.85rem;
  cursor: pointer;
}

.filter-chip.active {
  background: linear-gradient(to right, #22d3ee, #0ea5e9);
  border-color: transparent;
  color: #0f172a;
}

.filter-chip:focus-visible {
  outline: 2px solid #22d3ee;
  outline-offset: 2px;
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

.category {
  font-size: 0.85rem;
  color: #a5b4fc;
}

.description {
  font-size: 0.9rem;
  color: #e5e7eb;
  flex: 1;
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

.btn {
  margin-top: 0.75rem;
  border-radius: 999px;
  border: none;
  padding: 0.6rem 1.1rem;
  background: linear-gradient(to right, #22d3ee, #0ea5e9);
  color: #0f172a;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-size: 0.8rem;
  cursor: pointer;
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
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
