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

      <section class="filters" v-if="uniquePatterns.length">
        <button
          v-for="pattern in ['All', ...uniquePatterns]"
          :key="pattern"
          class="filter-chip"
          :class="{ active: selectedPattern === pattern || (!selectedPattern && pattern === 'All') }"
          @click="handlePatternClick(pattern)"
        >
          {{ pattern }}
        </button>
      </section>

      <div v-if="loading" class="state">Loading clownfish from the hatchery…</div>
      <div v-else-if="error" class="state error">
        There was a problem loading clownfish. Please try again shortly.
      </div>
      <div v-else-if="filteredClownfish.length === 0" class="state">
        No clownfish are available in this pattern right now. Please check back soon.
      </div>

      <div v-else class="grid">
        <article v-for="fish in filteredClownfish" :key="fish.id" class="card">
          <div class="badge" v-if="fish.pattern">
            {{ fish.pattern }}
          </div>

          <div
            class="image"
            :style="fish.image_url ? { backgroundImage: `url(${fish.image_url})` } : null"
          >
            <span v-if="!fish.image_url" class="placeholder">Clownfish preview</span>
          </div>

          <h2>{{ fish.name }}</h2>
          <p class="category" v-if="fish.category_name">
            Category: {{ fish.category_name }}
          </p>
          <p class="description">
            {{ fish.description || 'Tank-raised clownfish ready for your reef aquarium.' }}
          </p>

          <div class="meta">
            <span class="price">{{ formatPrice(fish.price_cents) }}</span>
            <span class="stock" :class="{ 'stock-out': !fish.in_stock }">
              {{ fish.in_stock ? 'In stock' : 'Temporarily unavailable' }}
            </span>
          </div>

          <button
            class="btn"
            type="button"
            :disabled="!fish.in_stock || addingId === fish.id"
            @click="addToCart(fish)"
          >
            <span v-if="addingId === fish.id">Added</span>
            <span v-else>Add to cart</span>
          </button>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
useSiteSeo({
  title: 'Shop Tank-Bred Clownfish',
  description:
    'Browse captive-bred clownfish — ocellaris, snowflake, black ice & more. In-stock updates weekly.',
})

const { $supabase } = useNuxtApp()

const clownfish = ref([])
const loading = ref(true)
const error = ref(null)
const selectedPattern = ref(null)
const addingId = ref(null)
const cart = useCart()

const uniquePatterns = computed(() => {
  const patterns = new Set()
  clownfish.value.forEach((fish) => {
    if (fish.pattern) {
      patterns.add(fish.pattern)
    }
  })
  return Array.from(patterns)
})

const filteredClownfish = computed(() => {
  if (!selectedPattern.value || selectedPattern.value === 'All') {
    return clownfish.value
  }
  return clownfish.value.filter((fish) => fish.pattern === selectedPattern.value)
})

function handlePatternClick(pattern) {
  selectedPattern.value = pattern === 'All' ? null : pattern
}

function formatPrice(cents) {
  if (typeof cents !== 'number') return '$—'
  return `$${(cents / 100).toFixed(2)}`
}

onMounted(async () => {
  try {
    if (!$supabase) {
      error.value = new Error(
        'Shop data is not configured. Add NUXT_SUPABASE_URL and NUXT_SUPABASE_ANON_KEY to your .env and create the clownfish table in Supabase.'
      )
      return
    }

    const { data, error: supabaseError } = await $supabase
      .from('clownfish')
      .select('id, name, description, price_cents, pattern, image_url, in_stock, category_name')
      .order('price_cents')

    if (supabaseError) {
      throw supabaseError
    }

    clownfish.value = data || []
  } catch (err) {
    console.error('[shop] error loading clownfish', err)
    error.value = err
  } finally {
    loading.value = false
  }
})

function addToCart(fish) {
  addingId.value = fish.id
  cart.addItem(fish, 1)
  setTimeout(() => {
    addingId.value = null
  }, 600)
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

.state {
  margin-top: 2.5rem;
  color: #cbd5f5;
}

.state.error {
  color: #fecaca;
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
}

.image {
  height: 150px;
  border-radius: 1rem;
  background-color: #020617;
  background-size: cover;
  background-position: center center;
  margin-bottom: 0.5rem;
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

