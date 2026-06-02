<script setup>
const morphs = [
  { name: 'Standard Ocellaris', slug: 'standard-ocellaris', note: 'Classic orange-and-white, hardy beginner choice.' },
  { name: 'Mocha Ocellaris', slug: 'mocha-ocellaris', note: 'Coffee-brown coloration with ocellaris temperament.' },
  { name: 'Snowflakes', slug: 'snowflakes', note: 'Distinctive white patterning; each fish is visually unique.' },
  { name: 'Frostbite/Bullethole', slug: 'frostbite-bullethole', note: 'High-contrast designer pattern for collectors.' },
  { name: 'Snowstorm', slug: 'snowstorm', note: 'Premium storm-line look with strong white coverage.' },
  { name: 'Blue Ghost Storm', slug: 'blue-ghost-storm', note: 'High-end designer morph with icy blue accents.' },
]

useSiteSeo({
  title: 'Clownfish Morph Guide | Ocellaris, Snowflake, Storm & Designer Morphs',
  description:
    'Compare captive-bred clownfish morphs including Standard Ocellaris, Mocha, Snowflake, Frostbite, Snowstorm, and Blue Ghost Storm.',
})
</script>

<template>
  <article class="guide-page">
    <div class="inner">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <NuxtLink to="/">Home</NuxtLink><span>/</span><span>Clownfish morph guide</span>
      </nav>
      <header class="hero">
        <p class="eyebrow">Morph comparison</p>
        <h1>Clownfish morph guide</h1>
        <p>Use this guide to compare beginner-friendly, designer, and premium captive-bred clownfish before choosing a fish for your reef aquarium.</p>
      </header>

      <section class="morph-grid" aria-label="Clownfish morphs">
        <NuxtLink v-for="morph in morphs" :key="morph.slug" :to="`/shop/${morph.slug}`" class="morph-card">
          <h2>{{ morph.name }}</h2>
          <p>{{ morph.note }}</p>
          <span>View available fish →</span>
        </NuxtLink>
      </section>

      <section class="comparison">
        <h2>Quick comparisons</h2>
        <ul>
          <li><strong>Standard vs Mocha:</strong> both are hardy starter choices; Mocha adds richer brown coloration.</li>
          <li><strong>Snowflake vs Frostbite:</strong> both feature white designer patterning; Frostbite is generally the more premium look.</li>
          <li><strong>Storm vs Snowstorm:</strong> storm-line morphs emphasize dramatic white coverage for showpiece aquariums.</li>
        </ul>
      </section>
    </div>
  </article>
</template>

<style scoped>
.guide-page { padding: 3.5rem 1.5rem 4.5rem; background: radial-gradient(circle at top, rgba(15, 23, 42, 0.9), #020617 55%, #000 100%); color: #e5e7eb; }
.inner { max-width: 960px; margin: 0 auto; }
.breadcrumb { display: flex; gap: .45rem; color: #94a3b8; font-size: .9rem; margin-bottom: 1.5rem; }
.breadcrumb a { color: #7dd3fc; text-decoration: none; }
.eyebrow { color: #7dd3fc; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; font-size: .8rem; }
h1 { font-size: clamp(2rem, 4vw, 3rem); line-height: 1.08; margin: .3rem 0 1rem; }
.hero p:last-child, .comparison li { color: #cbd5e1; line-height: 1.6; }
.morph-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; margin-top: 2rem; }
.morph-card, .comparison { border: 1px solid rgba(125, 211, 252, .22); border-radius: 1.25rem; background: rgba(15, 23, 42, .7); padding: 1.25rem; }
.morph-card { color: inherit; text-decoration: none; display: grid; gap: .65rem; }
.morph-card:hover { border-color: #7dd3fc; }
h2 { margin: 0; font-size: 1.2rem; }
.morph-card p { color: #cbd5e1; margin: 0; line-height: 1.5; }
.morph-card span { color: #7dd3fc; font-weight: 700; }
.comparison { margin-top: 1.5rem; }
.comparison ul { margin: .75rem 0 0; padding-left: 1.25rem; }
@media (max-width: 820px) { .morph-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 640px) { .morph-grid { grid-template-columns: 1fr; } }
</style>
