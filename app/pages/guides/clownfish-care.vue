<script setup>
useSiteSeo({
  title: 'Captive-Bred Ocellaris Clownfish Care Guide',
  description:
    'Learn how to care for captive-bred ocellaris clownfish: tank size, acclimation, diet, pairing, temperament, and reef-safe husbandry tips.',
})
</script>

<template>
  <article class="guide-page">
    <div class="inner">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <NuxtLink to="/">Home</NuxtLink><span>/</span><span>Clownfish care guide</span>
      </nav>
      <header class="hero">
        <p class="eyebrow">Clownfish Academy</p>
        <h1>Captive-bred ocellaris clownfish care guide</h1>
        <p>
          Tank-raised clownfish are hardy, reef-safe, and a great fit for new and experienced reef keepers when acclimated and fed correctly.
        </p>
      </header>

      <section class="grid">
        <div class="card">
          <h2>Tank size and setup</h2>
          <p>Use an established, cycled saltwater aquarium. A single ocellaris or compatible pair does well in many 20+ gallon reef systems with stable salinity, temperature, and hiding places.</p>
        </div>
        <div class="card">
          <h2>Diet</h2>
          <p>Offer quality prepared marine foods in small portions. Captive-bred fish usually adapt quickly because they are already feeding before shipping.</p>
        </div>
        <div class="card">
          <h2>Acclimation</h2>
          <p>Float the sealed bag to temperature match, drip-acclimate slowly, then net the fish into the aquarium. Keep lights dim during the first few hours.</p>
        </div>
        <div class="card">
          <h2>Pairing and temperament</h2>
          <p>Ocellaris clownfish are generally peaceful to semi-aggressive. Introduce pairs carefully and ask us about compatible singles when building a pair.</p>
        </div>
      </section>

      <section class="cta-panel">
        <div>
          <h2>Ready to choose a clownfish?</h2>
          <p>Compare available captive-bred ocellaris, snowflake, storm, and designer morphs.</p>
        </div>
        <NuxtLink to="/shop" class="btn">Shop clownfish</NuxtLink>
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
.hero p:last-child { color: #cbd5e1; font-size: 1.08rem; line-height: 1.6; max-width: 44rem; }
.grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; margin-top: 2rem; }
.card, .cta-panel { border: 1px solid rgba(125, 211, 252, .22); border-radius: 1.25rem; background: rgba(15, 23, 42, .7); padding: 1.35rem; }
h2 { margin: 0 0 .75rem; font-size: 1.25rem; }
p { line-height: 1.6; }
.card p, .cta-panel p { color: #cbd5e1; margin: 0; }
.cta-panel { margin-top: 1.5rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.btn { display: inline-flex; border-radius: 999px; padding: .75rem 1.25rem; background: linear-gradient(to right, #22d3ee, #0ea5e9); color: #0f172a; font-weight: 700; text-decoration: none; text-transform: uppercase; letter-spacing: .05em; }
@media (max-width: 720px) { .grid { grid-template-columns: 1fr; } .cta-panel { flex-direction: column; align-items: flex-start; } }
</style>
