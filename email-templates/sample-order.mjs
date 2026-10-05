/**
 * Fake order used to fill email-templates/bec-email-shell.html.
 * Run: node email-templates/sample-order.mjs
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

const isDirect = process.argv[1] && process.argv[1].endsWith('sample-order.mjs')

if (isDirect) {
  const { html } = buildOrderConfirmation(sampleOrderConfirmationInput)
  const banner = `<!--
  Blue-Eyed Clowns branded email shell.
  Filled order-confirmation sample with fake data for Mission Control.
  Regenerated from shared/emailLayout.js via: node email-templates/sample-order.mjs
  Transactional mail omits the unsubscribe line. Marketing mail passes unsubscribeUrl: '{{unsubscribe_url}}'.
-->
`
  writeFileSync(new URL('./bec-email-shell.html', import.meta.url), `${banner}${html}`)
}
