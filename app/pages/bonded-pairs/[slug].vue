<template>
  <section class="page">
    <div class="inner">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <NuxtLink to="/">Home</NuxtLink>
        <span aria-hidden="true">/</span>
        <NuxtLink to="/bonded-pairs">Bonded Pairs</NuxtLink>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{{ pair?.name || 'Bonded pair' }}</span>
      </nav>

      <div v-if="pending" class="state">Loading pair…</div>
      <div v-else-if="error" class="state error">
        <p>This bonded pair could not be found.</p>
        <NuxtLink to="/bonded-pairs" class="btn-link">Back to bonded pairs</NuxtLink>
      </div>

      <article v-else class="product-page">
        <section class="product-hero">
          <div class="media">
            <BondedPairMedia
              class="product-image"
              :video-url="pair.video_url"
              :poster-url="pair.video_poster_url"
              :image-url="pair.image_url"
              :alt="bondedPairImageAlt(pair)"
              :width="720"
              :height="540"
              priority
            />
            <p class="photo-note">{{ wysiwygNote(pair) }}</p>
          </div>

          <div class="details">
            <p class="pattern-tag" :class="{ reserved: pair.status === 'reserved' }">
              {{ pair.status === 'reserved' ? 'Reserved' : 'Unique bonded pair' }}
            </p>
            <h1>{{ pair.name }} for Sale</h1>
            <p class="positioning">{{ bondedPairMorphLabel(pair) }}</p>
            <p class="description">
              {{ pair.description || 'A unique captive-bred bonded pair, sold together only.' }}
            </p>

            <div class="meta">
              <span class="price">{{ formatPriceCents(pair.price_cents) }}</span>
              <span class="stock" :class="{ 'stock-out': pair.status !== 'available' }">
                {{ pair.status === 'available' ? 'Available as a pair' : 'Reserved — not available to buy' }}
              </span>
            </div>

            <div class="reassurance-strip" aria-label="Purchase reassurance">
              <span>Exact pair shown</span>
              <span>3-day live guarantee</span>
              <span>UPS or FedEx overnight, Monday through Thursday</span>
              <span>Captive-bred</span>
            </div>

            <div class="actions">
              <button
                class="btn"
                type="button"
                :disabled="pair.status !== 'available'"
                @click="addToCart"
              >
                {{ pair.status === 'available' ? 'Add pair to cart' : 'Reserved' }}
              </button>
              <NuxtLink :to="`/contact?type=product_question&pair=${encodeURIComponent(pair.slug)}&subject=${encodeURIComponent(`Question about ${pair.name}`)}`" class="btn btn-secondary">
                Ask about this pair
              </NuxtLink>
            </div>
          </div>
        </section>

        <section class="content-grid" aria-label="Pair details">
          <div class="panel">
            <h2>Quick facts</h2>
            <dl class="facts">
              <div v-for="fact in quickFacts" :key="fact.label" class="fact-row">
                <dt>{{ fact.label }}</dt>
                <dd>{{ fact.value }}</dd>
              </div>
            </dl>
          </div>

          <div class="panel">
            <h2>Shipping &amp; live arrival</h2>
            <details open>
              <summary>How live-fish shipping works</summary>
              <p>
                {{ retailShippingPolicySentence() }} We ship live clownfish Monday through Thursday by
                UPS or FedEx overnight. Before shipping, we confirm that the pair is active, feeding,
                and safe to send based on weather and carrier timing.
              </p>
            </details>
            <details>
              <summary>What to do when your pair arrives</summary>
              <p>
                Float the sealed bags to temperature match, drip-acclimate slowly, and keep lights dim while
                the pair settles in. Contact us right away if anything looks wrong on arrival.
              </p>
            </details>
            <details>
              <summary>Live-arrival and 3-day support</summary>
              <p>
                If there is a DOA concern, photograph the unopened bag within two hours of delivery and email
                blueeyedclowns@gmail.com. The 3-day live guarantee helps protect buyers from pre-existing issues.
              </p>
            </details>
          </div>
        </section>

        <section class="panel story-panel">
          <h2>Why buy a bonded pair?</h2>
          <p>
            These two fish are already established together. You receive this exact pair — not a random
            pairing from the singles tank. Shop singles if you want to build a pair over time;
            choose a bonded pair when you want a proven pair that is ready to move in together.
          </p>
          <div class="inline-links">
            <NuxtLink to="/shop">Shop single clownfish</NuxtLink>
            <NuxtLink to="/guides/clownfish-care">Read the care guide</NuxtLink>
            <NuxtLink to="/contact#faq">Shipping FAQ</NuxtLink>
          </div>
        </section>

        <section v-if="related.length" class="related" aria-labelledby="related-heading">
          <h2 id="related-heading">Other bonded pairs</h2>
          <div class="related-grid">
            <NuxtLink v-for="item in related" :key="item.id" :to="`/bonded-pairs/${item.slug}`" class="related-card">
              <img v-if="item.image_url" :src="item.image_url" :alt="bondedPairImageAlt(item)" loading="lazy" />
              <span>{{ item.name }}</span>
              <strong>{{ formatPriceCents(item.price_cents) }}</strong>
            </NuxtLink>
          </div>
        </section>
      </article>
    </div>

    <div v-if="pair && pair.status === 'available'" class="mobile-sticky">
      <span>{{ formatPriceCents(pair.price_cents) }}</span>
      <button type="button" @click="addToCart">Add pair to cart</button>
    </div>
  </section>
</template>

<script setup>
import {
  bondedPairImageAlt,
  bondedPairMorphLabel,
  bondedPairSeoDescription,
  bondedPairSeoTitle,
  quickFactsForBondedPair,
  wysiwygNote,
} from '~/utils/bondedPairs'
import { formatPriceCents } from '~/utils/clownfish'
import { retailShippingPolicySentence } from '#shared/retailShipping.js'

const route = useRoute()
const slug = route.params.slug
const config = useRuntimeConfig()
const siteUrl = (config.public.siteUrl || 'https://blueeyedclowns.com').replace(/\/$/, '')

const { data: pair, pending, error } = await useAsyncData(`bonded-pair-${slug}`, () =>
  $fetch(`/api/shop/bonded-pairs/${slug}`)
)

if (!pending.value && !pair.value) {
  throw createError({ statusCode: 404, statusMessage: 'Bonded pair not found' })
}

const { data: catalog } = await useAsyncData('shop-bonded-pairs', () =>
  $fetch('/api/shop/bonded-pairs')
)

const quickFacts = computed(() => quickFactsForBondedPair(pair.value))
const related = computed(() =>
  (catalog.value || []).filter((item) => item.slug !== pair.value?.slug).slice(0, 3)
)

if (pair.value) {
  useSiteSeo({
    title: bondedPairSeoTitle(pair.value),
    description: bondedPairSeoDescription(pair.value),
    ogImage: pair.value.image_url || pair.value.video_poster_url || undefined,
  })

  useJsonLd([
    buildBondedPairProductSchema(pair.value, siteUrl),
    buildBreadcrumbSchema([
      { name: 'Home', url: siteUrl },
      { name: 'Bonded Pairs', url: `${siteUrl}/bonded-pairs` },
      { name: pair.value.name, url: `${siteUrl}/bonded-pairs/${pair.value.slug}` },
    ]),
  ])
} else if (!pending.value) {
  useSiteSeo({ title: 'Bonded Pair Not Found', noindex: true })
}

const cart = useCart()
const cartToast = useCartToast()

function addToCart() {
  if (!pair.value || pair.value.status !== 'available') return
  cart.addItem({ ...pair.value, type: 'bonded_pair' }, 1)
  cartToast.show(pair.value.name)
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

.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: #94a3b8;
  margin-bottom: 1.5rem;
}

.breadcrumb a,
.btn-link,
.inline-links a {
  color: #7dd3fc;
  text-decoration: none;
}

.breadcrumb a:hover,
.btn-link:hover,
.inline-links a:hover {
  text-decoration: underline;
}

.state {
  margin-top: 2rem;
  color: #cbd5f5;
}

.state.error {
  color: #fecaca;
}

.product-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.95fr);
  gap: 2.5rem;
  align-items: start;
}

.product-image {
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 1.25rem;
  overflow: hidden;
  background: #020617;
  border: 1px solid rgba(148, 163, 184, 0.35);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
}

.photo-note {
  margin: 0.8rem 0 0;
  color: #94a3b8;
  font-size: 0.9rem;
}

.pattern-tag {
  display: inline-block;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  background: rgba(8, 47, 73, 0.9);
  color: #e0f2fe;
  margin: 0 0 0.75rem;
}

.pattern-tag.reserved {
  background: rgba(120, 53, 15, 0.92);
  color: #ffedd5;
}

h1 {
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.05;
  margin: 0 0 0.8rem;
}

.positioning {
  color: #bae6fd;
  font-weight: 600;
  margin: 0 0 0.8rem;
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
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.price {
  font-size: 1.4rem;
  font-weight: 700;
  color: #7dd3fc;
}

.stock {
  color: #bbf7d0;
  font-size: 0.95rem;
}

.stock-out {
  color: #fed7aa;
}

.reassurance-strip {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.55rem;
  margin: 1.2rem 0;
}

.reassurance-strip span {
  border: 1px solid rgba(125, 211, 252, 0.22);
  border-radius: 0.85rem;
  padding: 0.65rem 0.75rem;
  background: rgba(15, 23, 42, 0.68);
  color: #dbeafe;
  font-size: 0.88rem;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1px solid transparent;
  padding: 0.8rem 1.5rem;
  background: linear-gradient(to right, #22d3ee, #0ea5e9);
  color: #0f172a;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-size: 0.85rem;
  cursor: pointer;
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

.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;
}

.panel,
.related-card {
  border-radius: 1.25rem;
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(148, 163, 184, 0.28);
  box-shadow: 0 18px 40px rgba(2, 6, 23, 0.4);
}

.panel {
  padding: 1.35rem;
}

.panel h2,
.related h2 {
  margin: 0 0 1rem;
  font-size: 1.25rem;
}

.facts {
  margin: 0;
}

.fact-row {
  display: grid;
  grid-template-columns: 11rem 1fr;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.18);
}

.fact-row:last-child {
  border-bottom: 0;
}

dt {
  color: #93c5fd;
  font-weight: 700;
  font-size: 0.9rem;
}

dd {
  margin: 0;
  color: #e5e7eb;
  line-height: 1.45;
}

details {
  border-bottom: 1px solid rgba(148, 163, 184, 0.18);
  padding: 0.75rem 0;
}

details:last-child {
  border-bottom: 0;
}

summary {
  cursor: pointer;
  color: #e0f2fe;
  font-weight: 700;
}

details p,
.story-panel p {
  color: #cbd5e1;
  line-height: 1.6;
}

.story-panel {
  margin-top: 1.5rem;
}

.inline-links {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}

.related {
  margin-top: 2rem;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.related-card {
  display: grid;
  gap: 0.55rem;
  padding: 1rem;
  color: #e5e7eb;
  text-decoration: none;
}

.related-card:hover {
  border-color: #7dd3fc;
}

.related-card img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 0.85rem;
}

.related-card strong {
  color: #7dd3fc;
}

.mobile-sticky {
  display: none;
}

@media (max-width: 820px) {
  .product-hero,
  .content-grid,
  .related-grid {
    grid-template-columns: 1fr;
  }

  .fact-row {
    grid-template-columns: 1fr;
    gap: 0.25rem;
  }
}

@media (max-width: 640px) {
  .page {
    padding-bottom: 6rem;
  }

  .reassurance-strip {
    grid-template-columns: 1fr;
  }

  .mobile-sticky {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 30;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem 1rem;
    background: rgba(2, 6, 23, 0.96);
    border-top: 1px solid rgba(125, 211, 252, 0.35);
  }

  .mobile-sticky span {
    color: #7dd3fc;
    font-weight: 700;
  }

  .mobile-sticky button {
    border: 0;
    border-radius: 999px;
    padding: 0.7rem 1rem;
    background: linear-gradient(to right, #22d3ee, #0ea5e9);
    color: #0f172a;
    font-weight: 700;
  }
}
</style>
