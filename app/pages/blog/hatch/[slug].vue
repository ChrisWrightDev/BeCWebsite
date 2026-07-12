<template>
  <article class="hatch-page">
    <div class="hatch-inner">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <NuxtLink to="/">Home</NuxtLink>
        <span>/</span>
        <NuxtLink to="/blog">Journal</NuxtLink>
        <span>/</span>
        <NuxtLink to="/blog/welcome-to-the-blue-eyed-clowns-hatchery-journal">
          Hatchery journal
        </NuxtLink>
        <span>/</span>
        <span>{{ batch?.title || 'Hatch batch' }}</span>
      </nav>

      <div v-if="pending" class="state-panel">
        <p>Loading hatch progress…</p>
      </div>

      <div v-else-if="fetchError || !batch" class="state-panel error">
        <p>This hatch batch could not be found.</p>
        <NuxtLink to="/blog/welcome-to-the-blue-eyed-clowns-hatchery-journal" class="btn">
          Back to the journal post
        </NuxtLink>
      </div>

      <template v-else>
        <header class="hero">
          <p class="eyebrow">Hatch tracker</p>
          <div class="hero-badges">
            <span class="badge stage">{{ batch.stage_label }}</span>
            <span class="badge status" :class="batch.status">{{ batch.status_label }}</span>
          </div>
          <h1>{{ batch.title }}</h1>
          <p class="summary">{{ batch.summary }}</p>
          <dl class="facts">
            <div v-if="batch.pair_name">
              <dt>Pair</dt>
              <dd>{{ batch.pair_name }}</dd>
            </div>
            <div v-if="batch.parent_tank_label">
              <dt>Parent tank</dt>
              <dd>{{ batch.parent_tank_label }}</dd>
            </div>
            <div v-if="batch.current_tank_label">
              <dt>Current tank</dt>
              <dd>{{ batch.current_tank_label }}</dd>
            </div>
            <div v-if="batch.batch_code">
              <dt>Batch code</dt>
              <dd>{{ batch.batch_code }}</dd>
            </div>
          </dl>
        </header>

        <section class="lifecycle-panel" aria-labelledby="lifecycle-heading">
          <p class="eyebrow">Journey</p>
          <h2 id="lifecycle-heading">Eggs to reef-ready</h2>
          <ol class="lifecycle">
            <li
              v-for="step in batch.lifecycle"
              :key="step.key"
              class="lifecycle-step"
              :class="{ complete: step.complete, current: step.current, upcoming: step.upcoming }"
            >
              <span class="step-marker" aria-hidden="true"></span>
              <div class="step-copy">
                <strong>{{ step.label }}</strong>
                <span v-if="step.date_label">{{ step.date_label }}</span>
                <span v-else-if="step.current">In progress</span>
                <span v-else class="muted">Pending</span>
                <span v-if="step.count != null" class="step-count">{{ step.count }} fish</span>
              </div>
            </li>
          </ol>
        </section>

        <section class="counts-panel" aria-label="Batch counts">
          <div v-if="batch.initial_egg_count != null" class="count-card">
            <span class="count-label">Eggs laid</span>
            <strong>{{ batch.initial_egg_count }}</strong>
          </div>
          <div v-if="batch.hatch_count != null" class="count-card">
            <span class="count-label">Hatched</span>
            <strong>{{ batch.hatch_count }}</strong>
          </div>
          <div v-if="batch.current_count != null" class="count-card">
            <span class="count-label">Current count</span>
            <strong>{{ batch.current_count }}</strong>
          </div>
          <div v-if="batch.days_to_hatch != null" class="count-card">
            <span class="count-label">Days to hatch</span>
            <strong>{{ batch.days_to_hatch }}</strong>
          </div>
          <div v-if="batch.survival_rate_percent != null" class="count-card">
            <span class="count-label">Survival</span>
            <strong>{{ batch.survival_rate_percent }}%</strong>
          </div>
        </section>

        <section v-if="batch.notes" class="notes-panel">
          <h2>Hatchery notes</h2>
          <p>{{ batch.notes }}</p>
        </section>

        <section
          v-if="batch.transfer_history.length"
          class="history-panel"
          aria-labelledby="history-heading"
        >
          <h2 id="history-heading">Move history</h2>
          <ol class="history-list">
            <li v-for="(entry, index) in batch.transfer_history" :key="`${entry.date}-${index}`">
              <time v-if="entry.date_label">{{ entry.date_label }}</time>
              <p>
                <template v-if="entry.from || entry.to">
                  {{ entry.from || '—' }} → {{ entry.to || '—' }}
                </template>
                <template v-if="entry.count != null"> · {{ entry.count }} fish</template>
              </p>
              <p v-if="entry.notes" class="history-notes">{{ entry.notes }}</p>
            </li>
          </ol>
        </section>

        <div class="footer-actions">
          <NuxtLink
            to="/blog/welcome-to-the-blue-eyed-clowns-hatchery-journal"
            class="btn btn-outline"
          >
            ← Back to journal post
          </NuxtLink>
          <NuxtLink to="/shop" class="btn btn-primary">Shop available clownfish</NuxtLink>
        </div>
      </template>
    </div>
  </article>
</template>

<script setup>
const route = useRoute()

const { data: batch, pending, error: fetchError } = await useAsyncData(
  `hatch-batch-${route.params.slug}`,
  () => $fetch(`/api/hatchery/batches/${route.params.slug}`)
)

useSiteSeo({
  title: batch.value?.title || 'Hatch batch',
  description:
    batch.value?.summary ||
    'Track Blue-Eyed Clowns hatch batches from eggs to reef-ready adults.',
})
</script>

<style scoped>
.hatch-page {
  padding: 3.5rem 1.5rem 4.5rem;
  background:
    radial-gradient(circle at top left, rgba(14, 165, 233, 0.16), transparent 30rem),
    #020617;
  color: #e5e7eb;
  min-height: 70vh;
}

.hatch-inner {
  max-width: 860px;
  margin: 0 auto;
}

.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-bottom: 1.5rem;
  color: #94a3b8;
  font-size: 0.9rem;
}

.breadcrumb a {
  color: #7dd3fc;
  text-decoration: none;
}

.eyebrow {
  margin: 0 0 0.7rem;
  color: #67e8f9;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.hero-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.85rem;
}

.badge {
  border-radius: 999px;
  padding: 0.35rem 0.7rem;
  font-size: 0.78rem;
  font-weight: 800;
  border: 1px solid rgba(34, 211, 238, 0.28);
  background: rgba(8, 47, 73, 0.7);
  color: #bae6fd;
}

.badge.status.completed {
  border-color: rgba(148, 163, 184, 0.4);
  color: #cbd5e1;
}

.badge.status.watch {
  border-color: rgba(251, 191, 36, 0.45);
  color: #fde68a;
}

h1,
h2,
p {
  margin-top: 0;
}

.hero h1 {
  color: #f8fafc;
  font-size: clamp(2rem, 5vw, 3.4rem);
  line-height: 1.05;
  letter-spacing: -0.04em;
  margin-bottom: 0.9rem;
}

.summary {
  color: #cbd5e1;
  font-size: 1.1rem;
  line-height: 1.7;
  max-width: 40rem;
}

.facts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.9rem;
  margin: 1.5rem 0 0;
}

.facts div {
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 1rem;
  padding: 0.9rem 1rem;
  background: rgba(15, 23, 42, 0.72);
}

.facts dt {
  color: #67e8f9;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 0.35rem;
}

.facts dd {
  margin: 0;
  color: #f8fafc;
  font-weight: 700;
}

.lifecycle-panel,
.notes-panel,
.history-panel,
.state-panel {
  margin-top: 2rem;
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 1.35rem;
  padding: 1.4rem;
  background: rgba(15, 23, 42, 0.72);
}

.lifecycle-panel h2,
.notes-panel h2,
.history-panel h2 {
  color: #f8fafc;
  margin-bottom: 1rem;
}

.lifecycle {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.85rem;
}

.lifecycle-step {
  display: grid;
  grid-template-columns: 1.1rem 1fr;
  gap: 0.85rem;
  align-items: start;
}

.step-marker {
  width: 0.85rem;
  height: 0.85rem;
  margin-top: 0.35rem;
  border-radius: 999px;
  border: 2px solid rgba(148, 163, 184, 0.45);
  background: transparent;
}

.lifecycle-step.complete .step-marker {
  border-color: #22d3ee;
  background: #22d3ee;
}

.lifecycle-step.current .step-marker {
  border-color: #fbbf24;
  background: #fbbf24;
  box-shadow: 0 0 0 4px rgba(251, 191, 36, 0.2);
}

.step-copy {
  display: grid;
  gap: 0.15rem;
}

.step-copy strong {
  color: #f8fafc;
}

.step-copy span {
  color: #cbd5e1;
  font-size: 0.92rem;
}

.step-copy .muted {
  color: #64748b;
}

.step-count {
  color: #a5f3fc !important;
  font-weight: 700;
}

.counts-panel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.85rem;
  margin-top: 1.25rem;
}

.count-card {
  border: 1px solid rgba(34, 211, 238, 0.22);
  border-radius: 1rem;
  padding: 1rem;
  background: rgba(8, 47, 73, 0.45);
  display: grid;
  gap: 0.35rem;
}

.count-label {
  color: #67e8f9;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.count-card strong {
  color: #f8fafc;
  font-size: 1.55rem;
}

.notes-panel p,
.history-notes {
  color: #cbd5e1;
  line-height: 1.7;
}

.history-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 1rem;
}

.history-list li {
  border-top: 1px solid rgba(148, 163, 184, 0.18);
  padding-top: 0.9rem;
}

.history-list li:first-child {
  border-top: 0;
  padding-top: 0;
}

.history-list time {
  color: #67e8f9;
  font-size: 0.8rem;
  font-weight: 800;
}

.history-list p {
  margin: 0.25rem 0 0;
  color: #e2e8f0;
}

.footer-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  margin-top: 2rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 0.82rem 1.15rem;
  font-weight: 800;
  text-decoration: none;
  border: 1px solid transparent;
}

.btn-primary {
  background: linear-gradient(135deg, #22d3ee, #38bdf8);
  color: #082f49;
}

.btn-outline {
  color: #e0f2fe;
  border-color: rgba(148, 163, 184, 0.35);
  background: rgba(15, 23, 42, 0.68);
}

.state-panel.error {
  border-color: rgba(248, 113, 113, 0.45);
}
</style>
