/**
 * Shared branded HTML shell for every Blue Eyed Clowns email sent through Resend.
 *
 * Inline styles and tables only — no flex or grid. Callers pass body HTML they
 * have already escaped. Transactional mail omits `unsubscribeUrl` (or passes
 * null). Marketing and release-list mail passes the ESP placeholder
 * `{{unsubscribe_url}}`, or a real URL.
 *
 * Marketing / ops reuse:
 *
 *   import { wrapEmail, plainTextEmail } from './emailLayout.js'
 *
 *   const html = wrapEmail({
 *     title: 'New captive-bred batch',
 *     preheader: 'Snowflake and designer clownfish just landed on the site.',
 *     bodyHtml: '<p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.55;color:#0f172a;">A new batch is listed at <a href="https://blueeyedclowns.com/shop" style="color:#0369a1;">blueeyedclowns.com/shop</a>.</p>',
 *     unsubscribeUrl: '{{unsubscribe_url}}',
 *   })
 *
 *   const text = plainTextEmail({
 *     bodyText: 'A new batch is listed at https://blueeyedclowns.com/shop.',
 *     unsubscribeUrl: '{{unsubscribe_url}}',
 *   })
 *
 * A filled order-confirmation sample for Mission Control lives at
 * email-templates/bec-email-shell.html. A manual Resend test payload lives at
 * email-templates/bec-order-confirmation-sample.html (subject
 * `Order BEC-TESTEMAIL01 confirmed — Blue Eyed Clowns`, from
 * `Blue Eyed Clowns <orders@blueeyedclowns.com>`). Regenerate both with
 * `node email-templates/sample-order.mjs`. Nothing there sends mail.
 */

export const EMAIL_BRAND = {
  name: 'Blue-Eyed Clowns',
  tagline: 'Captive-bred clownfish',
  siteUrl: 'https://blueeyedclowns.com',
  supportEmail: 'blueeyedclowns@gmail.com',
  logoUrl: 'https://blueeyedclowns.com/images/logo.png',
  storefrontLine: 'Florida Panhandle · Storefront Mon–Fri 10 AM–5 PM CT',
  socials: [
    { name: 'TikTok', href: 'https://www.tiktok.com/@blueeyedclowns' },
    { name: 'Instagram', href: 'https://www.instagram.com/blueeyed_clowns/' },
    { name: 'X', href: 'https://x.com/blueeyedclowns' },
    { name: 'Facebook', href: 'https://www.facebook.com/people/Blue-Eyed-Clowns-LLC/61561203417011/' },
  ],
}

const FONT = 'Arial, Helvetica, sans-serif'
const INK = '#0f172a'
const MUTED = '#475569'
const LINK = '#0369a1'
const HEADER = '#082f49'
const ACCENT = '#38bdf8'
const PAGE = '#f0f9ff'
const CARD = '#ffffff'

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function unsubscribeHref(unsubscribeUrl) {
  if (unsubscribeUrl == null) return ''
  const value = String(unsubscribeUrl).trim()
  return value
}

function socialLinksHtml() {
  return EMAIL_BRAND.socials.map((profile) => (
    `<a href="${escapeHtml(profile.href)}" style="color:${LINK};text-decoration:underline;">${escapeHtml(profile.name)}</a>`
  )).join(' <span style="color:#94a3b8;">&middot;</span> ')
}

function footerHtml(unsubscribeUrl) {
  const href = unsubscribeHref(unsubscribeUrl)
  const unsubscribe = href
    ? `<p style="margin:16px 0 0;font-family:${FONT};font-size:13px;line-height:1.5;color:${MUTED};"><a href="${escapeHtml(href)}" style="color:${LINK};text-decoration:underline;">Unsubscribe</a></p>`
    : ''

  return `<tr>
              <td bgcolor="#e0f2fe" style="padding:22px 28px 24px;background-color:#e0f2fe;border-top:1px solid #bae6fd;font-family:${FONT};font-size:13px;line-height:1.55;color:${MUTED};">
                <p style="margin:0 0 8px;font-family:${FONT};font-size:13px;line-height:1.55;color:${MUTED};">${escapeHtml(EMAIL_BRAND.storefrontLine)}</p>
                <p style="margin:0 0 8px;font-family:${FONT};font-size:13px;line-height:1.55;color:${MUTED};"><a href="mailto:${escapeHtml(EMAIL_BRAND.supportEmail)}" style="color:${LINK};text-decoration:underline;">${escapeHtml(EMAIL_BRAND.supportEmail)}</a></p>
                <p style="margin:0 0 8px;font-family:${FONT};font-size:13px;line-height:1.55;color:${MUTED};"><a href="${escapeHtml(EMAIL_BRAND.siteUrl)}" style="color:${LINK};text-decoration:underline;">${escapeHtml(EMAIL_BRAND.siteUrl.replace(/^https:\/\//, ''))}</a></p>
                <p style="margin:0;font-family:${FONT};font-size:13px;line-height:1.55;color:${MUTED};">${socialLinksHtml()}</p>
                ${unsubscribe}
                <p style="margin:16px 0 0;font-family:${FONT};font-size:12px;line-height:1.5;color:#64748b;">&copy; ${new Date().getFullYear()} ${escapeHtml(EMAIL_BRAND.name)}. Captive-bred clownfish hatchery.</p>
              </td>
            </tr>`
}

/**
 * @param {object} [options]
 * @param {string} [options.title] Visible heading in the branded header.
 * @param {string} [options.preheader] Inbox preview text, hidden in the body.
 * @param {string} [options.bodyHtml] Main content HTML. Not escaped.
 * @param {string|null} [options.unsubscribeUrl] Marketing placeholder or URL. Null omits the line.
 * @returns {string}
 */
export function wrapEmail({ title = '', preheader = '', bodyHtml = '', unsubscribeUrl = null } = {}) {
  const safeTitle = escapeHtml(title)
  const safePreheader = escapeHtml(preheader)
  const heading = safeTitle
    ? `<h1 style="margin:18px 0 0;font-family:${FONT};font-size:26px;line-height:1.25;font-weight:700;color:#f8fafc;">${safeTitle}</h1>`
    : ''

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>${safeTitle || escapeHtml(EMAIL_BRAND.name)}</title>
  </head>
  <body style="margin:0;padding:0;background-color:${PAGE};">
    <!-- bec-email-shell -->
    <div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">
      ${safePreheader}
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${PAGE}" style="background-color:${PAGE};">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${CARD}" style="max-width:600px;width:100%;background-color:${CARD};border:1px solid #bae6fd;">
            <tr>
              <td bgcolor="${HEADER}" style="padding:24px 28px 22px;background-color:${HEADER};">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td valign="middle" style="padding:0 14px 0 0;">
                      <img src="${escapeHtml(EMAIL_BRAND.logoUrl)}" width="64" height="64" alt="${escapeHtml(EMAIL_BRAND.name)}" style="display:block;border:0;outline:none;text-decoration:none;width:64px;height:64px;border-radius:32px;">
                    </td>
                    <td valign="middle">
                      <p style="margin:0;font-family:${FONT};font-size:18px;line-height:1.2;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#f0f9ff;">${escapeHtml(EMAIL_BRAND.name)}</p>
                      <p style="margin:6px 0 0;font-family:${FONT};font-size:13px;line-height:1.4;color:#7dd3fc;">${escapeHtml(EMAIL_BRAND.tagline)}</p>
                    </td>
                  </tr>
                </table>
                ${heading}
              </td>
            </tr>
            <tr>
              <td height="4" bgcolor="${ACCENT}" style="height:4px;line-height:4px;font-size:0;background-color:${ACCENT};">&nbsp;</td>
            </tr>
            <tr>
              <td style="padding:28px;font-family:${FONT};font-size:16px;line-height:1.55;color:${INK};">
                ${bodyHtml}
              </td>
            </tr>
            ${footerHtml(unsubscribeUrl)}
          </table>
          <!--[if mso]></td></tr></table><![endif]-->
        </td>
      </tr>
    </table>
  </body>
</html>`
}

/**
 * Plain-text companion with the same footer facts as {@link wrapEmail}.
 *
 * @param {object} [options]
 * @param {string} [options.bodyText]
 * @param {string|null} [options.unsubscribeUrl]
 * @returns {string}
 */
export function plainTextEmail({ bodyText = '', unsubscribeUrl = null } = {}) {
  const href = unsubscribeHref(unsubscribeUrl)
  const lines = [
    String(bodyText ?? '').replace(/\s+$/u, ''),
    '',
    '—',
    EMAIL_BRAND.name,
    EMAIL_BRAND.tagline,
    EMAIL_BRAND.storefrontLine,
    EMAIL_BRAND.supportEmail,
    EMAIL_BRAND.siteUrl,
    ...EMAIL_BRAND.socials.map((profile) => `${profile.name}: ${profile.href}`),
  ]
  if (href) {
    lines.push('', `Unsubscribe: ${href}`)
  }
  return lines.join('\n')
}
