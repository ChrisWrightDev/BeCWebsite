/**
 * Fake orders used to fill the standalone email HTML files.
 * Run: node email-templates/sample-order.mjs
 *
 * bec-email-shell.html is the Mission Control shell example.
 * bec-order-confirmation-sample.html is a manual Resend test payload.
 * Nothing in this script sends mail.
 */
import { writeFileSync } from 'node:fs'

import { buildOrderConfirmation } from '../shared/orderEmail.js'

export const sampleOrderConfirmationInput = {
  orderNumber: 'BEC-SAMPLE4F8C1A',
  customerName: 'Jordan Hale',
  items: [{ product_name: 'Snowflake Ocellaris', quantity: 2, price_cents: 6999 }],
  shippingAddress: {
    line1: '184 Coral Lane',
    line2: 'Apt 2',
    city: 'Pensacola',
    state: 'FL',
    postal_code: '32503',
    country: 'US',
  },
  merchandiseSubtotalCents: 13998,
  shippingCents: 2999,
  totalCents: 16997,
}

/** Obviously fake order for a manual Resend test. Totals are not live shop prices. */
export const resendTestOrderConfirmationInput = {
  orderNumber: 'BEC-TESTEMAIL01',
  customerName: 'Riley Sample',
  items: [{ product_name: 'Sample Clownfish (test email only)', quantity: 1, price_cents: 1000 }],
  shippingAddress: {
    line1: '100 Sample Reef Lane',
    city: 'Pensacola',
    state: 'FL',
    postal_code: '32501',
    country: 'US',
  },
  merchandiseSubtotalCents: 1000,
  shippingCents: 500,
  totalCents: 1500,
}

/** Production sender for a manual Resend test. The site still falls back to onboarding@resend.dev when EMAIL_FROM is unset. */
export const RESEND_TEST_FROM = 'Blue Eyed Clowns <orders@blueeyedclowns.com>'

const isDirect = process.argv[1] && process.argv[1].endsWith('sample-order.mjs')

if (isDirect) {
  const shell = buildOrderConfirmation(sampleOrderConfirmationInput)
  const shellBanner = `<!--
  Blue-Eyed Clowns branded email shell.
  Filled order-confirmation sample with fake data for Mission Control.
  Regenerated from shared/emailLayout.js via: node email-templates/sample-order.mjs
  Transactional mail omits the unsubscribe line. Marketing mail uses wrapMarketingEmail and passes unsubscribeUrl.
-->
`
  writeFileSync(new URL('./bec-email-shell.html', import.meta.url), `${shellBanner}${shell.html}`)

  const testMessage = buildOrderConfirmation(resendTestOrderConfirmationInput)
  const testBanner = `<!--
  Manual Resend test payload. This file does not send itself.
  Subject: ${testMessage.subject}
  From: ${RESEND_TEST_FROM}
  Mock only: Riley Sample, Sample Clownfish (test email only), $10.00 merchandise, $5.00 shipping, $15.00 total.
  Those amounts are not live shop prices or the live shipping rate.
-->
`
  writeFileSync(
    new URL('./bec-order-confirmation-sample.html', import.meta.url),
    `${testBanner}${testMessage.html}`
  )
}
