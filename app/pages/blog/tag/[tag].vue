<template>
  <section class="blog-page">
    <div class="blog-inner">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <NuxtLink to="/">Home</NuxtLink>
        <span>/</span>
        <NuxtLink to="/blog">Blog</NuxtLink>
        <span>/</span>
        <span>#{{ displayTag }}</span>
      </nav>

      <header class="blog-hero">
        <p class="eyebrow">Tagged posts</p>
        <h1>#{{ displayTag }}</h1>
        <p class="hero-copy">
          All published hatchery journal posts tagged with
          <strong>#{{ displayTag }}</strong>.
        </p>
        <div class="hero-actions">
          <NuxtLink to="/blog" class="btn btn-outline">← All posts</NuxtLink>
        </div>
      </header>

      <div v-if="pending" class="state-panel">
        <p>Loading posts for this tag…</p>
      </div>

      <div v-else-if="fetchError" class="state-panel error">
        <p>We could not load posts for this tag right now.</p>
        <NuxtLink to="/blog" class="btn btn-primary">Back to blog</NuxtLink>
      </div>

      <template v-else>
        <div class="section-heading-row">
          <div>
            <p class="eyebrow">Results</p>
            <h2>{{ filteredPosts.length }} post{{ filteredPosts.length === 1 ? '' : 's' }}</h2>
          </div>
        </div>

        <div v-if="filteredPosts.length" class="post-list">
          <article v-for="post in filteredPosts" :key="post.id" class="post-card">
            <NuxtLink :to="`/blog/${post.slug}`" class="post-main-link">
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
              </div>
            </NuxtLink>
            <div class="tag-row post-tags" v-if="post.tags.length">
              <NuxtLink
                v-for="tag in post.tags"
                :key="tag"
                :to="`/blog/tag/${slugifyTag(tag)}`"
                class="tag"
                :class="{ active: slugifyTag(tag) === tagSlug }"
              >
                #{{ tag }}
              </NuxtLink>
            </div>
          </article>
        </div>

        <div v-else class="state-panel empty">
          <h3>No posts with this tag yet.</h3>
          <p>Try another tag from the hatchery journal, or browse all posts.</p>
          <NuxtLink to="/blog" class="btn btn-primary">View all posts</NuxtLink>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup>
import {
  blogPostImageAlt,
  formatBlogDate,
  postHasTag,
  readingTimeLabel,
  slugifyTag,
} from '~/utils/blog'

const route = useRoute()
const tagSlug = computed(() => String(route.params.tag || '').toLowerCase())

const { data: posts, pending, error: fetchError } = await useAsyncData('blog-posts', () =>
  $fetch('/api/blog/posts')
)

const filteredPosts = computed(() => {
  const list = posts.value || []
  return list.filter((post) => postHasTag(post, tagSlug.value))
})

const displayTag = computed(() => {
  const match = filteredPosts.value
    .flatMap((post) => post.tags || [])
    .find((tag) => slugifyTag(tag) === tagSlug.value)
  return match || tagSlug.value.replace(/-/g, ' ')
})

useSiteSeo({
  title: `Posts tagged #${displayTag.value}`,
  description: `Browse Blue-Eyed Clowns hatchery journal posts tagged #${displayTag.value}.`,
})
</script>

<style scoped>
.blog-page {
  padding: 3.5rem 1.5rem 4.5rem;
  background:
    radial-gradient(circle at top left, rgba(14, 165, 233, 0.18), transparent 32rem),
    #020617;
  color: #e5e7eb;
}

.blog-inner {
  max-width: 900px;
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

.blog-hero {
  margin-bottom: 2.25rem;
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
  font-size: clamp(2.1rem, 5vw, 3.5rem);
  line-height: 1.05;
  letter-spacing: -0.04em;
}

.hero-copy {
  color: #cbd5e1;
  font-size: 1.05rem;
  line-height: 1.7;
}

.hero-copy strong {
  color: #e0f2fe;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.9rem;
  margin-top: 1.4rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 0.82rem 1.15rem;
  font-weight: 800;
  text-decoration: none;
  border: 1px solid rgba(148, 163, 184, 0.3);
}

.btn-primary {
  background: linear-gradient(135deg, #22d3ee, #38bdf8);
  color: #082f49;
  border-color: transparent;
}

.btn-outline {
  color: #e0f2fe;
  background: rgba(15, 23, 42, 0.68);
}

.section-heading-row {
  margin-bottom: 1rem;
}

.section-heading-row h2 {
  color: #f8fafc;
  font-size: 1.45rem;
}

.post-list {
  display: grid;
  gap: 1rem;
}

.post-card,
.state-panel {
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 1.35rem;
  background: rgba(15, 23, 42, 0.72);
  box-shadow: 0 22px 70px rgba(0, 0, 0, 0.24);
  overflow: hidden;
}

.post-main-link {
  display: grid;
  grid-template-columns: 220px 1fr;
  color: inherit;
  text-decoration: none;
}

.post-main-link:hover h3 {
  color: #67e8f9;
}

.post-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-image-wrap {
  min-height: 180px;
}

.placeholder-image.small {
  min-height: 180px;
  display: grid;
  place-items: center;
  color: #bae6fd;
  background:
    linear-gradient(135deg, rgba(8, 47, 73, 0.92), rgba(14, 116, 144, 0.7)),
    repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0 10px, transparent 10px 20px);
  font-size: 0.82rem;
  font-weight: 900;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-align: center;
}

.post-card-content {
  padding: 1.2rem 1.2rem 0.75rem;
}

.post-card h3 {
  margin-bottom: 0.65rem;
  color: #f8fafc;
  font-size: 1.35rem;
  line-height: 1.15;
  transition: color 0.15s ease;
}

.post-card p {
  color: #cbd5e1;
  line-height: 1.7;
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-bottom: 0.9rem;
  color: #a5f3fc;
  font-size: 0.78rem;
  font-weight: 800;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.post-tags {
  padding: 0 1.2rem 1.2rem;
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

.tag:hover,
.tag.active {
  border-color: rgba(103, 232, 249, 0.55);
  color: #ecfeff;
  background: rgba(8, 47, 73, 0.85);
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

.state-panel .btn {
  margin-top: 1rem;
}

@media (max-width: 720px) {
  .post-main-link {
    grid-template-columns: 1fr;
  }
}
</style>
