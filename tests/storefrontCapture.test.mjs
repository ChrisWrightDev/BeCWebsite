import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { mergeCustomerFields, preferCustomerSource } from '../shared/customerMerge.js'
import {
  buildPaymentIntentMetadata,
  decodeCartMetadata,
  encodeCartMetadata,
  resolvePaidOrderInput,
} from '../shared/checkoutMetadata.js'
import {
  honeypotTripped,
  validateInquiryInput,
  validateSubscriberInput,
} from '../shared/publicForms.js'
import {
  buildInquiryNotice,
  buildOrderConfirmation,
  publicOrderNumber,
} from '../shared/orderEmail.js'
import { allowRequest, resetRateLimitForTests } from '../server/utils/rateLimit.js'

const orderId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
assert.equal(publicOrderNumber(orderId), 'BEC-A1B2C3D4E5F6')
assert.equal(publicOrderNumber(orderId), publicOrderNumber(orderId))

const confirmation = buildOrderConfirmation({
  orderNumber: 'BEC-A1B2C3D4E5F6',
  customerName: 'Ada <script>',
  items: [{ product_name: 'Snowflake Ocellaris', quantity: 2, price_cents: 6999 }],
  shippingAddress: {
    line1: '1 Reef Way',
    city: 'Pensacola',
    state: 'FL',
    postal_code: '32501',
    country: 'US',
  },
  merchandiseSubtotalCents: 13998,
  shippingCents: 2999,
  totalCents: 16997,
})
assert.match(confirmation.subject, /BEC-A1B2C3D4E5F6/)
assert.match(confirmation.html, /BEC-A1B2C3D4E5F6/)
assert.match(confirmation.html, /Snowflake Ocellaris × 2/)
assert.match(confirmation.html, /\$139\.98/)
assert.match(confirmation.html, /\$29\.99/)
assert.match(confirmation.html, /\$169\.97/)
assert.match(confirmation.html, /1 Reef Way/)
assert.match(confirmation.text, /Monday through Thursday via UPS or FedEx/)
assert.match(confirmation.html, /3-day live guarantee/i)
assert.match(confirmation.html, /Ada &lt;script&gt;/)
assert.doesNotMatch(confirmation.html, /<script>/)

const freeShipping = buildOrderConfirmation({
  orderNumber: 'BEC-FREE',
  customerName: '',
  items: [{ product_name: 'Pair', quantity: 1, price_cents: 25000 }],
  shippingAddress: { line1: '1 Reef Way', city: 'Pensacola', postal_code: '32501' },
  merchandiseSubtotalCents: 25000,
  shippingCents: 0,
  totalCents: 25000,
})
assert.match(freeShipping.html, />Free</)

const inquiryNotice = buildInquiryNotice({
  typeLabel: 'Wholesale inquiry',
  name: 'Shop',
  email: 'shop@example.com',
  phone: '850-555-0100',
  subject: 'Wholesale inquiry',
  message: 'Do you have snowflakes?',
  related_product_slug: 'snowflakes',
})
assert.match(inquiryNotice.subject, /Wholesale inquiry/)
assert.match(inquiryNotice.text, /snowflakes/)

assert.equal(preferCustomerSource(null, 'subscriber'), 'subscriber')
assert.equal(preferCustomerSource('subscriber', 'inquiry'), 'inquiry')
assert.equal(preferCustomerSource('inquiry', 'website'), 'website')
assert.equal(preferCustomerSource('website', 'subscriber'), 'website')
assert.equal(preferCustomerSource('trade-show', 'website'), 'trade-show')

const merged = mergeCustomerFields(
  { name: 'Ada Lovelace', phone: '850-555-0100', notes: 'Pays on pickup', source: 'subscriber' },
  { name: 'A', phone: '', source: 'website' }
)
assert.equal(merged.name, 'Ada Lovelace')
assert.equal(merged.phone, '850-555-0100')
assert.equal(merged.notes, 'Pays on pickup')
assert.equal(merged.source, 'website')

const filled = mergeCustomerFields(
  { name: '', phone: null, notes: null, source: null },
  { name: 'Grace', phone: '555', source: 'inquiry' }
)
assert.equal(filled.name, 'Grace')
assert.equal(filled.phone, '555')
assert.equal(filled.source, 'inquiry')

const fishId = '123e4567-e89b-12d3-a456-426614174000'
const pairId = '123e4567-e89b-12d3-a456-426614174111'
const metadata = buildPaymentIntentMetadata({
  items: [
    { id: fishId, type: 'single', quantity: 2 },
    { id: pairId, type: 'bonded_pair', quantity: 9 },
  ],
  customerEmail: 'Buyer@Example.com',
  customerName: 'Buyer',
  shippingAddress: {
    line1: '1 Reef Way',
    city: 'Pensacola',
    state: 'FL',
    postal_code: '32501',
    country: 'USA',
  },
  merchandiseSubtotalCents: 10000,
  shippingCents: 2999,
})
assert.equal(metadata.customer_email, 'Buyer@Example.com')
assert.equal(metadata.ship_country, 'US')
assert.equal(metadata.cart_2, '')
const decoded = decodeCartMetadata(metadata)
assert.deepEqual(decoded, [
  { id: fishId, type: 'single', quantity: 2 },
  { id: pairId, type: 'bonded_pair', quantity: 1 },
])

const many = Array.from({ length: 13 }, (_, index) => ({
  id: `123e4567-e89b-12d3-a456-4266141740${String(index).padStart(2, '0')}`.slice(0, 36),
  type: 'single',
  quantity: 1,
}))
const chunked = encodeCartMetadata(many)
assert.ok(chunked.cart.length <= 500)
assert.ok(chunked.cart_2)
assert.equal(decodeCartMetadata(chunked).length, 13)

const resolved = resolvePaidOrderInput({
  metadata,
  receiptEmail: 'other@example.com',
  shipping: { name: 'Other', address: { line1: '9 Other', city: 'Mobile', postal_code: '36601', country: 'US' } },
  fallback: {
    customerEmail: 'fallback@example.com',
    customerName: 'Fallback',
    items: [{ id: 'different', quantity: 1, type: 'single' }],
    shippingAddress: { line1: '9 Fallback', city: 'Mobile', postal_code: '36601', country: 'US' },
  },
})
assert.equal(resolved.customerEmail, 'Buyer@Example.com')
assert.equal(resolved.items[0].id, fishId)
assert.equal(resolved.shippingAddress.line1, '1 Reef Way')

const fromBody = resolvePaidOrderInput({
  metadata: {},
  fallback: {
    customerEmail: 'fallback@example.com',
    customerName: 'Fallback',
    items: [{ id: fishId, quantity: 1, type: 'single' }],
    shippingAddress: { line1: '9 Fallback', city: 'Mobile', postal_code: '36601', country: 'US' },
  },
})
assert.equal(fromBody.customerEmail, 'fallback@example.com')
assert.equal(fromBody.items[0].id, fishId)

const signup = validateSubscriberInput({ email: 'Ada@Example.com', name: 'Ada', source: 'footer' })
assert.equal(signup.ok, true)
assert.equal(signup.value.email, 'ada@example.com')
assert.equal(signup.value.source, 'footer')
assert.equal(validateSubscriberInput({ email: 'not-an-email' }).ok, false)

const inquiry = validateInquiryInput({
  type: 'product_question',
  name: 'Ada',
  email: 'ada@example.com',
  phone: '850',
  subject: 'Question about Snowflake',
  message: 'Is this fish feeding?',
  product: 'snowflakes',
  pair: 'not a slug',
})
assert.equal(inquiry.ok, true)
assert.equal(inquiry.value.related_product_slug, 'snowflakes')
assert.equal(inquiry.value.related_pair_slug, null)
assert.equal(validateInquiryInput({ type: 'nope', name: 'A', email: 'a@b.co', message: 'Hi' }).ok, false)
assert.equal(honeypotTripped({ bec_hp: 'spam' }), true)
assert.equal(honeypotTripped({ bec_hp: '   ' }), false)

resetRateLimitForTests()
for (let attempt = 0; attempt < 5; attempt += 1) {
  assert.equal(allowRequest('signup:1', { limit: 5, windowMs: 1000 }, 1_000), true)
}
assert.equal(allowRequest('signup:1', { limit: 5, windowMs: 1000 }, 1_500), false)
assert.equal(allowRequest('signup:1', { limit: 5, windowMs: 1000 }, 2_100), true)

const migration = readFileSync(
  new URL('../supabase/migrations/20261004214500_email_capture.sql', import.meta.url),
  'utf8'
)
assert.match(migration, /alter table public\.subscribers enable row level security/)
assert.match(migration, /alter table public\.inquiries enable row level security/)
assert.match(migration, /alter table public\.customers enable row level security/)
assert.match(migration, /public\.is_admin\(auth\.uid\(\)\)/)
assert.match(migration, /customers_email_lower_key/)
assert.match(migration, /confirmation_sent_at/)
assert.doesNotMatch(migration, /for insert[\s\S]{0,120}to anon/i)
assert.doesNotMatch(migration, /create policy[\s\S]{0,160}for insert/i)

console.log('storefront capture tests passed')
