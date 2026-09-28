import { createClient } from '@supabase/supabase-js'

const BLOG_COLUMNS =
  'id, title, slug, excerpt, content, category, tags, featured_image, featured_image_url, featured_image_alt, author_name, published_at, is_featured, status, created_at, updated_at'

export function slugifyBlogTitle(title) {
  if (!title || typeof title !== 'string') return ''
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function countWords(text) {
  if (!text || typeof text !== 'string') return 0
  return text.trim().split(/\s+/).filter(Boolean).length
}

export function calculateReadingTimeMinutes(text) {
  const words = countWords(text)
  return Math.max(1, Math.ceil(words / 220))
}

export function readingTimeLabel(post) {
  const minutes = post?.reading_time_minutes || calculateReadingTimeMinutes(post?.content || '')
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

export function resolveBlogPostFeaturedImage(post, supabaseUrlOverride = null) {
  if (!post) return null
  
  if (post.featured_image) {
    let supabaseUrl = supabaseUrlOverride
    
    if (!supabaseUrl) {
      try {
        const config = useRuntimeConfig()
        supabaseUrl = config.public?.supabaseUrl || config.supabaseUrl
      } catch (e) {
        supabaseUrl = process.env.NUXT_SUPABASE_URL
      }
    }
    
    if (!supabaseUrl) return post.featured_image_url || null
    
    const cleanUrl = supabaseUrl.replace(/\/$/, '')
    const cleanPath = post.featured_image.replace(/^\//, '')
    return `${cleanUrl}/storage/v1/object/public/blog-images/${cleanPath}`
  }
  
  return post.featured_image_url || null
}

export function normalizeBlogPost(row) {
  const title = row?.title?.trim() || 'Untitled hatchery note'
  const content = row?.content || ''
  const slug = row?.slug || slugifyBlogTitle(title)

  const normalized = {
    id: row?.id || slug,
    title,
    slug,
    excerpt: row?.excerpt || 'Fresh notes from the Blue-Eyed Clowns hatchery.',
    content,
    category: row?.category || 'Hatchery Notes',
    tags: Array.isArray(row?.tags) ? row.tags : [],
    featured_image: row?.featured_image || null,
    featured_image_url: row?.featured_image_url || null,
    featured_image_alt: row?.featured_image_alt || null,
    author_name: row?.author_name || 'Blue-Eyed Clowns',
    published_at: row?.published_at || null,
    is_featured: Boolean(row?.is_featured),
    status: row?.status || 'draft',
    reading_time_minutes: calculateReadingTimeMinutes(content),
    created_at: row?.created_at || null,
    updated_at: row?.updated_at || null,
  }
  
  normalized.resolved_featured_image = resolveBlogPostFeaturedImage(normalized)
  
  return normalized
}

function useSupabaseBlogReader() {
  const config = useRuntimeConfig()
  const key = config.supabaseAnonKey || config.supabaseServiceRoleKey

  if (!config.supabaseUrl || !key) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Server is not configured: add NUXT_SUPABASE_URL and NUXT_SUPABASE_ANON_KEY to your .env',
    })
  }

  return createClient(config.supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

export async function fetchPublishedBlogPosts() {
  const supabase = useSupabaseBlogReader()
  const { data, error } = await supabase
    .from('blog_posts')
    .select(BLOG_COLUMNS)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .order('is_featured', { ascending: false })
    .order('published_at', { ascending: false })

  if (error) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Could not load blog posts',
      data: { message: error.message },
    })
  }

  return (data || []).map(normalizeBlogPost)
}

export async function fetchBlogPostBySlug(slug) {
  if (!slug) return null
  const posts = await fetchPublishedBlogPosts()
  return posts.find((post) => post.slug === slug) || null
}
