import { fetchPublishedBlogPosts } from '../../utils/blogCatalog.js'

export default defineEventHandler(async () => {
  return fetchPublishedBlogPosts()
})
