<template>
  <section class="page">
    <div class="inner">
      <header class="header">
        <h1>About Blue Eyed Clowns</h1>
        <p>
          Welcome to Blue Eyed Clowns, where passion for marine life meets quality aquaculture. We
          specialize in breeding and providing the healthiest, most vibrant clownfish for aquarium
          enthusiasts.
        </p>
      </header>

      <section class="owners">
        <h2>Meet the founders</h2>
        <div class="owners-grid">
          <article class="owner-card">
            <div class="owner-avatar" aria-hidden="true">CW</div>
            <h3>Chris Wright</h3>
            <p class="owner-role">Co-Founder</p>
            <p class="owner-bio">
              Marine biologist with over 15 years of experience in aquaculture and clownfish
              breeding. Chris's expertise in fish health and genetics ensures every clownfish meets
              our high standards.
            </p>
          </article>
          <article class="owner-card">
            <div class="owner-avatar" aria-hidden="true">MK</div>
            <h3>Mike Kay</h3>
            <p class="owner-role">Co-Founder</p>
            <p class="owner-bio">
              Aquarium systems specialist with a passion for sustainable marine practices. Mike
              oversees our breeding facilities and ensures optimal conditions for all our fish.
            </p>
          </article>
        </div>
      </section>

      <section class="mission">
        <h2>Our mission</h2>
        <p>
          At Blue Eyed Clowns, we're committed to providing healthy, tank-bred clownfish that bring
          joy to aquarium enthusiasts while supporting sustainable marine practices. Every fish is
          carefully bred, raised with love, and prepared for a lifetime in your aquarium.
        </p>
      </section>

      <div class="grid">
        <article>
          <h2>Why tank-raised clownfish?</h2>
          <p>
            Tank-raised fish adapt more quickly to aquarium life, accept prepared foods easily, and
            put less pressure on wild reefs. Every clownfish we ship is born and raised in our
            systems.
          </p>
          <p>
            Our broodstock lines are carefully selected for color, pattern, and temperament. We
            track lineage and pairings so we can consistently produce the patterns our customers
            love — from classic ocellaris to high-end designer morphs.
          </p>
        </article>

        <article>
          <h2>Our water and husbandry standards</h2>
          <p>
            Stable, clean water is everything. Our systems are filtered with oversized biological
            and mechanical filtration, redundant heaters, and continuous monitoring of temperature,
            salinity, and pH.
          </p>
          <p>
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
}

.owners {
  margin-top: 2.5rem;
}

.owners h2 {
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

.owner-avatar {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #0ea5e9, #22d3ee);
  color: #0f172a;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.02em;
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
  margin-bottom: 0.75rem;
}

.owner-bio {
  font-size: 0.95rem;
  color: #cbd5e1;
  line-height: 1.5;
  margin: 0;
}

.mission {
  margin-top: 2.5rem;
}

.mission h2 {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
}

.mission p {
  color: #cbd5e1;
  line-height: 1.6;
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
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>

