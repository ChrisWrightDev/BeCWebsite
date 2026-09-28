import assert from 'node:assert/strict'
import {
  blogPostImageAlt,
  formatBlogDate,
  normalizeBlogPost,
  readingTimeLabel,
  resolveBlogPostFeaturedImage,
  slugifyBlogTitle,
} from '../server/utils/blogCatalog.js'

// Ensure NUXT_SUPABASE_URL is set for deterministic testing
if (!process.env.NUXT_SUPABASE_URL) {
  process.env.NUXT_SUPABASE_URL = 'https://test-project.supabase.co'
}

const post = normalizeBlogPost({
  id: '11111111-1111-4111-8111-111111111111',
  title: 'What Captive-Bred Clownfish Eat: A Hatchery Guide!',
  excerpt: 'A practical look at how prepared foods help young clownfish settle into reef aquariums.',
  content: 'Clownfish do best when they learn prepared foods early. '.repeat(55),
  category: 'Care Guides',
  featured_image: null,
  featured_image_url: 'https://example.com/juvenile-clowns.jpg',
  featured_image_alt: null,
  author_name: 'Blue-Eyed Clowns',
  published_at: '2026-06-03T12:00:00.000Z',
})

assert.equal(slugifyBlogTitle('What Captive-Bred Clownfish Eat: A Hatchery Guide!'), 'what-captive-bred-clownfish-eat-a-hatchery-guide')
assert.equal(post.slug, 'what-captive-bred-clownfish-eat-a-hatchery-guide')
assert.equal(post.category, 'Care Guides')
assert.equal(post.author_name, 'Blue-Eyed Clowns')
assert.equal(post.is_featured, false)
assert.equal(post.reading_time_minutes, 3)
assert.equal(readingTimeLabel(post), '3 min read')
assert.equal(formatBlogDate(post.published_at), 'Jun 3, 2026')
assert.equal(blogPostImageAlt(post), 'What Captive-Bred Clownfish Eat: A Hatchery Guide! — Blue-Eyed Clowns blog post')

const fallbackPost = normalizeBlogPost({
  title: ' Hatchery Update ',
  content: '',
})

assert.equal(fallbackPost.slug, 'hatchery-update')
assert.equal(fallbackPost.excerpt, 'Fresh notes from the Blue-Eyed Clowns hatchery.')
assert.equal(fallbackPost.reading_time_minutes, 1)
assert.equal(formatBlogDate(null), 'Coming soon')

// Test storage path resolution (using override for deterministic testing)
const testSupabaseUrl = 'https://test-project.supabase.co'
assert.equal(
  resolveBlogPostFeaturedImage({ featured_image: 'test-folder/hero.jpg' }, testSupabaseUrl),
  'https://test-project.supabase.co/storage/v1/object/public/blog-images/test-folder/hero.jpg'
)

// Test URL fallback when featured_image is null
assert.equal(
  resolveBlogPostFeaturedImage({ featured_image: null, featured_image_url: 'https://example.com/image.jpg' }, testSupabaseUrl),
  'https://example.com/image.jpg'
)

// Test no image scenario
assert.equal(
  resolveBlogPostFeaturedImage({ featured_image: null, featured_image_url: null }, testSupabaseUrl),
  null
)

// Test normalizeBlogPost includes resolved_featured_image
const postWithStoragePath = normalizeBlogPost({
  title: 'Storage Path Test',
  featured_image: 'test-folder/hero.jpg',
  featured_image_url: null,
})
assert.ok(postWithStoragePath.resolved_featured_image)
assert.ok(postWithStoragePath.resolved_featured_image.includes('/storage/v1/object/public/blog-images/test-folder/hero.jpg'))

console.log('blogCatalog helpers passed')
