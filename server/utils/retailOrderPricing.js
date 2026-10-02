import {
  CART_ITEM_BONDED_PAIR,
  CART_ITEM_SINGLE,
  normalizeCartItemType,
  priceRetailCartItems,
} from '#shared/retailShipping.js'
import { fetchBondedPairsByIds } from './bondedPairsCatalog.js'
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
    const list = Array.isArray(items) ? items : []
    const singleIds = list
      .filter((row) => normalizeCartItemType(row?.type || row?.itemType) === CART_ITEM_SINGLE)
      .map((row) => row?.id)
    const pairIds = list
      .filter((row) => normalizeCartItemType(row?.type || row?.itemType) === CART_ITEM_BONDED_PAIR)
      .map((row) => row?.id)

    const [singles, pairs] = await Promise.all([
      fetchClownfishByIds(singleIds),
      fetchBondedPairsByIds(pairIds),
    ])

    const catalog = [
      ...singles.map((row) => ({ ...row, type: CART_ITEM_SINGLE })),
      ...pairs.map((row) => ({ ...row, type: CART_ITEM_BONDED_PAIR })),
    ]

    return priceRetailCartItems(list, catalog)
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
