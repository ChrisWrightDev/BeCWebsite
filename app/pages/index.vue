<script setup>
useSiteSeo({
  title: 'Tank-Bred Clownfish for Sale',
  description:
    'Captive-bred ocellaris, snowflake & designer clownfish. 30-day health guarantee, safe overnight shipping. Shop premium tank-raised clownfish.',
  ogImage: '/images/hero-reef.svg',
})

const featuredFish = [
  {
    tag: 'Classic',
    name: 'Ocellaris Clownfish',
    description: 'Mellow temperament and iconic orange-and-white barring. Perfect for community reefs.',
    price: '$40.00',
    shopQuery: { pattern: 'Classic' },
  },
  {
    tag: 'Pattern',
    name: 'Snowflake Ocellaris',
    description: 'High-contrast white patterns with deep orange highlights for high-impact displays.',
    price: '$65.00',
    shopQuery: { pattern: 'Pattern' },
  },
  {
    tag: 'Designer',
    name: 'Black Ice Clownfish',
    description: 'Striking dark barring with crisp white edges — a centerpiece fish for modern reefs.',
    price: '$85.00',
    shopQuery: { pattern: 'Designer' },
  },
]
</script>

<template>
  <section class="hero">
    <img
      src="/images/hero-reef.svg"
      alt=""
      class="hero-image"
      width="1920"
      height="1080"
      fetchpriority="high"
      decoding="async"
    />
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <h1>Blue-Eyed Clowns</h1>
      <p class="subtitle">Premium tank-bred clownfish for your aquarium paradise</p>
      <div class="hero-actions">
        <NuxtLink to="/shop" class="btn btn-primary">Shop Clownfish</NuxtLink>
        <NuxtLink to="/about" class="btn btn-ghost">Our breeding story</NuxtLink>
      </div>
    </div>
  </section>

  <section class="features-bar">
    <div class="features-inner">
      <div class="feature-item">
        <div class="feature-icon" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <h3>30-day health guarantee</h3>
        <p>Every clownfish arrives healthy or we make it right</p>
      </div>
      <div class="feature-item">
        <div class="feature-icon" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 16s3-5 10-5 10 5 10 5-3 5-10 5-10-5-10-5Z" />
            <circle cx="12" cy="8" r="3" />
          </svg>
        </div>
        <h3>100% captive-bred</h3>
        <p>Sustainably raised in our state-of-the-art hatchery</p>
      </div>
      <div class="feature-item">
        <div class="feature-icon" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12" />
            <path d="M15 18h5l2-4h-7" />
            <path d="M2 18h3" />
            <circle cx="7" cy="18" r="2" />
            <circle cx="17" cy="18" r="2" />
          </svg>
        </div>
        <h3>Insulated overnight shipping</h3>
        <p>Expert packaging ensures safe arrival to your door</p>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="section-inner">
      <header class="section-header">
        <h2>Featured clownfish</h2>
        <p>
          A curated selection of our most popular tank-raised clownfish, bred for vibrant color and
          strong genetics.
        </p>
      </header>

      <div class="grid">
        <article v-for="fish in featuredFish" :key="fish.name" class="card">
          <div class="card-tag">{{ fish.tag }}</div>
          <h3>{{ fish.name }}</h3>
          <p>{{ fish.description }}</p>
          <p class="price">{{ fish.price }}</p>
          <NuxtLink :to="{ path: '/shop', query: fish.shopQuery }" class="card-link">
            View in shop
            <span class="sr-only">{{ fish.name }}</span>
          </NuxtLink>
        </article>
      </div>

      <div class="section-cta">
        <NuxtLink to="/shop" class="btn btn-outline">Browse all clownfish</NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4.5rem 1.5rem 4rem;
  color: #f9fafb;
  overflow: hidden;
}

.hero-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  z-index: 0;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background-color: #0006;
  z-index: 1;
}

.hero-content {
  position: relative;
  max-width: 720px;
  text-align: center;
  z-index: 2;
}

h1 {
  font-size: clamp(2.4rem, 4vw + 1.6rem, 3.5rem);
  line-height: 1.1;
  margin: 0 0 0.75rem;
  font-weight: 700;
}

.subtitle {
  font-size: 1.15rem;
  color: #e5e7eb;
  max-width: 36rem;
  margin: 0 auto 1.75rem;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
}

.features-bar {
  padding: 2rem 1.5rem;
  background: radial-gradient(circle at top, rgba(15, 23, 42, 0.98), #020617 50%, #000 100%);
  border-top: 1px solid rgba(148, 163, 184, 0.2);
}

.features-inner {
  max-width: 960px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  text-align: center;
}

.feature-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.75rem;
  color: #22d3ee;
}

.feature-icon svg {
  display: block;
}

.feature-item h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.35rem;
  color: #f9fafb;
}

.feature-item p {
  font-size: 0.9rem;
  color: #cbd5e1;
  margin: 0;
  line-height: 1.4;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.7rem 1.4rem;
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-decoration: none;
  border: 1px solid transparent;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.1s ease,
    box-shadow 0.1s ease, border-color 0.2s ease;
}

.btn:focus-visible,
.card-link:focus-visible {
  outline: 2px solid #22d3ee;
  outline-offset: 3px;
}

.btn-primary {
  background: linear-gradient(to right, #22d3ee, #0ea5e9);
  color: #0f172a;
  box-shadow: 0 14px 35px rgba(8, 47, 73, 0.65);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 18px 45px rgba(8, 47, 73, 0.9);
}

.btn-ghost {
  background: transparent;
  color: #e5e7eb;
  border-color: rgba(148, 163, 184, 0.7);
}

.btn-ghost:hover {
  border-color: #7dd3fc;
  color: #f9fafb;
  background-color: rgba(15, 23, 42, 0.7);
}

.section {
  padding: 4rem 1.5rem 4.5rem;
  background: radial-gradient(circle at top, rgba(15, 23, 42, 0.9), #020617 55%, #000 100%);
}

.section-inner {
  max-width: 1120px;
  margin: 0 auto;
}

.section-header {
  text-align: left;
  margin-bottom: 2rem;
}

.section-header h2 {
  font-size: 1.6rem;
  margin-bottom: 0.5rem;
}

.section-header p {
  color: #cbd5f5;
  max-width: 30rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
}

.card {
  position: relative;
  padding: 1.5rem 1.4rem 1.25rem;
  border-radius: 1.25rem;
  background: radial-gradient(circle at top left, #0f172a, #020617 60%, #000 100%);
  border: 1px solid rgba(148, 163, 184, 0.35);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.85);
}

.card-tag {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  padding: 0.3rem 0.65rem;
  border-radius: 999px;
  background: rgba(8, 47, 73, 0.8);
  color: #e0f2fe;
}

.card h3 {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
}

.card p {
  margin: 0 0 0.75rem;
  color: #e5e7eb;
  font-size: 0.95rem;
}

.price {
  margin-top: 0.5rem;
  font-weight: 600;
  color: #7dd3fc;
}

.card-link {
  display: inline-flex;
  margin-top: 0.75rem;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #22d3ee;
  text-decoration: none;
}

.card-link:hover {
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

.section-cta {
  margin-top: 2.5rem;
}

.btn-outline {
  border-color: rgba(148, 163, 184, 0.7);
  color: #e5e7eb;
}

.btn-outline:hover {
  border-color: #7dd3fc;
  background-color: rgba(15, 23, 42, 0.8);
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .hero {
    align-items: flex-start;
    padding-top: 6rem;
  }

  .hero-content {
    text-align: center;
  }

  .features-inner {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  .grid {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .btn-primary:hover {
    transform: none;
  }
}
</style>
