import { fetchClownfishCatalog } from '../../utils/clownfishCatalog.js'

export default defineEventHandler(async () => {
  return fetchClownfishCatalog()
})
