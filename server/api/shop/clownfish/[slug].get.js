import { fetchClownfishBySlug } from '../../../utils/clownfishCatalog.js'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const fish = await fetchClownfishBySlug(slug)

  if (!fish) {
    throw createError({ statusCode: 404, statusMessage: 'Clownfish not found' })
  }

  return fish
})
