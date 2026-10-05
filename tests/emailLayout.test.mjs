import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { EMAIL_BRAND, plainTextEmail, wrapEmail } from '../shared/emailLayout.js'
import {
  buildInquiryNotice,
  buildOrderConfirmation,
  buildShopOrderNotice,
} from '../shared/orderEmail.js'
import {
  RESEND_TEST_FROM,
  resendTestOrderConfirmationInput,
  sampleOrderConfirmationInput,
} from '../email-templates/sample-order.mjs'

const marketing = wrapEmail({
  title: 'New captive-bred batch',
  preheader: 'Snowflake and designer clownfish just landed on the site.',
  bodyHtml: '<p>A new batch is listed.</p>',
  unsubscribeUrl: '{{unsubscribe_url}}',
})

assert.match(marketing, /bec-email-shell/)
assert.match(marketing, /New captive-bred batch/)
assert.match(marketing, /A new batch is listed\./)
assert.match(marketing, /Captive-bred clownfish/)
assert.match(marketing, /Florida Panhandle/)
assert.match(marketing, /Mon–Fri 10 AM–5 PM CT/)
assert.match(marketing, /blueeyedclowns@gmail\.com/)
assert.match(marketing, /https:\/\/blueeyedclowns\.com/)
assert.match(marketing, /images\/logo\.png/)
assert.match(marketing, /\{\{unsubscribe_url\}\}/)
assert.match(marketing, />Unsubscribe</)
assert.doesNotMatch(marketing, /display\s*:\s*flex/i)
assert.doesNotMatch(marketing, /display\s*:\s*grid/i)

for (const profile of EMAIL_BRAND.socials) {
  assert.match(marketing, new RegExp(profile.href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
}

const transactional = wrapEmail({
  title: 'Order confirmed',
  preheader: 'Confirmed',
  bodyHtml: '<p>Thanks</p>',
})
assert.doesNotMatch(transactional, /unsubscribe/i)
assert.match(transactional, /<table/i)

const marketingText = plainTextEmail({
  bodyText: 'A new batch is listed.',
  unsubscribeUrl: '{{unsubscribe_url}}',
})
assert.match(marketingText, /A new batch is listed\./)
assert.match(marketingText, /10 AM–5 PM CT/)
assert.match(marketingText, /Unsubscribe: \{\{unsubscribe_url\}\}/)

const transactionalText = plainTextEmail({ bodyText: 'Hello' })
assert.match(transactionalText, /Hello/)
assert.doesNotMatch(transactionalText, /unsubscribe/i)

const confirmation = buildOrderConfirmation({
  orderNumber: 'BEC-A1B2C3D4E5F6',
  customerName: 'Ada <script>',
  items: [{ product_name: 'Snowflake Ocellaris', quantity: 2, price_cents: 6999 }],
  shippingAddress: { line1: '1 Reef Way', city: 'Pensacola', state: 'FL', postal_code: '32501' },
  merchandiseSubtotalCents: 13998,
  shippingCents: 2999,
  totalCents: 16997,
})
assert.match(confirmation.html, /bec-email-shell/)
assert.match(confirmation.html, /Order confirmed/)
assert.match(confirmation.html, /shipping and tracking details when your fish ships/)
assert.match(confirmation.html, /Monday through Thursday via UPS or FedEx/)
assert.match(confirmation.html, /3-day live guarantee/i)
assert.match(confirmation.html, /Ada &lt;script&gt;/)
assert.doesNotMatch(confirmation.html, /unsubscribe/i)
assert.match(confirmation.text, /https:\/\/www\.tiktok\.com\/@blueeyedclowns/)

const shopNotice = buildShopOrderNotice({
  orderNumber: 'BEC-A1B2C3D4E5F6',
  workOrderNumber: 'WO-20261005-120000-a1b2c3d4',
  customerName: 'Ada <script>',
  customerEmail: 'ada@example.com',
  items: [{ product_name: 'Snowflake Ocellaris', quantity: 2, price_cents: 6999 }],
  shippingAddress: { line1: '1 Reef Way', city: 'Pensacola', state: 'FL', postal_code: '32501' },
  merchandiseSubtotalCents: 13998,
  shippingCents: 0,
  totalCents: 13998,
})
assert.match(shopNotice.subject, /New order BEC-A1B2C3D4E5F6/)
assert.match(shopNotice.html, /New website order/)
assert.match(shopNotice.html, /WO-20261005-120000-a1b2c3d4/)
assert.match(shopNotice.html, />Free</)
assert.match(shopNotice.html, /bec-email-shell/)
assert.doesNotMatch(shopNotice.html, /<script>/)
assert.doesNotMatch(shopNotice.html, /unsubscribe/i)
assert.match(shopNotice.text, /ada@example.com/)

const inquiry = buildInquiryNotice({
  typeLabel: 'Wholesale inquiry',
  name: 'Shop',
  email: 'shop@example.com',
  message: 'Do you have snowflakes?',
  related_product_slug: 'snowflakes',
})
assert.match(inquiry.html, /Wholesale inquiry/)
assert.match(inquiry.html, /snowflakes/)
assert.match(inquiry.html, /bec-email-shell/)
assert.match(inquiry.html, /images\/logo\.png/)
assert.doesNotMatch(inquiry.html, /unsubscribe/i)

const sampleHtml = buildOrderConfirmation(sampleOrderConfirmationInput).html
const sampleFile = readFileSync(
  new URL('../email-templates/bec-email-shell.html', import.meta.url),
  'utf8'
)
assert.match(sampleFile, /bec-email-shell/)
assert.ok(sampleFile.includes(sampleHtml))
assert.match(sampleFile, /Jordan Hale/)
assert.match(sampleFile, /BEC-SAMPLE4F8C1A/)
assert.doesNotMatch(sampleHtml, /unsubscribe/i)
assert.equal(sampleFile.includes('>Unsubscribe<'), false)

const resendTest = buildOrderConfirmation(resendTestOrderConfirmationInput)
assert.equal(resendTest.subject, 'Order BEC-TESTEMAIL01 confirmed — Blue Eyed Clowns')
assert.equal(RESEND_TEST_FROM, 'Blue Eyed Clowns <orders@blueeyedclowns.com>')
const resendTestFile = readFileSync(
  new URL('../email-templates/bec-order-confirmation-sample.html', import.meta.url),
  'utf8'
)
assert.ok(resendTestFile.includes(resendTest.html))
assert.ok(resendTestFile.includes(`Subject: ${resendTest.subject}`))
assert.ok(resendTestFile.includes(`From: ${RESEND_TEST_FROM}`))
assert.match(resendTestFile, /Riley Sample/)
assert.match(resendTestFile, /Sample Clownfish \(test email only\)/)
assert.match(resendTestFile, /\$10\.00/)
assert.match(resendTestFile, /\$5\.00/)
assert.match(resendTestFile, /\$15\.00/)
assert.match(resendTestFile, /100 Sample Reef Lane/)
assert.doesNotMatch(resendTest.html, /unsubscribe/i)
assert.equal(resendTestFile.includes('>Unsubscribe<'), false)

console.log('email layout tests passed')
