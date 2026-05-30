<script setup>
const config = useRuntimeConfig()
const siteUrl = (config.public.siteUrl || 'https://www.blueeyedclowns.com').replace(/\/$/, '')

useSiteSeo({
  title: 'About Us — Captive Clownfish Breeders',
  description:
    'Meet our marine biologists. Learn how we breed healthy, sustainable clownfish for reef aquariums.',
})

useJsonLd(buildAboutPageSchema(siteUrl))

const founders = [
  {
    name: 'Chris Wright',
    role: 'Co-Founder',
    slug: 'chris-wright',
    bio: 'Marine biologist with over 15 years of experience in aquaculture and clownfish breeding. Chris oversees fish health, genetics, and broodstock selection so every clownfish meets our high standards.',
    credential: 'M.S. Marine Biology',
  },
  {
    name: 'Mike Kay',
    role: 'Co-Founder',
    slug: 'mike-kay',
    bio: 'Aquarium systems specialist with a passion for sustainable marine practices. Mike designs and maintains our breeding facilities, ensuring optimal water quality and husbandry for every tank.',
    credential: 'Aquaculture Systems Engineer',
  },
]

const testimonials = [
  {
    quote:
      'Our snowflake pair acclimated within hours and started hosting an anemone by day three. You can tell these fish were raised with care.',
    author: 'Sarah M.',
    context: '120-gallon reef, Colorado',
  },
  {
    quote:
      'Third order from Blue-Eyed Clowns. Consistent color, healthy appetites, and the shipping packaging is always top-notch.',
    author: 'James T.',
    context: 'Mixed reef, Texas',
  },
  {
    quote:
      'As a local fish store buyer, I appreciate the transparent grading and reliable overnight shipping. Our customers love the tank-bred clowns.',
    author: 'Reef Haven Aquatics',
    context: 'Wholesale partner',
  },
]

const galleryImages = [
  { src: '/images/gallery/reef-tank-1.svg', alt: 'Ocellaris clownfish in a home reef aquarium display tank' },
  { src: '/images/gallery/reef-tank-2.svg', alt: 'Snowflake clownfish pair in a reef display' },
  { src: '/images/gallery/reef-tank-3.svg', alt: 'Designer clownfish in our aquaculture breeding system' },
]
</script>

<template>
  <section class="page">
    <div class="inner">
      <header class="header">
        <h1>About Blue-Eyed Clowns</h1>
        <p class="story-text">
          Welcome to Blue-Eyed Clowns, where passion for marine life meets quality aquaculture. We
          specialize in breeding and providing the healthiest, most vibrant clownfish for aquarium
          enthusiasts.
        </p>
      </header>

      <section class="owners">
        <h2>Meet the founders</h2>
        <div class="owners-grid">
          <article v-for="founder in founders" :key="founder.slug" class="owner-card">
            <img
              :src="`/images/founders/${founder.slug}.svg`"
              :alt="`${founder.name}, ${founder.role} at Blue-Eyed Clowns`"
              class="owner-photo"
              width="120"
              height="120"
            />
            <h3>{{ founder.name }}</h3>
            <p class="owner-role">{{ founder.role }}</p>
            <p class="owner-credential">{{ founder.credential }}</p>
            <p class="owner-bio story-text">{{ founder.bio }}</p>
          </article>
        </div>
      </section>

      <section class="gallery" aria-label="Reef and hatchery photography">
        <h2>From our tanks to your reef</h2>
        <div class="gallery-strip">
          <figure v-for="(image, index) in galleryImages" :key="index" class="gallery-item">
            <img :src="image.src" :alt="image.alt" width="320" height="200" loading="lazy" decoding="async" />
          </figure>
        </div>
      </section>

      <section class="testimonials" aria-label="Customer testimonials">
        <h2>What reef keepers say</h2>
        <div class="testimonials-grid">
          <blockquote v-for="(item, index) in testimonials" :key="index" class="testimonial-card">
            <p class="testimonial-quote story-text">"{{ item.quote }}"</p>
            <footer>
              <cite>{{ item.author }}</cite>
              <span class="testimonial-context">{{ item.context }}</span>
            </footer>
          </blockquote>
        </div>
      </section>

      <section class="mission">
        <h2>Our mission</h2>
        <p class="story-text">
          At Blue-Eyed Clowns, we're committed to providing healthy, tank-bred clownfish that bring
          joy to aquarium enthusiasts while supporting sustainable marine practices. Every fish is
          carefully bred, raised with love, and prepared for a lifetime in your aquarium.
        </p>
      </section>

      <div class="grid">
        <article>
          <h2>Why tank-raised clownfish?</h2>
          <p class="story-text">
            Tank-raised fish adapt more quickly to aquarium life, accept prepared foods easily, and
            put less pressure on wild reefs. Every clownfish we ship is born and raised in our
            systems.
          </p>
          <p class="story-text">
            Our broodstock lines are carefully selected for color, pattern, and temperament. We
            track lineage and pairings so we can consistently produce the patterns our customers
            love — from classic ocellaris to high-end designer morphs.
          </p>
        </article>

        <article>
          <h2>Our water and husbandry standards</h2>
          <p class="story-text">
            Stable, clean water is everything. Our systems are filtered with oversized biological
            and mechanical filtration, redundant heaters, and continuous monitoring of temperature,
            salinity, and pH.
          </p>
          <p class="story-text">
            Fish are weaned onto high-quality prepared foods and observed daily for health and
            behavior. Only strong, active, feeding fish are selected for shipping.
          </p>
        </article>
      </div>

      <section class="values">
        <h2>What we stand for</h2>
        <ul>
          <li><strong>Sustainability</strong> — zero wild-caught clownfish in our systems.</li>
          <li><strong>Transparency</strong> — clear grading, photos, and size ranges.</li>
          <li><strong>Support</strong> — guidance for acclimation and long-term care.</li>
        </ul>
      </section>
    </div>
  </section>
</template>

<style scoped>
.page {
  padding: 3.5rem 1.5rem 4rem;
  background: radial-gradient(circle at top, rgba(15, 23, 42, 0.9), #020617 55%, #000 100%);
  color: #e5e7eb;
}

.inner {
  max-width: 960px;
  margin: 0 auto;
}

.header h1 {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.header p {
  color: #cbd5f5;
  max-width: 40rem;
  line-height: 1.65;
}

.owners {
  margin-top: 2.5rem;
}

.owners h2,
.gallery h2,
.testimonials h2,
.mission h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.owners-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2rem;
}

.owner-card {
  padding: 1.5rem 1.25rem;
  border-radius: 1.25rem;
  background: radial-gradient(circle at top left, rgba(15, 23, 42, 0.9), #020617 60%, #000 100%);
  border: 1px solid rgba(148, 163, 184, 0.3);
  text-align: center;
}

.owner-photo {
  width: 7.5rem;
  height: 7.5rem;
  margin: 0 auto 1rem;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(34, 211, 238, 0.35);
}

.owner-card h3 {
  font-size: 1.15rem;
  margin: 0 0 0.25rem;
}

.owner-role {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #7dd3fc;
  margin: 0 0 0.35rem;
}

.owner-credential {
  font-size: 0.8rem;
  color: #94a3b8;
  margin: 0 0 0.75rem;
  font-style: italic;
}

.owner-bio {
  font-size: 0.95rem;
  color: #cbd5e1;
  line-height: 1.55;
  margin: 0;
  text-align: left;
}

.gallery {
  margin-top: 3rem;
}

.gallery-strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.gallery-item {
  margin: 0;
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.25);
}

.gallery-item img {
  display: block;
  width: 100%;
  height: auto;
}

.testimonials {
  margin-top: 3rem;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

.testimonial-card {
  margin: 0;
  padding: 1.25rem;
  border-radius: 1rem;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.25);
}

.testimonial-quote {
  font-size: 0.95rem;
  color: #e2e8f0;
  line-height: 1.55;
  margin: 0 0 1rem;
}

.testimonial-card cite {
  display: block;
  font-style: normal;
  font-weight: 600;
  color: #7dd3fc;
  font-size: 0.9rem;
}

.testimonial-context {
  display: block;
  font-size: 0.8rem;
  color: #94a3b8;
  margin-top: 0.2rem;
}

.mission {
  margin-top: 2.5rem;
}

.mission p {
  color: #cbd5e1;
  line-height: 1.65;
  margin: 0;
  max-width: 52rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2rem;
  margin-top: 2.5rem;
}

.grid h2 {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
}

.grid p {
  color: #cbd5e1;
  line-height: 1.6;
}

.values {
  margin-top: 3rem;
}

.values h2 {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
}

.values ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.values li {
  margin-bottom: 0.5rem;
}

@media (max-width: 800px) {
  .owners-grid,
  .grid,
  .gallery-strip,
  .testimonials-grid {
    grid-template-columns: 1fr;
  }
}
</style>
