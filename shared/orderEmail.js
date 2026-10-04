import { formatUsdFromCents } from './retailShipping.js'

export const SHOP_NOTIFY_EMAIL = 'blueeyedclowns@gmail.com'
export const DEFAULT_EMAIL_FROM = 'Blue Eyed Clowns <onboarding@resend.dev>'

export function publicOrderNumber(orderId) {
  const compact = String(orderId || '').replace(/-/g, '').slice(0, 12).toUpperCase()
  return compact ? `BEC-${compact}` : 'BEC-ORDER'
}

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
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

  const text = [
    greeting,
    '',
    `Your order ${orderNumber} is confirmed. We will email shipping and tracking details when it ships.`,
    'Live clownfish ship Monday through Thursday via UPS or FedEx overnight.',
    'Every fish is covered by our 3-day live guarantee.',
    '',
    'Items:',
    ...rows.map((row) => `- ${row.name} × ${row.quantity} — ${formatUsdFromCents(row.lineCents)}`),
    '',
    `Merchandise: ${formatUsdFromCents(merchandiseSubtotalCents)}`,
    `Shipping: ${shippingCents === 0 ? 'Free' : formatUsdFromCents(shippingCents)}`,
    `Total: ${formatUsdFromCents(totalCents)}`,
    '',
    'Ships to:',
    ...address,
    '',
    'Questions? Reply to this email or write blueeyedclowns@gmail.com.',
  ].join('\n')

  const itemHtml = rows.map((row) => `
    <tr>
      <td style="padding:8px 0;color:#0f172a;">${escapeHtml(row.name)} × ${row.quantity}</td>
      <td style="padding:8px 0;color:#0f172a;text-align:right;">${escapeHtml(formatUsdFromCents(row.lineCents))}</td>
    </tr>
  `).join('')

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f8fafc;font-family:Georgia, 'Times New Roman', serif;color:#0f172a;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="background:#0f172a;padding:24px 28px;">
                <p style="margin:0;letter-spacing:0.14em;text-transform:uppercase;font-family:Arial, Helvetica, sans-serif;font-size:12px;color:#7dd3fc;">Blue Eyed Clowns</p>
                <h1 style="margin:8px 0 0;font-size:28px;line-height:1.2;color:#f8fafc;">Order confirmed</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;font-family:Arial, Helvetica, sans-serif;font-size:15px;line-height:1.55;color:#0f172a;">
                <p style="margin:0 0 12px;">${escapeHtml(greeting)}</p>
                <p style="margin:0 0 12px;">Thanks for your order. Your order number is <strong>${escapeHtml(orderNumber)}</strong>.</p>
                <p style="margin:0 0 12px;">We will email shipping and tracking details when your fish ships. Live animals ship Monday through Thursday via UPS or FedEx overnight.</p>
                <p style="margin:0 0 20px;">Every clownfish is covered by our 3-day live guarantee. If something is wrong on arrival, contact us with photos and we will make it right.</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e2e8f0;">
                  ${itemHtml}
                  <tr>
                    <td style="padding:8px 0;color:#475569;">Merchandise</td>
                    <td style="padding:8px 0;text-align:right;">${escapeHtml(formatUsdFromCents(merchandiseSubtotalCents))}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;color:#475569;">Shipping</td>
                    <td style="padding:8px 0;text-align:right;">${shippingCents === 0 ? 'Free' : escapeHtml(formatUsdFromCents(shippingCents))}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 0 0;border-top:1px solid #e2e8f0;font-weight:700;">Total</td>
                    <td style="padding:12px 0 0;border-top:1px solid #e2e8f0;text-align:right;font-weight:700;">${escapeHtml(formatUsdFromCents(totalCents))}</td>
                  </tr>
                </table>
                <h2 style="margin:24px 0 8px;font-size:16px;">Shipping address</h2>
                <p style="margin:0;white-space:pre-line;">${escapeHtml(address.join('\n'))}</p>
                <p style="margin:24px 0 0;color:#475569;">Questions? Reply to this email or write blueeyedclowns@gmail.com.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`

  return { subject, html, text }
}

export function buildShopOrderNotice(order) {
  const confirmation = buildOrderConfirmation(order)
  return {
    subject: `New order ${order.orderNumber}`,
    html: confirmation.html.replace('Order confirmed', 'New website order'),
    text: [
      `New paid order ${order.orderNumber}`,
      order.workOrderNumber ? `Work order ${order.workOrderNumber}` : '',
      `Customer: ${order.customerName || '—'} <${order.customerEmail}>`,
      '',
      confirmation.text,
    ].filter(Boolean).join('\n'),
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
  const text = lines.join('\n')
  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#f8fafc;font-family:Arial, Helvetica, sans-serif;color:#0f172a;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;">
      <tr>
        <td style="padding:24px;">
          <p style="margin:0;letter-spacing:0.12em;text-transform:uppercase;font-size:12px;color:#0369a1;">Blue Eyed Clowns</p>
          <h1 style="margin:8px 0 16px;font-size:22px;">${escapeHtml(typeLabel)}</h1>
          <p style="margin:0 0 8px;"><strong>Name:</strong> ${escapeHtml(inquiry.name)}</p>
          <p style="margin:0 0 8px;"><strong>Email:</strong> ${escapeHtml(inquiry.email)}</p>
          ${inquiry.phone ? `<p style="margin:0 0 8px;"><strong>Phone:</strong> ${escapeHtml(inquiry.phone)}</p>` : ''}
          ${inquiry.subject ? `<p style="margin:0 0 8px;"><strong>Subject:</strong> ${escapeHtml(inquiry.subject)}</p>` : ''}
          ${inquiry.related_product_slug ? `<p style="margin:0 0 8px;"><strong>Fish:</strong> ${escapeHtml(inquiry.related_product_slug)}</p>` : ''}
          ${inquiry.related_pair_slug ? `<p style="margin:0 0 8px;"><strong>Bonded pair:</strong> ${escapeHtml(inquiry.related_pair_slug)}</p>` : ''}
          <p style="margin:16px 0 0;white-space:pre-line;">${escapeHtml(inquiry.message)}</p>
        </td>
      </tr>
    </table>
  </body>
</html>`
  return { subject, html, text }
}
