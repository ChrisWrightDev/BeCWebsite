import { fetchPublicHatchBatchBySlug } from '../../../utils/hatchBatchesCatalog.js'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const batch = await fetchPublicHatchBatchBySlug(slug)

  if (!batch) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Hatch batch not found',
    })
  }

  return batch
})
