import { fetchBlogPostBySlug } from '../../utils/blogCatalog.js'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const post = await fetchBlogPostBySlug(slug)

  if (!post) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Blog post not found',
    })
  }

  return post
})
