import { fetchBondedPairBySlug } from '../../../utils/bondedPairsCatalog.js'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const pair = await fetchBondedPairBySlug(slug)

  if (!pair) {
    throw createError({ statusCode: 404, statusMessage: 'Bonded pair not found' })
  }

  return pair
})
