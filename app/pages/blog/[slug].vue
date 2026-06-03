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
          <span v-for="tag in post.tags" :key="tag" class="tag">#{{ tag }}</span>
        </footer>
      </template>
    </div>
  </article>
</template>

<script setup>
import { blogPostImageAlt, formatBlogDate, readingTimeLabel } from '~/utils/blog'

const route = useRoute()

const { data: post, pending, error: fetchError } = await useAsyncData(`blog-post-${route.params.slug}`, () =>
  $fetch(`/api/blog/${route.params.slug}`)
)

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
}
</style>
