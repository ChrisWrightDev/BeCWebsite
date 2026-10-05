import { EMAIL_BRAND, escapeHtml, plainTextMarketingEmail, wrapMarketingEmail } from './emailLayout.js'

export const RELEASE_LIST_WELCOME_SUBJECT = "You're on the Blue Eyed Clowns release list"
export const DEFAULT_EMAIL_FROM_MARKETING = 'Blue Eyed Clowns <hello@blueeyedclowns.com>'
export const RELEASE_LIST_SITE_URL = 'https://blueeyedclowns.com'

const FONT = 'Arial, Helvetica, sans-serif'
const INK = '#0f172a'
const MUTED = '#475569'
const LINK = '#0369a1'

/**
 * Marketing From address.
 * 1. EMAIL_FROM_MARKETING when it is set.
 * 2. Otherwise `Blue Eyed Clowns <hello@blueeyedclowns.com>`.
 * 3. EMAIL_FROM, only when that hello@ default is blank.
 *
 * To send release-list mail from the transactional address, set
 * EMAIL_FROM_MARKETING to the same value as EMAIL_FROM.
 *
 * @param {object} [options]
 * @param {string} [options.emailFromMarketing]
 * @param {string} [options.emailFrom]
 * @param {string} [options.defaultFrom]
 * @returns {string}
 */
export function resolveMarketingFromAddress({
  emailFromMarketing,
  emailFrom,
  defaultFrom = DEFAULT_EMAIL_FROM_MARKETING,
} = {}) {
  const marketing = String(emailFromMarketing || '').trim()
  if (marketing) return marketing
  const preferred = String(defaultFrom ?? DEFAULT_EMAIL_FROM_MARKETING).trim()
  if (preferred) return preferred
  return String(emailFrom || '').trim()
}

/**
 * @param {string|null|undefined} existingStatus
 * @returns {'skip'|'resubscribe'|'new'}
 */
export function releaseListWelcomeDecision(existingStatus) {
  if (existingStatus === 'subscribed') return 'skip'
  if (existingStatus === 'unsubscribed') return 'resubscribe'
  return 'new'
}

export function publicSiteOrigin(siteUrl) {
  const fallback = RELEASE_LIST_SITE_URL
  try {
    const url = new URL(String(siteUrl || '').trim() || fallback)
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return fallback
    return url.origin
  } catch {
    return fallback
  }
}

export function releaseListUnsubscribeUrl(token, siteUrl = RELEASE_LIST_SITE_URL) {
  const origin = publicSiteOrigin(siteUrl)
  const safeToken = String(token || '').trim().toLowerCase()
  return `${origin}/unsubscribe/${safeToken}`
}

export function releaseListShopUrl(siteUrl = RELEASE_LIST_SITE_URL) {
  return `${publicSiteOrigin(siteUrl)}/shop`
}

function paragraph(html) {
  return `<p style="margin:0 0 16px;font-family:${FONT};font-size:16px;line-height:1.55;color:${INK};">${html}</p>`
}

/**
 * Branded release-list welcome. Marketing shell, so the footer always has an unsubscribe link.
 *
 * @param {object} options
 * @param {string|null} [options.name]
 * @param {string} options.unsubscribeUrl
 * @param {string} [options.shopUrl]
 * @returns {{ subject: string, html: string, text: string }}
 */
export function buildReleaseListWelcome({ name, unsubscribeUrl, shopUrl } = {}) {
  const href = String(unsubscribeUrl || '').trim()
  if (!href) {
    throw new Error('Release list welcome requires an unsubscribe URL.')
  }

  const shop = String(shopUrl || releaseListShopUrl()).trim()
  const greeting = name ? `Hi ${name},` : 'Hi,'
  const subject = RELEASE_LIST_WELCOME_SUBJECT

  const bodyText = [
    greeting,
    '',
    'Thanks for joining the Blue Eyed Clowns release list.',
    "We'll email you when new captive-bred morphs and batches drop, including designer clownfish, so you can see them when they are listed.",
    '',
    'Our storefront is in the Florida Panhandle, open Monday through Friday from 10 AM to 5 PM CT.',
    `Visit the shop: ${shop}`,
    '',
    'Questions? Write blueeyedclowns@gmail.com.',
  ].join('\n')

  const bodyHtml = [
    paragraph(escapeHtml(greeting)),
    paragraph('Thanks for joining the Blue Eyed Clowns release list.'),
    paragraph("We'll email you when new captive-bred morphs and batches drop, including designer clownfish, so you can see them when they are listed."),
    paragraph('Our storefront is in the Florida Panhandle, open Monday through Friday from 10 AM to 5 PM CT.'),
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 16px;">
      <tr>
        <td bgcolor="#082f49" style="border-radius:999px;background-color:#082f49;">
          <a href="${escapeHtml(shop)}" style="display:inline-block;padding:12px 22px;font-family:${FONT};font-size:15px;line-height:1.2;font-weight:700;color:#f0f9ff;text-decoration:none;">Visit the shop</a>
        </td>
      </tr>
    </table>`,
    paragraph(`Or open <a href="${escapeHtml(shop)}" style="color:${LINK};text-decoration:underline;">${escapeHtml(shop.replace(/^https:\/\//, ''))}</a>.`),
    `<p style="margin:0;font-family:${FONT};font-size:15px;line-height:1.55;color:${MUTED};">Questions? Write <a href="mailto:${escapeHtml(EMAIL_BRAND.supportEmail)}" style="color:${LINK};text-decoration:underline;">${escapeHtml(EMAIL_BRAND.supportEmail)}</a>.</p>`,
  ].join('')

  return {
    subject,
    html: wrapMarketingEmail({
      title: "You're on the list",
      preheader: "Thanks for joining. We'll email you when new morphs drop.",
      bodyHtml,
      unsubscribeUrl: href,
    }),
    text: plainTextMarketingEmail({
      bodyText,
      unsubscribeUrl: href,
    }),
  }
}
