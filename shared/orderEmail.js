import { formatUsdFromCents } from './retailShipping.js'
import { EMAIL_BRAND, escapeHtml, plainTextEmail, wrapEmail } from './emailLayout.js'

export { escapeHtml }

export const SHOP_NOTIFY_EMAIL = EMAIL_BRAND.supportEmail
export const DEFAULT_EMAIL_FROM = 'Blue Eyed Clowns <onboarding@resend.dev>'

const FONT = 'Arial, Helvetica, sans-serif'
const INK = '#0f172a'
const MUTED = '#475569'
const LINK = '#0369a1'

export function publicOrderNumber(orderId) {
  const compact = String(orderId || '').replace(/-/g, '').slice(0, 12).toUpperCase()
  return compact ? `BEC-${compact}` : 'BEC-ORDER'
}

function addressLines(address) {
  const source = address || {}
  const cityLine = [source.city, source.state, source.postal_code].filter(Boolean).join(', ')
  return [source.line1, source.line2, cityLine, source.country || 'US'].filter(Boolean)
}

function itemRows(items) {
  return (items || []).map((item) => {
    const quantity = Math.max(1, parseInt(item.quantity, 10) || 1)
    const priceCents = Math.max(0, parseInt(item.price_cents, 10) || 0)
    return {
      name: item.product_name || item.name || 'Clownfish',
      quantity,
      lineCents: priceCents * quantity,
    }
  })
}

function shippingLabel(shippingCents) {
  return shippingCents === 0 ? 'Free' : formatUsdFromCents(shippingCents)
}

function summaryTableHtml({ rows, merchandiseSubtotalCents, shippingCents, totalCents }) {
  const itemHtml = rows.map((row) => `
    <tr>
      <td style="padding:8px 0;font-family:${FONT};font-size:15px;line-height:1.45;color:${INK};">${escapeHtml(row.name)} × ${row.quantity}</td>
      <td style="padding:8px 0;font-family:${FONT};font-size:15px;line-height:1.45;color:${INK};text-align:right;">${escapeHtml(formatUsdFromCents(row.lineCents))}</td>
    </tr>
  `).join('')

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #e2e8f0;">
                  ${itemHtml}
                  <tr>
                    <td style="padding:8px 0;font-family:${FONT};font-size:15px;line-height:1.45;color:${MUTED};">Merchandise</td>
                    <td style="padding:8px 0;font-family:${FONT};font-size:15px;line-height:1.45;color:${INK};text-align:right;">${escapeHtml(formatUsdFromCents(merchandiseSubtotalCents))}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;font-family:${FONT};font-size:15px;line-height:1.45;color:${MUTED};">Shipping</td>
                    <td style="padding:8px 0;font-family:${FONT};font-size:15px;line-height:1.45;color:${INK};text-align:right;">${shippingCents === 0 ? 'Free' : escapeHtml(formatUsdFromCents(shippingCents))}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 0 0;border-top:1px solid #e2e8f0;font-family:${FONT};font-size:15px;line-height:1.45;font-weight:700;color:${INK};">Total</td>
                    <td style="padding:12px 0 0;border-top:1px solid #e2e8f0;font-family:${FONT};font-size:15px;line-height:1.45;font-weight:700;color:${INK};text-align:right;">${escapeHtml(formatUsdFromCents(totalCents))}</td>
                  </tr>
                </table>`
}

function addressHtml(address) {
  return `<h2 style="margin:24px 0 8px;font-family:${FONT};font-size:16px;line-height:1.4;color:${INK};">Shipping address</h2>
                <p style="margin:0;font-family:${FONT};font-size:15px;line-height:1.5;color:${INK};white-space:pre-line;">${escapeHtml(address.join('\n'))}</p>`
}

function summaryText(rows, address, merchandiseSubtotalCents, shippingCents, totalCents) {
  return [
    'Items:',
    ...rows.map((row) => `- ${row.name} × ${row.quantity} — ${formatUsdFromCents(row.lineCents)}`),
    '',
    `Merchandise: ${formatUsdFromCents(merchandiseSubtotalCents)}`,
    `Shipping: ${shippingLabel(shippingCents)}`,
    `Total: ${formatUsdFromCents(totalCents)}`,
    '',
    'Ships to:',
    ...address,
  ]
}

export function buildOrderConfirmation({
  orderNumber,
  customerName,
  items,
  shippingAddress,
  merchandiseSubtotalCents,
  shippingCents,
  totalCents,
}) {
  const rows = itemRows(items)
  const greeting = customerName ? `Hi ${customerName},` : 'Hi,'
  const address = addressLines(shippingAddress)
  const subject = `Order ${orderNumber} confirmed — Blue Eyed Clowns`

  const bodyText = [
    greeting,
    '',
    `Your order ${orderNumber} is confirmed. We will email shipping and tracking details when it ships.`,
    'Live clownfish ship Monday through Thursday via UPS or FedEx overnight.',
    'Every fish is covered by our 3-day live guarantee.',
    '',
    ...summaryText(rows, address, merchandiseSubtotalCents, shippingCents, totalCents),
    '',
    'Questions? Reply to this email or write blueeyedclowns@gmail.com.',
  ].join('\n')

  const bodyHtml = `<p style="margin:0 0 12px;font-family:${FONT};font-size:16px;line-height:1.55;color:${INK};">${escapeHtml(greeting)}</p>
                <p style="margin:0 0 12px;font-family:${FONT};font-size:16px;line-height:1.55;color:${INK};">Thanks for your order. Your order number is <strong>${escapeHtml(orderNumber)}</strong>.</p>
                <p style="margin:0 0 12px;font-family:${FONT};font-size:16px;line-height:1.55;color:${INK};">We will email shipping and tracking details when your fish ships. Live animals ship Monday through Thursday via UPS or FedEx overnight.</p>
                <p style="margin:0 0 20px;font-family:${FONT};font-size:16px;line-height:1.55;color:${INK};">Every clownfish is covered by our <a href="${escapeHtml(EMAIL_BRAND.siteUrl)}/3-day-live-guarantee" style="color:${LINK};text-decoration:underline;">3-day live guarantee</a>. If something is wrong on arrival, contact us with photos and we will make it right.</p>
                ${summaryTableHtml({ rows, merchandiseSubtotalCents, shippingCents, totalCents })}
                ${addressHtml(address)}
                <p style="margin:24px 0 0;font-family:${FONT};font-size:15px;line-height:1.55;color:${MUTED};">Questions? Reply to this email or write <a href="mailto:${escapeHtml(EMAIL_BRAND.supportEmail)}" style="color:${LINK};text-decoration:underline;">${escapeHtml(EMAIL_BRAND.supportEmail)}</a>.</p>`

  return {
    subject,
    html: wrapEmail({
      title: 'Order confirmed',
      preheader: `Order ${orderNumber} is confirmed. We will email shipping and tracking details when it ships.`,
      bodyHtml,
    }),
    text: plainTextEmail({ bodyText }),
  }
}

export function buildShopOrderNotice(order) {
  const rows = itemRows(order.items)
  const address = addressLines(order.shippingAddress)
  const customerName = order.customerName || '—'
  const customerEmail = order.customerEmail || ''
  const workOrderLine = order.workOrderNumber ? `Work order ${order.workOrderNumber}` : ''

  const bodyText = [
    `New paid order ${order.orderNumber}`,
    workOrderLine,
    `Customer: ${customerName} <${customerEmail}>`,
    '',
    'This order is confirmed. Email the buyer shipping and tracking details when it ships.',
    'Live clownfish ship Monday through Thursday via UPS or FedEx overnight.',
    'Every fish is covered by our 3-day live guarantee.',
    '',
    ...summaryText(rows, address, order.merchandiseSubtotalCents, order.shippingCents, order.totalCents),
  ].filter(Boolean).join('\n')

  const workOrderHtml = order.workOrderNumber
    ? `<p style="margin:0 0 8px;font-family:${FONT};font-size:16px;line-height:1.55;color:${INK};"><strong>Work order:</strong> ${escapeHtml(order.workOrderNumber)}</p>`
    : ''

  const bodyHtml = `<p style="margin:0 0 12px;font-family:${FONT};font-size:16px;line-height:1.55;color:${INK};">A new order was paid on the website. Order <strong>${escapeHtml(order.orderNumber)}</strong> is confirmed.</p>
                ${workOrderHtml}
                <p style="margin:0 0 12px;font-family:${FONT};font-size:16px;line-height:1.55;color:${INK};"><strong>Customer:</strong> ${escapeHtml(customerName)}${customerEmail ? ` &lt;${escapeHtml(customerEmail)}&gt;` : ''}</p>
                <p style="margin:0 0 20px;font-family:${FONT};font-size:16px;line-height:1.55;color:${INK};">Email the buyer shipping and tracking details when it ships. Live clownfish ship Monday through Thursday via UPS or FedEx overnight. Every fish is covered by our 3-day live guarantee.</p>
                ${summaryTableHtml({
                  rows,
                  merchandiseSubtotalCents: order.merchandiseSubtotalCents,
                  shippingCents: order.shippingCents,
                  totalCents: order.totalCents,
                })}
                ${addressHtml(address)}`

  return {
    subject: `New order ${order.orderNumber}`,
    html: wrapEmail({
      title: 'New website order',
      preheader: `New paid order ${order.orderNumber} from ${customerName}.`,
      bodyHtml,
    }),
    text: plainTextEmail({ bodyText }),
  }
}

export function buildInquiryNotice(inquiry) {
  const typeLabel = inquiry.typeLabel || inquiry.type || 'Inquiry'
  const subject = `New ${typeLabel}: ${inquiry.subject || inquiry.name}`
  const lines = [
    typeLabel,
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    inquiry.phone ? `Phone: ${inquiry.phone}` : '',
    inquiry.subject ? `Subject: ${inquiry.subject}` : '',
    inquiry.related_product_slug ? `Fish: ${inquiry.related_product_slug}` : '',
    inquiry.related_pair_slug ? `Bonded pair: ${inquiry.related_pair_slug}` : '',
    '',
    inquiry.message,
  ].filter(Boolean)

  const detail = (label, value) => (
    value
      ? `<p style="margin:0 0 8px;font-family:${FONT};font-size:16px;line-height:1.55;color:${INK};"><strong>${label}:</strong> ${escapeHtml(value)}</p>`
      : ''
  )

  const bodyHtml = `${detail('Name', inquiry.name)}
                ${detail('Email', inquiry.email)}
                ${detail('Phone', inquiry.phone)}
                ${detail('Subject', inquiry.subject)}
                ${detail('Fish', inquiry.related_product_slug)}
                ${detail('Bonded pair', inquiry.related_pair_slug)}
                <p style="margin:16px 0 0;font-family:${FONT};font-size:16px;line-height:1.55;color:${INK};white-space:pre-line;">${escapeHtml(inquiry.message)}</p>`

  return {
    subject,
    html: wrapEmail({
      title: typeLabel,
      preheader: `${typeLabel} from ${inquiry.name || 'the website'}.`,
      bodyHtml,
    }),
    text: plainTextEmail({ bodyText: lines.join('\n') }),
  }
}
