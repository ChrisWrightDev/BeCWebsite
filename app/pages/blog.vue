<template>
  <section class="blog-page">
    <div class="blog-inner">
      <header class="blog-hero">
        <p class="eyebrow">Hatchery Journal</p>
        <h1>Clownfish care, grow-out notes, and reef-safe advice</h1>
        <p class="hero-copy">
          Follow the Blue-Eyed Clowns hatchery as we document captive-bred clownfish care,
          morph development, shipping prep, and the day-to-day work behind healthy reef fish.
        </p>
        <div class="hero-actions">
          <NuxtLink to="/shop" class="btn btn-primary">Shop clownfish</NuxtLink>
          <NuxtLink to="/contact" class="btn btn-outline">Ask a care question</NuxtLink>
        </div>
      </header>

      <div v-if="pending" class="state-panel">
        <p>Loading the hatchery journal…</p>
      </div>

      <div v-else-if="fetchError" class="state-panel error">
        <p>We could not load blog posts right now.</p>
        <button type="button" class="retry-button" @click="refresh()">Try again</button>
      </div>

      <template v-else>
        <section v-if="featuredPost" class="featured-section" aria-labelledby="featured-blog-heading">
          <div class="section-heading-row">
            <div>
              <p class="eyebrow">Featured</p>
              <h2 id="featured-blog-heading">Start here</h2>
            </div>
          </div>

          <article class="featured-card">
            <div class="featured-image-wrap">
              <img
                v-if="featuredPost.featured_image_url"
                :src="featuredPost.featured_image_url"
                :alt="blogPostImageAlt(featuredPost)"
                class="featured-image"
                width="560"
                height="360"
                loading="eager"
                decoding="async"
              />
              <div v-else class="featured-image placeholder-image">
                <span>Blue-Eyed Clowns Journal</span>
              </div>
            </div>

            <div class="featured-content">
              <div class="post-meta">
                <span>{{ featuredPost.category }}</span>
                <span aria-hidden="true">•</span>
                <time :datetime="featuredPost.published_at || undefined">
                  {{ formatBlogDate(featuredPost.published_at) }}
                </time>
                <span aria-hidden="true">•</span>
                <span>{{ readingTimeLabel(featuredPost) }}</span>
              </div>
              <h3>{{ featuredPost.title }}</h3>
              <p>{{ featuredPost.excerpt }}</p>
              <div class="tag-row" v-if="featuredPost.tags.length">
                <span v-for="tag in featuredPost.tags" :key="tag" class="tag">#{{ tag }}</span>
              </div>
            </div>
          </article>
        </section>

        <section class="content-grid" aria-label="Blog posts and topics">
          <aside class="topic-panel">
            <p class="eyebrow">Explore</p>
            <h2>Topics we’ll keep building</h2>
            <ul class="topic-list">
              <li v-for="topic in topicCards" :key="topic.title">
                <strong>{{ topic.title }}</strong>
                <span>{{ topic.copy }}</span>
              </li>
            </ul>

            <div v-if="categories.length" class="category-panel">
              <h3>Current categories</h3>
              <div class="category-chips">
                <span v-for="category in categories" :key="category" class="category-chip">
                  {{ category }}
                </span>
              </div>
            </div>
          </aside>

          <section class="posts-section" aria-labelledby="latest-posts-heading">
            <div class="section-heading-row">
              <div>
                <p class="eyebrow">Latest posts</p>
                <h2 id="latest-posts-heading">From the hatchery</h2>
              </div>
              <span v-if="posts.length" class="post-count">{{ posts.length }} post{{ posts.length === 1 ? '' : 's' }}</span>
            </div>

            <div v-if="posts.length" class="post-list">
              <article v-for="post in posts" :key="post.id" class="post-card">
                <div class="post-image-wrap">
                  <img
                    v-if="post.featured_image_url"
                    :src="post.featured_image_url"
                    :alt="blogPostImageAlt(post)"
                    class="post-image"
                    width="260"
                    height="180"
                    loading="lazy"
                    decoding="async"
                  />
                  <div v-else class="post-image placeholder-image small">
                    <span>{{ post.category }}</span>
                  </div>
                </div>

                <div class="post-card-content">
                  <div class="post-meta compact">
                    <span>{{ post.category }}</span>
                    <span aria-hidden="true">•</span>
                    <time :datetime="post.published_at || undefined">
                      {{ formatBlogDate(post.published_at) }}
                    </time>
                    <span aria-hidden="true">•</span>
                    <span>{{ readingTimeLabel(post) }}</span>
                  </div>
                  <h3>{{ post.title }}</h3>
                  <p>{{ post.excerpt }}</p>
                  <div class="tag-row" v-if="post.tags.length">
                    <span v-for="tag in post.tags.slice(0, 3)" :key="tag" class="tag">#{{ tag }}</span>
                  </div>
                </div>
              </article>
            </div>

            <div v-else class="state-panel empty">
              <h3>The journal is warming up.</h3>
              <p>
                Blog posts will appear here as soon as they are published in the database. Drafts stay
                private until they are ready.
              </p>
            </div>
          </section>
        </section>
      </template>
    </div>
  </section>
</template>

<script setup>
import { blogPostImageAlt, formatBlogDate, readingTimeLabel } from '~/utils/blog'

useSiteSeo({
  title: 'Blog & Hatchery Journal',
  description:
    'Read Blue-Eyed Clowns hatchery notes, clownfish care guides, grow-out updates, and captive-bred reef aquarium advice.',
})

const { data: posts, pending, error: fetchError, refresh } = await useAsyncData('blog-posts', () =>
  $fetch('/api/blog/posts')
)

const featuredPost = computed(() => {
  const list = posts.value || []
  return list.find((post) => post.is_featured) || list[0] || null
})

const categories = computed(() => {
  const list = posts.value || []
  return [...new Set(list.map((post) => post.category).filter(Boolean))]
})

const topicCards = [
  {
    title: 'Care Guides',
    copy: 'Feeding, acclimation, pair behavior, and reef-ready husbandry tips.',
  },
  {
    title: 'Grow-Out Updates',
    copy: 'What is developing in our racks, from juvenile color to size milestones.',
  },
  {
    title: 'Behind the Scenes',
    copy: 'A practical look at our systems, shipping prep, and hatchery routines.',
  },
]
</script>

<style scoped>
.blog-page {
  padding: 3.5rem 1.5rem 4.5rem;
  background:
    radial-gradient(circle at top left, rgba(14, 165, 233, 0.18), transparent 32rem),
    radial-gradient(circle at top right, rgba(34, 211, 238, 0.12), transparent 28rem),
    #020617;
  color: #e5e7eb;
}

.blog-inner {
  max-width: 1120px;
  margin: 0 auto;
}

.blog-hero {
  max-width: 760px;
  margin-bottom: 3rem;
}

.eyebrow {
  margin: 0 0 0.7rem;
  color: #67e8f9;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

h1,
h2,
h3,
p {
  margin-top: 0;
}

.blog-hero h1 {
  margin-bottom: 1rem;
  color: #f8fafc;
  font-size: clamp(2.35rem, 6vw, 4.8rem);
  line-height: 0.95;
  letter-spacing: -0.055em;
}

.hero-copy {
  max-width: 44rem;
  color: #cbd5e1;
  font-size: 1.1rem;
  line-height: 1.75;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.9rem;
  margin-top: 1.6rem;
}

.btn,
.retry-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 0.82rem 1.15rem;
  font-weight: 800;
  text-decoration: none;
  border: 1px solid rgba(148, 163, 184, 0.3);
  cursor: pointer;
}

.btn-primary,
.retry-button {
  background: linear-gradient(135deg, #22d3ee, #38bdf8);
  color: #082f49;
  border-color: transparent;
}

.btn-outline {
  color: #e0f2fe;
  background: rgba(15, 23, 42, 0.68);
}

.section-heading-row {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.section-heading-row h2,
.topic-panel h2 {
  color: #f8fafc;
  font-size: clamp(1.45rem, 3vw, 2rem);
}

.featured-section {
  margin-bottom: 2rem;
}

.featured-card,
.topic-panel,
.post-card,
.state-panel {
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 1.35rem;
  background: rgba(15, 23, 42, 0.72);
  box-shadow: 0 22px 70px rgba(0, 0, 0, 0.24);
}

.featured-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 0.9fr);
  overflow: hidden;
}

.featured-image,
.post-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.featured-image-wrap {
  min-height: 320px;
}

.placeholder-image {
  min-height: 320px;
  display: grid;
  place-items: center;
  color: #bae6fd;
  background:
    linear-gradient(135deg, rgba(8, 47, 73, 0.92), rgba(14, 116, 144, 0.7)),
    repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0 10px, transparent 10px 20px);
  font-weight: 900;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-align: center;
}

.placeholder-image.small {
  min-height: 180px;
  font-size: 0.82rem;
}

.featured-content {
  padding: clamp(1.4rem, 4vw, 2.4rem);
}

.featured-content h3,
.post-card h3 {
  color: #f8fafc;
  line-height: 1.1;
}

.featured-content h3 {
  font-size: clamp(1.65rem, 4vw, 2.65rem);
}

.featured-content p,
.post-card p,
.topic-list span,
.state-panel p {
  color: #cbd5e1;
  line-height: 1.7;
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-bottom: 0.9rem;
  color: #a5f3fc;
  font-size: 0.87rem;
  font-weight: 800;
}

.post-meta.compact {
  font-size: 0.78rem;
}

.tag-row,
.category-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag,
.category-chip,
.post-count {
  border: 1px solid rgba(34, 211, 238, 0.24);
  border-radius: 999px;
  padding: 0.35rem 0.65rem;
  color: #bae6fd;
  background: rgba(8, 47, 73, 0.55);
  font-size: 0.8rem;
  font-weight: 800;
}

.content-grid {
  display: grid;
  grid-template-columns: minmax(240px, 0.38fr) minmax(0, 1fr);
  gap: 1.25rem;
  align-items: start;
}

.topic-panel {
  position: sticky;
  top: 6rem;
  padding: 1.35rem;
}

.topic-list {
  display: grid;
  gap: 1rem;
  padding: 0;
  margin: 1.2rem 0 1.5rem;
  list-style: none;
}

.topic-list li {
  display: grid;
  gap: 0.25rem;
}

.topic-list strong {
  color: #f8fafc;
}

.category-panel h3 {
  color: #f8fafc;
  font-size: 1rem;
}

.post-list {
  display: grid;
  gap: 1rem;
}

.post-card {
  display: grid;
  grid-template-columns: 220px 1fr;
  overflow: hidden;
}

.post-image-wrap {
  min-height: 180px;
}

.post-card-content {
  padding: 1.2rem;
}

.post-card h3 {
  margin-bottom: 0.65rem;
  font-size: 1.35rem;
}

.state-panel {
  padding: 1.4rem;
}

.state-panel.error {
  border-color: rgba(248, 113, 113, 0.45);
}

.state-panel.empty h3 {
  color: #f8fafc;
}

@media (max-width: 860px) {
  .featured-card,
  .content-grid,
  .post-card {
    grid-template-columns: 1fr;
  }

  .topic-panel {
    position: static;
  }
}
</style>
