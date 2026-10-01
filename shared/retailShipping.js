/**
 * Retail live-fish shipping.
 *
 * Wholesale orders are arranged separately (typically $300 minimum with
 * shipping included) and are not charged through this website checkout.
 * Do not apply these amounts to wholesale quotes.
 *
 * Threshold rule: merchandise subtotal >= freeThresholdCents qualifies
 * for free shipping (exactly $250.00 is free).
 */
export const RETAIL_SHIPPING = {
  rateCents: 2999,
  freeThresholdCents: 25000,
}

export function formatUsdFromCents(cents, { trimZeroCents = false } = {}) {
  const value = Math.trunc(Number(cents) || 0)
  const dollars = value / 100
  if (trimZeroCents && Number.isInteger(dollars)) {
    return `$${dollars}`
  }
  const sign = dollars < 0 ? '-' : ''
  return `${sign}$${Math.abs(dollars).toFixed(2)}`
}

export function retailShippingCents(merchandiseSubtotalCents) {
  const subtotal = Math.max(0, Math.trunc(Number(merchandiseSubtotalCents) || 0))
  return subtotal >= RETAIL_SHIPPING.freeThresholdCents ? 0 : RETAIL_SHIPPING.rateCents
}

export function retailOrderTotals(merchandiseSubtotalCents) {
  const merchandise = Math.max(0, Math.trunc(Number(merchandiseSubtotalCents) || 0))
  const shippingCents = retailShippingCents(merchandise)
  const remainingForFreeShippingCents =
    shippingCents === 0 ? 0 : RETAIL_SHIPPING.freeThresholdCents - merchandise

  return {
    merchandiseSubtotalCents: merchandise,
    shippingCents,
    totalCents: merchandise + shippingCents,
    freeShipping: shippingCents === 0,
    remainingForFreeShippingCents,
  }
}

export function retailShippingHint(totals) {
  const threshold = formatUsdFromCents(RETAIL_SHIPPING.freeThresholdCents, {
    trimZeroCents: true,
  })
  if (totals.freeShipping) {
    return `Free shipping on orders ${threshold}+`
  }
  return `Free shipping on orders ${threshold}+. Add ${formatUsdFromCents(totals.remainingForFreeShippingCents)} more to qualify.`
}

export function retailShippingPolicySentence() {
  const rate = formatUsdFromCents(RETAIL_SHIPPING.rateCents)
  const threshold = formatUsdFromCents(RETAIL_SHIPPING.freeThresholdCents, {
    trimZeroCents: true,
  })
  return `Overnight shipping is ${rate} per retail order, and free when the merchandise subtotal is ${threshold} or more.`
}

function pricingError(statusMessage) {
  const error = new Error(statusMessage)
  error.statusCode = 400
  return error
}

/**
 * Price a retail cart from catalog rows. Client-sent price_cents is ignored.
 */
export function priceRetailCartItems(items, catalog) {
  if (!Array.isArray(items) || items.length === 0) {
    throw pricingError('Request must include an array of items with id and quantity.')
  }

  const byId = new Map((catalog || []).map((fish) => [String(fish.id), fish]))
  const quantityById = new Map()

  for (const row of items) {
    const id = row?.id == null ? '' : String(row.id)
    if (!id) {
      throw pricingError('Each item must include a product id.')
    }
    const quantity = Math.max(1, parseInt(row.quantity, 10) || 1)
    quantityById.set(id, (quantityById.get(id) || 0) + quantity)
  }

  const lineItems = []
  let merchandiseSubtotalCents = 0

  for (const [id, quantity] of quantityById) {
    const fish = byId.get(id)
    if (!fish) {
      throw pricingError('One or more cart items are no longer available.')
    }
    const priceCents = Math.max(0, parseInt(fish.price_cents, 10) || 0)
    merchandiseSubtotalCents += quantity * priceCents
    lineItems.push({
      clownfish_id: fish.id,
      product_name: fish.name || 'Clownfish',
      quantity,
      price_cents: priceCents,
    })
  }

  return {
    lineItems,
    ...retailOrderTotals(merchandiseSubtotalCents),
  }
}
