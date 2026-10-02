import { fetchBondedPairsCatalog } from '../../utils/bondedPairsCatalog.js'

export default defineEventHandler(async () => {
  return fetchBondedPairsCatalog()
})
