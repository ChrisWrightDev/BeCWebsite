<script setup>
useSiteSeo({
  title: 'Shipping Live Clownfish | Overnight Live-Fish Shipping Guide',
  description:
    'What to expect when Blue-Eyed Clowns ships live captive-bred clownfish: shipping days, weather holds, arrival photos, acclimation, and health guarantee support.',
})
</script>

<template>
  <article class="guide-page">
    <div class="inner">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <NuxtLink to="/">Home</NuxtLink><span>/</span><span>Shipping live clownfish</span>
      </nav>
      <header class="hero">
        <p class="eyebrow">Live-fish shipping</p>
        <h1>Shipping live clownfish: what to expect</h1>
        <p>We place shipping and guarantee details close to the purchase flow because live-fish buyers deserve clear expectations before checkout.</p>
      </header>

      <section class="steps">
        <div class="step"><strong>1. Order confirmation</strong><p>We confirm the fish is active, feeding, and safe to send with current weather and carrier timing.</p></div>
        <div class="step"><strong>2. Overnight shipping</strong><p>Live clownfish ship Monday through Wednesday only to reduce weekend delays.</p></div>
        <div class="step"><strong>3. Arrival support</strong><p>Inspect the unopened bag right away and email photos quickly if anything looks wrong.</p></div>
        <div class="step"><strong>4. Acclimation</strong><p>Temperature match, drip-acclimate slowly, and keep lights dim while the clownfish settles in.</p></div>
      </section>

      <section class="cta-panel">
        <div>
          <h2>Questions before checkout?</h2>
          <p>Ask about weather holds, local pickup, wholesale availability, or a specific fish.</p>
        </div>
        <NuxtLink to="/contact#faq" class="btn">Shipping FAQ</NuxtLink>
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
.hero p:last-child, .step p, .cta-panel p { color: #cbd5e1; line-height: 1.6; }
.steps { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; margin-top: 2rem; }
.step, .cta-panel { border: 1px solid rgba(125, 211, 252, .22); border-radius: 1.25rem; background: rgba(15, 23, 42, .7); padding: 1.25rem; }
.step strong { color: #e0f2fe; }
.step p, .cta-panel p { margin-bottom: 0; }
.cta-panel { margin-top: 1.5rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
h2 { margin: 0 0 .5rem; }
.btn { display: inline-flex; border-radius: 999px; padding: .75rem 1.25rem; background: linear-gradient(to right, #22d3ee, #0ea5e9); color: #0f172a; font-weight: 700; text-decoration: none; text-transform: uppercase; letter-spacing: .05em; }
@media (max-width: 720px) { .steps { grid-template-columns: 1fr; } .cta-panel { align-items: flex-start; flex-direction: column; } }
</style>
