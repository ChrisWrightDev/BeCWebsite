import assert from 'node:assert/strict'
import {
  RETAIL_SHIPPING,
  formatUsdFromCents,
  retailOrderTotals,
  retailShippingCents,
  retailShippingHint,
  retailShippingPolicySentence,
  priceRetailCartItems,
} from '../shared/retailShipping.js'

assert.equal(RETAIL_SHIPPING.rateCents, 2999)
assert.equal(RETAIL_SHIPPING.freeThresholdCents, 25000)

assert.equal(retailShippingCents(0), 2999)
assert.equal(retailShippingCents(24999), 2999)
assert.equal(retailShippingCents(25000), 0, 'exactly $250 qualifies for free shipping')
assert.equal(retailShippingCents(25001), 0)
assert.equal(retailShippingCents(3999), 2999)

const under = retailOrderTotals(3999)
assert.equal(under.shippingCents, 2999)
assert.equal(under.totalCents, 6998)
assert.equal(under.freeShipping, false)
assert.equal(under.remainingForFreeShippingCents, 21001)
assert.match(retailShippingHint(under), /Add \$210\.01 more/)

const exact = retailOrderTotals(25000)
assert.equal(exact.shippingCents, 0)
assert.equal(exact.totalCents, 25000)
assert.equal(exact.freeShipping, true)
assert.equal(retailShippingHint(exact), 'Free shipping on orders $250+')

const over = retailOrderTotals(7 * 3999)
assert.equal(over.merchandiseSubtotalCents, 27993)
assert.equal(over.shippingCents, 0)
assert.equal(over.totalCents, 27993)

assert.equal(formatUsdFromCents(2999), '$29.99')
assert.equal(formatUsdFromCents(25000, { trimZeroCents: true }), '$250')
assert.equal(
  retailShippingPolicySentence(),
  'Overnight shipping is $29.99 per retail order, and free when the merchandise subtotal is $250 or more.'
)

const catalog = [
  { id: 'a', name: 'Standard Ocellaris', price_cents: 3999 },
  { id: 'b', name: 'Snowflake', price_cents: 6999 },
]

const priced = priceRetailCartItems(
  [
    { id: 'a', quantity: 2, price_cents: 1 },
    { id: 'b', quantity: 1, price_cents: 1 },
  ],
  catalog
)
assert.equal(priced.merchandiseSubtotalCents, 3999 * 2 + 6999)
assert.equal(priced.shippingCents, 2999)
assert.equal(priced.lineItems[0].price_cents, 3999)
assert.equal(priced.lineItems[1].price_cents, 6999)

const merged = priceRetailCartItems(
  [
    { id: 'b', quantity: 2 },
    { id: 'b', quantity: 2 },
  ],
  catalog
)
assert.equal(merged.merchandiseSubtotalCents, 6999 * 4)
assert.equal(merged.shippingCents, 0)

let missingFailed = false
try {
  priceRetailCartItems([{ id: 'missing', quantity: 1 }], catalog)
} catch (error) {
  missingFailed = true
  assert.equal(error.statusCode, 400)
}
assert.equal(missingFailed, true)

console.log('retailShipping helpers passed')
