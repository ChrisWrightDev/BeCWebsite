export function readingTimeLabel(post) {
  const minutes = post?.reading_time_minutes || 1
  return `${minutes} min read`
}

export function formatBlogDate(value) {
  if (!value) return 'Coming soon'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Coming soon'

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function blogPostImageAlt(post) {
  return post?.featured_image_alt || `${post?.title || 'Blue-Eyed Clowns'} — Blue-Eyed Clowns blog post`
}
