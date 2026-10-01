import { priceRetailCartItems } from '../../shared/retailShipping.js'
import { fetchClownfishByIds } from './clownfishCatalog.js'

function asHttpError(error) {
  if (error?.statusCode) {
    throw createError({
      statusCode: error.statusCode,
      statusMessage: error.message,
    })
  }
  throw error
}

export { priceRetailCartItems }

export async function resolveRetailCheckoutOrder(items) {
  try {
    const ids = Array.isArray(items) ? items.map((row) => row?.id) : []
    const catalog = await fetchClownfishByIds(ids)
    return priceRetailCartItems(items, catalog)
  } catch (error) {
    asHttpError(error)
  }
}

export function shippingWorkOrderNote(order) {
  const shippingLabel = order.shippingCents === 0
    ? 'FREE'
    : `$${(order.shippingCents / 100).toFixed(2)}`
  return `Fulfill and ship. ${order.lineItems.length} line(s). Overnight shipping: ${shippingLabel}.`
}
