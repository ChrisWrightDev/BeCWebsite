<template>
  <section class="page">
    <div class="inner">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <NuxtLink to="/">Home</NuxtLink>
        <span aria-hidden="true">/</span>
        <NuxtLink to="/shop">Shop</NuxtLink>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{{ fish.name }}</span>
      </nav>

      <div v-if="pending" class="state">Loading product…</div>
      <div v-else-if="error" class="state error">
        <p>This clownfish could not be found.</p>
        <NuxtLink to="/shop" class="btn-link">Back to shop</NuxtLink>
      </div>

      <article v-else class="product">
        <div class="media">
          <img
            v-if="fish.image_url"
            :src="fish.image_url"
            :alt="clownfishImageAlt(fish)"
            class="product-image"
            width="640"
            height="480"
            fetchpriority="high"
            decoding="async"
          />
          <div v-else class="product-image placeholder">
            <span>Clownfish preview</span>
          </div>
        </div>

        <div class="details">
          <p v-if="fish.pattern" class="pattern-tag">{{ fish.pattern }}</p>
          <h1>{{ fish.name }}</h1>
          <p v-if="fish.category_name" class="category">Category: {{ fish.category_name }}</p>
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
            :disabled="!fish.in_stock || adding"
            @click="addToCart"
          >
            {{ adding ? 'Added' : 'Add to cart' }}
          </button>

          <NuxtLink to="/shop" class="back-link">← Browse all clownfish</NuxtLink>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { clownfishImageAlt, formatPriceCents } from '~/utils/clownfish'

const route = useRoute()
const slug = route.params.slug
const config = useRuntimeConfig()
const siteUrl = (config.public.siteUrl || 'https://www.blueeyedclowns.com').replace(/\/$/, '')

const { data: fish, pending, error } = await useAsyncData(`shop-product-${slug}`, () =>
  $fetch(`/api/shop/clownfish/${slug}`)
)

if (fish.value) {
  useSiteSeo({
    title: `${fish.value.name} — Tank-Bred Clownfish`,
    description:
      fish.value.description ||
      `${fish.value.name} — captive-bred clownfish from Blue-Eyed Clowns. 30-day health guarantee.`,
    ogImage: fish.value.image_url || undefined,
  })

  useJsonLd([
    buildProductSchema(fish.value, siteUrl),
    buildBreadcrumbSchema([
      { name: 'Home', url: siteUrl },
      { name: 'Shop', url: `${siteUrl}/shop` },
      { name: fish.value.name, url: `${siteUrl}/shop/${fish.value.slug}` },
    ]),
  ])
} else if (!pending.value) {
  useSiteSeo({ title: 'Product Not Found', noindex: true })
}

const adding = ref(false)
const cart = useCart()

function addToCart() {
  if (!fish.value?.in_stock) return
  adding.value = true
  cart.addItem(fish.value, 1)
  setTimeout(() => {
    adding.value = false
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
  max-width: 960px;
  margin: 0 auto;
}

.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: #94a3b8;
  margin-bottom: 1.5rem;
}

.breadcrumb a {
  color: #7dd3fc;
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.state {
  margin-top: 2rem;
  color: #cbd5f5;
}

.state.error {
  color: #fecaca;
}

.btn-link {
  color: #7dd3fc;
}

.product {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
  align-items: start;
}

.product-image {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 1.25rem;
  background: #020617;
  border: 1px solid rgba(148, 163, 184, 0.35);
}

.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
}

.pattern-tag {
  display: inline-block;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  background: rgba(8, 47, 73, 0.9);
  color: #e0f2fe;
  margin: 0 0 0.75rem;
}

h1 {
  font-size: 1.75rem;
  margin: 0 0 0.5rem;
}

.category {
  font-size: 0.9rem;
  color: #a5b4fc;
  margin: 0 0 1rem;
}

.description {
  font-size: 1rem;
  line-height: 1.6;
  color: #e5e7eb;
  margin: 0 0 1.25rem;
}

.meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #7dd3fc;
}

.stock {
  color: #bbf7d0;
  font-size: 0.9rem;
}

.stock-out {
  color: #fed7aa;
}

.btn {
  border-radius: 999px;
  border: none;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(to right, #22d3ee, #0ea5e9);
  color: #0f172a;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-size: 0.85rem;
  cursor: pointer;
}

.btn:disabled {
  cursor: not-allowed;
  filter: grayscale(0.3);
  opacity: 0.7;
}

.back-link {
  display: inline-block;
  margin-top: 1.25rem;
  font-size: 0.9rem;
  color: #94a3b8;
  text-decoration: none;
}

.back-link:hover {
  color: #7dd3fc;
}

@media (max-width: 720px) {
  .product {
    grid-template-columns: 1fr;
  }
}
</style>
