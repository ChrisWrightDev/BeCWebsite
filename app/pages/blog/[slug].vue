<template>
  <article class="post-page">
    <div class="post-inner">
      <NuxtLink to="/blog" class="back-link">← Back to the hatchery journal</NuxtLink>

      <div v-if="pending" class="state-panel">
        <p>Loading blog post…</p>
      </div>

      <div v-else-if="fetchError" class="state-panel error">
        <p>This blog post could not be loaded.</p>
        <NuxtLink to="/blog" class="btn">View all posts</NuxtLink>
      </div>

      <template v-else-if="post">
        <header class="post-hero">
          <p class="eyebrow">{{ post.category }}</p>
          <h1>{{ post.title }}</h1>
          <div class="post-meta">
            <span>{{ post.author_name }}</span>
            <span aria-hidden="true">•</span>
            <time :datetime="post.published_at || undefined">{{ formatBlogDate(post.published_at) }}</time>
            <span aria-hidden="true">•</span>
            <span>{{ readingTimeLabel(post) }}</span>
          </div>
          <p class="excerpt">{{ post.excerpt }}</p>
        </header>

        <img
          v-if="post.featured_image_url"
          :src="post.featured_image_url"
          :alt="blogPostImageAlt(post)"
          class="hero-image"
          width="1120"
          height="520"
          loading="eager"
          decoding="async"
        />

        <section class="post-body" aria-label="Blog post content">
          <p v-for="(paragraph, index) in paragraphs" :key="index">{{ paragraph }}</p>
        </section>

        <footer class="post-footer" v-if="post.tags.length">
          <NuxtLink
            v-for="tag in post.tags"
            :key="tag"
            :to="`/blog/tag/${slugifyTag(tag)}`"
            class="tag"
          >
            #{{ tag }}
          </NuxtLink>
        </footer>

        <section
          v-if="showHatchTracker"
          id="hatch-tracker"
          class="hatch-tracker"
          aria-labelledby="hatch-tracker-heading"
        >
          <div class="hatch-intro">
            <p class="eyebrow">Live hatch board</p>
            <h2 id="hatch-tracker-heading">Track every clutch from eggs to adults</h2>
            <p>
              Follow current Blue-Eyed Clowns hatches through eggs, hatch, first feed, transfer,
              grow-out, and ready-for-sale. Open any batch for the full journey timeline.
            </p>
          </div>

          <div v-if="batchesPending" class="state-panel">
            <p>Loading hatch batches…</p>
          </div>

          <div v-else-if="batchesError" class="state-panel error">
            <p>We could not load hatch batches right now.</p>
            <button type="button" class="btn retry" @click="refreshBatches()">Try again</button>
          </div>

          <template v-else-if="batches?.length">
            <div class="stage-filters" role="group" aria-label="Filter hatches by stage">
              <button
                v-for="filter in stageFilters"
                :key="filter.key"
                type="button"
                class="stage-filter"
                :class="{ active: selectedStage === filter.key }"
                :aria-pressed="selectedStage === filter.key"
                @click="selectedStage = filter.key"
              >
                {{ filter.label }}
                <span class="filter-count">{{ filter.count }}</span>
              </button>
            </div>

            <div class="hatch-grid">
              <article v-for="batch in filteredBatches" :key="batch.id" class="hatch-card">
                <div class="hatch-card-top">
                  <div class="hatch-badges">
                    <span class="badge stage">{{ batch.stage_label }}</span>
                    <span class="badge status" :class="batch.status">{{ batch.status_label }}</span>
                  </div>
                  <p v-if="batch.pair_name" class="pair-name">{{ batch.pair_name }}</p>
                  <h3>
                    <NuxtLink :to="`/blog/hatch/${batch.slug}`">{{ batch.title }}</NuxtLink>
                  </h3>
                  <p class="hatch-summary">{{ batch.summary }}</p>
                </div>

                <ol class="mini-lifecycle" aria-label="Lifecycle progress">
                  <li
                    v-for="step in batch.lifecycle"
                    :key="step.key"
                    :class="{ complete: step.complete, current: step.current }"
                    :title="step.date_label || step.label"
                  >
                    <span class="sr-only">
                      {{ step.label }}
                      <template v-if="step.date_label"> — {{ step.date_label }}</template>
                      <template v-else-if="step.current"> — in progress</template>
                      <template v-else> — pending</template>
                    </span>
                    <span aria-hidden="true">{{ step.label }}</span>
                  </li>
                </ol>

                <div class="hatch-meta">
                  <span v-if="batch.egg_laid_date_label">Laid {{ batch.egg_laid_date_label }}</span>
                  <span v-else-if="batch.hatch_date_label">Hatched {{ batch.hatch_date_label }}</span>
                  <span v-if="batch.current_count != null">{{ batch.current_count }} fish now</span>
                  <span v-else-if="batch.initial_egg_count != null">
                    {{ batch.initial_egg_count }} eggs
                  </span>
                  <span v-if="batch.current_tank_label">Tank {{ batch.current_tank_label }}</span>
                </div>

                <NuxtLink :to="`/blog/hatch/${batch.slug}`" class="hatch-link">
                  View full journey →
                </NuxtLink>
              </article>
            </div>
          </template>

          <div v-else class="state-panel">
            <p>No public hatch batches are listed yet. Check back as new clutches go public.</p>
          </div>
        </section>
      </template>
    </div>
  </article>
</template>

<script setup>
import { blogPostImageAlt, formatBlogDate, readingTimeLabel, slugifyTag } from '~/utils/blog'

const WELCOME_SLUG = 'welcome-to-the-blue-eyed-clowns-hatchery-journal'

const route = useRoute()

const { data: post, pending, error: fetchError } = await useAsyncData(
  `blog-post-${route.params.slug}`,
  () => $fetch(`/api/blog/${route.params.slug}`)
)

const showHatchTracker = computed(
  () => post.value?.slug === WELCOME_SLUG || route.params.slug === WELCOME_SLUG
)

const {
  data: batches,
  pending: batchesPending,
  error: batchesError,
  refresh: refreshBatches,
} = await useAsyncData(
  'hatch-batches-welcome-post',
  () => $fetch('/api/hatchery/batches'),
  { watch: [showHatchTracker], immediate: true }
)

const selectedStage = ref('all')

const stageFilters = computed(() => {
  const list = batches.value || []
  const counts = list.reduce((acc, batch) => {
    const key = batch.stage || 'eggs'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  return [
    { key: 'all', label: 'All stages', count: list.length },
    { key: 'eggs', label: 'Eggs', count: counts.eggs || 0 },
    { key: 'hatched', label: 'Hatched', count: counts.hatched || 0 },
    { key: 'transfer', label: 'Transfer', count: counts.transfer || 0 },
    { key: 'juvenile', label: 'Grow-out', count: counts.juvenile || 0 },
  ].filter((filter) => filter.key === 'all' || filter.count > 0)
})

const filteredBatches = computed(() => {
  const list = batches.value || []
  if (selectedStage.value === 'all') return list
  return list.filter((batch) => batch.stage === selectedStage.value)
})

useSiteSeo({
  title: post.value?.title || 'Blog Post',
  description: post.value?.excerpt || 'Blue-Eyed Clowns hatchery journal post.',
})

const paragraphs = computed(() => {
  const content = post.value?.content || ''
  return content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
})
</script>

<style scoped>
.post-page {
  padding: 3.5rem 1.5rem 4.5rem;
  min-height: 70vh;
  background:
    radial-gradient(circle at top, rgba(14, 165, 233, 0.14), transparent 34rem),
    #020617;
  color: #e5e7eb;
}

.post-inner {
  max-width: 880px;
  margin: 0 auto;
}

.back-link {
  display: inline-flex;
  margin-bottom: 2rem;
  color: #67e8f9;
  font-weight: 800;
  text-decoration: none;
}

.post-hero {
  margin-bottom: 1.5rem;
}

.eyebrow {
  margin: 0 0 0.7rem;
  color: #67e8f9;
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

h1,
h2,
p {
  margin-top: 0;
}

h1 {
  margin-bottom: 1rem;
  color: #f8fafc;
  font-size: clamp(2.1rem, 6vw, 4rem);
  line-height: 0.98;
  letter-spacing: -0.045em;
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #a5f3fc;
  font-size: 0.9rem;
  font-weight: 800;
}

.excerpt {
  color: #cbd5e1;
  font-size: 1.18rem;
  line-height: 1.75;
}

.hero-image {
  width: 100%;
  max-height: 520px;
  object-fit: cover;
  border-radius: 1.35rem;
  border: 1px solid rgba(148, 163, 184, 0.22);
  margin-bottom: 2rem;
}

.post-body {
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 1.35rem;
  padding: clamp(1.35rem, 4vw, 2.25rem);
  background: rgba(15, 23, 42, 0.72);
}

.post-body p {
  color: #dbeafe;
  font-size: 1.05rem;
  line-height: 1.9;
}

.post-body p:last-child {
  margin-bottom: 0;
}

.post-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.2rem;
}

.tag {
  border: 1px solid rgba(34, 211, 238, 0.24);
  border-radius: 999px;
  padding: 0.35rem 0.65rem;
  color: #bae6fd;
  background: rgba(8, 47, 73, 0.55);
  font-size: 0.8rem;
  font-weight: 800;
  text-decoration: none;
}

.tag:hover {
  border-color: rgba(103, 232, 249, 0.55);
  color: #ecfeff;
  background: rgba(8, 47, 73, 0.85);
}

.state-panel {
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 1.35rem;
  padding: 1.4rem;
  background: rgba(15, 23, 42, 0.72);
}

.state-panel.error {
  border-color: rgba(248, 113, 113, 0.45);
}

.btn {
  display: inline-flex;
  border-radius: 999px;
  padding: 0.75rem 1rem;
  color: #082f49;
  background: linear-gradient(135deg, #22d3ee, #38bdf8);
  font-weight: 900;
  text-decoration: none;
  border: 0;
  cursor: pointer;
}

.btn.retry {
  margin-top: 0.85rem;
}

.hatch-tracker {
  margin-top: 2.75rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(148, 163, 184, 0.2);
}

.hatch-intro {
  margin-bottom: 1.25rem;
}

.hatch-intro h2 {
  color: #f8fafc;
  font-size: clamp(1.55rem, 4vw, 2.2rem);
  margin-bottom: 0.7rem;
}

.hatch-intro p {
  color: #cbd5e1;
  line-height: 1.7;
  max-width: 40rem;
}

.stage-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  margin-bottom: 1.15rem;
}

.stage-filter {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  border: 1px solid rgba(148, 163, 184, 0.28);
  border-radius: 999px;
  padding: 0.45rem 0.8rem;
  color: #cbd5e1;
  background: rgba(15, 23, 42, 0.72);
  font-weight: 800;
  font-size: 0.82rem;
  cursor: pointer;
}

.stage-filter.active {
  border-color: transparent;
  color: #082f49;
  background: linear-gradient(135deg, #22d3ee, #38bdf8);
}

.filter-count {
  opacity: 0.8;
}

.hatch-grid {
  display: grid;
  gap: 1rem;
}

.hatch-card {
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 1.35rem;
  background: rgba(15, 23, 42, 0.72);
  box-shadow: 0 22px 70px rgba(0, 0, 0, 0.24);
  display: grid;
  gap: 1rem;
  padding: 1.2rem;
}

.hatch-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-bottom: 0.65rem;
}

.badge {
  border-radius: 999px;
  padding: 0.28rem 0.6rem;
  font-size: 0.72rem;
  font-weight: 800;
  border: 1px solid rgba(34, 211, 238, 0.28);
  background: rgba(8, 47, 73, 0.7);
  color: #bae6fd;
}

.badge.status.watch {
  border-color: rgba(251, 191, 36, 0.45);
  color: #fde68a;
}

.badge.status.completed {
  border-color: rgba(148, 163, 184, 0.4);
  color: #cbd5e1;
}

.pair-name {
  margin: 0 0 0.35rem;
  color: #67e8f9;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hatch-card h3 {
  margin: 0 0 0.55rem;
  color: #f8fafc;
  font-size: 1.2rem;
  line-height: 1.2;
}

.hatch-card h3 a {
  color: inherit;
  text-decoration: none;
}

.hatch-card h3 a:hover {
  color: #67e8f9;
}

.hatch-summary {
  margin: 0;
  color: #cbd5e1;
  line-height: 1.6;
  font-size: 0.95rem;
}

.mini-lifecycle {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 0.3rem;
  margin: 0;
  padding: 0;
}

.mini-lifecycle li {
  border-radius: 0.55rem;
  padding: 0.45rem 0.25rem;
  text-align: center;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: #64748b;
  background: rgba(2, 6, 23, 0.55);
  border: 1px solid rgba(148, 163, 184, 0.14);
}

.mini-lifecycle li.complete {
  color: #082f49;
  background: rgba(34, 211, 238, 0.85);
  border-color: transparent;
}

.mini-lifecycle li.current {
  color: #1c1917;
  background: rgba(251, 191, 36, 0.92);
  border-color: transparent;
}

.hatch-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  color: #a5f3fc;
  font-size: 0.8rem;
  font-weight: 700;
}

.hatch-link {
  color: #7dd3fc;
  font-weight: 800;
  text-decoration: none;
}

.hatch-link:hover {
  color: #ecfeff;
}

@media (max-width: 720px) {
  .mini-lifecycle {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
