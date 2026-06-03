import assert from 'node:assert/strict'
import {
  blogPostImageAlt,
  formatBlogDate,
  normalizeBlogPost,
  readingTimeLabel,
  slugifyBlogTitle,
} from '../server/utils/blogCatalog.js'

const post = normalizeBlogPost({
  id: '11111111-1111-4111-8111-111111111111',
  title: 'What Captive-Bred Clownfish Eat: A Hatchery Guide!',
  excerpt: 'A practical look at how prepared foods help young clownfish settle into reef aquariums.',
  content: 'Clownfish do best when they learn prepared foods early. '.repeat(55),
  category: 'Care Guides',
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

console.log('blogCatalog helpers passed')
