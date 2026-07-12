import { fetchPublicHatchBatches } from '../../utils/hatchBatchesCatalog.js'

export default defineEventHandler(async () => {
  return fetchPublicHatchBatches()
})
