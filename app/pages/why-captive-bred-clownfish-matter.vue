<script setup>
const config = useRuntimeConfig()
const siteUrl = (config.public.siteUrl || 'https://www.blueeyedclowns.com').replace(/\/$/, '')
const pageUrl = `${siteUrl}/why-captive-bred-clownfish-matter`

const pageTitle = 'Captive-Bred Clownfish for Reef Aquariums | Blue Eyed Clowns'
const pageDescription =
  'Learn why captive-bred clownfish matter for reef aquariums: less reliance on wild collection, aquarium-born fish, and designer morphs bred in captivity.'

const benefitCards = [
  {
    title: 'Less reliance on wild collection',
    body:
      'Choosing captive-bred clownfish supports aquarium sources that do not require removing individual clownfish from reef habitats for the hobby.',
  },
  {
    title: 'Aquarium-born and already feeding',
    body:
      'Tank-raised clownfish spend their lives in aquarium systems and are started on prepared marine foods before they ever ship to a customer.',
  },
  {
    title: 'Clear designer morph expectations',
    body:
      'Snowflake, storm, and other designer patterns are selectively bred captive aquarium strains, not natural reef patterns collected from the wild.',
  },
]

const faqs = [
  {
    question: 'Are captive-bred clownfish better for reef preservation?',
    answer:
      'They help reduce demand for wild-harvested clownfish. That is the claim we make: captive-bred sourcing means your fish was produced in an aquarium breeding program instead of collected from a reef.',
  },
  {
    question: 'Does captive-bred mean disease-free?',
    answer:
      'No fish should be described as guaranteed disease-free. We recommend normal quarantine and careful acclimation for every new aquarium animal, including captive-bred clownfish.',
  },
  {
    question: 'Are designer morphs found naturally on reefs?',
    answer:
      'Designer morphs are the result of selective captive breeding for aquarium color and pattern. They should be presented as captive-bred aquarium strains, not as wild reef patterns.',
  },
]

useSiteSeo({
  title: pageTitle,
  description: pageDescription,
  ogImage: '/images/og-default.png',
})

useJsonLd([
  buildBreadcrumbSchema([
    { name: 'Home', url: siteUrl },
    { name: 'Why Captive-Bred Clownfish Matter', url: pageUrl },
  ]),
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Why Captive-Bred Clownfish Matter',
    description: pageDescription,
    url: pageUrl,
    publisher: buildOrganizationSchema(siteUrl),
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  },
])
</script>

<template>
  <article class="benefits-page">
    <div class="inner">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <NuxtLink to="/">Home</NuxtLink><span>/</span><span>Why captive-bred clownfish matter</span>
      </nav>

      <header class="hero">
        <p class="eyebrow">Reef-friendly aquarium choices</p>
        <h1>Why Captive-Bred Clownfish Matter</h1>
        <p>
          Captive-bred clownfish give reef keepers a beautiful, aquarium-ready way to enjoy
          ocellaris and designer morphs while reducing reliance on wild collection.
        </p>
        <div class="hero-actions">
          <NuxtLink to="/shop" class="btn btn-primary">Shop available clownfish</NuxtLink>
          <NuxtLink to="/guides/clownfish-care" class="btn btn-secondary">Read the care guide</NuxtLink>
        </div>
      </header>

      <section class="intro-panel" aria-labelledby="responsible-choice-heading">
        <div>
          <p class="section-kicker">The short version</p>
          <h2 id="responsible-choice-heading">A responsible choice for reef aquariums</h2>
        </div>
        <p>
          Wild-harvested marine ornamentals can connect aquarium keepers with reef ecosystems, but
          every wild fish also represents collection pressure on natural habitats. Captive-bred
          clownfish come from breeding systems instead. For a home aquarium, that means the fish you
          choose was born and raised for aquarium life rather than removed from a reef.
        </p>
      </section>

      <section class="benefit-grid" aria-label="Captive-bred clownfish benefits">
        <div v-for="card in benefitCards" :key="card.title" class="benefit-card">
          <h2>{{ card.title }}</h2>
          <p>{{ card.body }}</p>
        </div>
      </section>

      <section class="content-section" aria-labelledby="aquarium-born-heading">
        <div class="copy-block">
          <p class="section-kicker">Aquarium born</p>
          <h2 id="aquarium-born-heading">Raised for the conditions they will live in</h2>
          <p>
            Captive-bred clownfish are produced in controlled aquarium systems, introduced to
            prepared foods early, and handled by people before they reach a customer tank. That does
            not replace proper acclimation or quarantine, but it does make their source and early
            husbandry very different from wild collection.
          </p>
          <p>
            At Blue Eyed Clowns, the goal is simple: offer healthy, tank-bred clownfish with clear
            care expectations, safe shipping practices, and support for the reef keepers bringing
            them home.
          </p>
        </div>
        <aside class="callout" aria-label="Care note">
          <h3>Still quarantine new arrivals</h3>
          <p>
            Captive-bred is not the same as disease-free. We avoid that overstatement and encourage
            normal observation, quarantine, and patient acclimation for every new fish.
          </p>
        </aside>
      </section>

      <section class="content-section reverse" aria-labelledby="designer-morph-heading">
        <div class="copy-block">
          <p class="section-kicker">Designer morphs</p>
          <h2 id="designer-morph-heading">Selective patterns, not wild reef patterns</h2>
          <p>
            Many popular clownfish varieties in the aquarium trade are designer morphs: snowflake,
            storm, frostbite, bullet hole, and other selectively bred patterns. Their appeal comes
            from captive breeding work, not from collecting unusual wild reef fish.
          </p>
          <p>
            That distinction matters. It keeps conservation messaging honest and helps customers
            understand that a premium morph is a captive-bred aquarium strain selected for color,
            pattern, and consistency over generations.
          </p>
        </div>
        <div class="morph-note">
          <h3>How to talk about morphs</h3>
          <ul>
            <li>Say designer morphs are selectively bred captive patterns.</li>
            <li>Avoid implying storm or snowflake patterns are natural reef forms.</li>
            <li>Keep pattern appeal separate from conservation benefits.</li>
          </ul>
        </div>
      </section>

      <section class="faq-section" aria-labelledby="faq-heading">
        <p class="section-kicker">Customer questions</p>
        <h2 id="faq-heading">Captive-bred clownfish FAQ</h2>
        <div class="faq-list">
          <details v-for="item in faqs" :key="item.question" class="faq-item">
            <summary>{{ item.question }}</summary>
            <p>{{ item.answer }}</p>
          </details>
        </div>
      </section>

      <section class="cta-panel" aria-labelledby="cta-heading">
        <div>
          <p class="section-kicker">Choose your clownfish</p>
          <h2 id="cta-heading">Ready for an aquarium-born clownfish?</h2>
          <p>
            Browse current Blue Eyed Clowns availability, compare morph notes, and reach out if you
            need help choosing the right fish for your reef aquarium.
          </p>
        </div>
        <NuxtLink to="/shop" class="btn btn-primary">Shop available clownfish</NuxtLink>
      </section>
    </div>
  </article>
</template>

<style scoped>
.benefits-page {
  padding: 3.5rem 1.5rem 4.5rem;
  background: radial-gradient(circle at top, rgba(15, 23, 42, 0.92), #020617 54%, #000 100%);
  color: #e5e7eb;
}

.inner {
  max-width: 1040px;
  margin: 0 auto;
}

.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  color: #94a3b8;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.breadcrumb a {
  color: #7dd3fc;
  text-decoration: none;
}

.hero {
  max-width: 760px;
  padding: 1rem 0 2.25rem;
}

.eyebrow,
.section-kicker {
  color: #7dd3fc;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-size: 0.8rem;
}

h1 {
  font-size: clamp(2.35rem, 5vw, 4rem);
  line-height: 1.04;
  margin: 0.35rem 0 1rem;
}

h2,
h3,
p {
  margin-top: 0;
}

.hero p:last-of-type,
.intro-panel p,
.copy-block p,
.callout p,
.morph-note li,
.faq-item p,
.cta-panel p {
  color: #cbd5e1;
  line-height: 1.65;
}

.hero p:last-of-type {
  font-size: 1.12rem;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 1.5rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 0.78rem 1.28rem;
  font-weight: 700;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 1px solid transparent;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.1s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn-primary {
  background: linear-gradient(to right, #22d3ee, #0ea5e9);
  color: #0f172a;
}

.btn-secondary {
  color: #e5e7eb;
  border-color: rgba(148, 163, 184, 0.7);
}

.btn-secondary:hover {
  border-color: #7dd3fc;
  background-color: rgba(15, 23, 42, 0.78);
}

.intro-panel,
.benefit-card,
.callout,
.morph-note,
.faq-item,
.cta-panel {
  border: 1px solid rgba(125, 211, 252, 0.22);
  border-radius: 1.25rem;
  background: rgba(15, 23, 42, 0.7);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.5);
}

.intro-panel {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.25fr);
  gap: 1.5rem;
  padding: 1.5rem;
}

.intro-panel h2,
.faq-section h2,
.cta-panel h2 {
  font-size: clamp(1.5rem, 3vw, 2rem);
  margin-bottom: 0.75rem;
}

.benefit-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.benefit-card {
  padding: 1.35rem;
}

.benefit-card h2,
.copy-block h2,
.callout h3,
.morph-note h3 {
  font-size: 1.25rem;
  margin-bottom: 0.7rem;
}

.benefit-card p,
.intro-panel p,
.callout p,
.cta-panel p,
.faq-item p {
  margin-bottom: 0;
}

.content-section {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(260px, 0.65fr);
  gap: 1.25rem;
  align-items: start;
  margin-top: 2.25rem;
}

.content-section.reverse {
  grid-template-columns: minmax(260px, 0.65fr) minmax(0, 1.35fr);
}

.content-section.reverse .copy-block {
  order: 2;
}

.copy-block {
  padding: 0.25rem 0;
}

.callout,
.morph-note {
  padding: 1.25rem;
}

.morph-note ul {
  padding-left: 1.25rem;
  margin: 0;
}

.morph-note li + li {
  margin-top: 0.55rem;
}

.faq-section {
  margin-top: 2.5rem;
}

.faq-list {
  display: grid;
  gap: 0.8rem;
}

.faq-item {
  padding: 1rem 1.2rem;
}

.faq-item summary {
  cursor: pointer;
  color: #f8fafc;
  font-weight: 700;
}

.faq-item p {
  margin-top: 0.75rem;
}

.cta-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  margin-top: 2rem;
  padding: 1.5rem;
}

@media (max-width: 860px) {
  .intro-panel,
  .content-section,
  .content-section.reverse {
    grid-template-columns: 1fr;
  }

  .content-section.reverse .copy-block {
    order: 0;
  }

  .benefit-grid {
    grid-template-columns: 1fr;
  }

  .cta-panel {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
