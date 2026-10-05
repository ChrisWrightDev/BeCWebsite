import { Resend } from 'resend'
import { DEFAULT_EMAIL_FROM } from '#shared/orderEmail.js'

function envValue(name) {
  const value = process.env[name]
  return typeof value === 'string' ? value.trim() : ''
}

export function getMailSettings() {
  const config = useRuntimeConfig()
  const resendApiKey = envValue('RESEND_API_KEY') || envValue('NUXT_RESEND_API_KEY') || config.resendApiKey || ''
  const emailFrom = envValue('EMAIL_FROM') || envValue('NUXT_EMAIL_FROM') || config.emailFrom || DEFAULT_EMAIL_FROM
  const emailFromMarketing = envValue('EMAIL_FROM_MARKETING')
    || envValue('NUXT_EMAIL_FROM_MARKETING')
    || config.emailFromMarketing
    || ''
  const stripeWebhookSecret = envValue('STRIPE_WEBHOOK_SECRET')
    || envValue('NUXT_STRIPE_WEBHOOK_SECRET')
    || config.stripeWebhookSecret
    || ''
  return { resendApiKey, emailFrom, emailFromMarketing, stripeWebhookSecret }
}

// html should already be a full document from wrapEmail() or wrapMarketingEmail()
// in shared/emailLayout.js. Order confirmation, the staff new-order notice, and
// inquiry notices are transactional and omit unsubscribe. Release-list welcome
// mail passes `from` (EMAIL_FROM_MARKETING, defaulting to hello@) and an
// unsubscribe URL. Sending is skipped when RESEND_API_KEY is unset.
export async function sendEmail({ to, subject, html, text, replyTo, from, headers }) {
  const { resendApiKey, emailFrom } = getMailSettings()
  if (!resendApiKey) {
    console.warn('[email] RESEND_API_KEY is not set; skipping email to', to)
    return { skipped: true, sent: false }
  }

  const resend = new Resend(resendApiKey)
  const payload = {
    from: from || emailFrom,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
    text,
    replyTo: replyTo || undefined,
  }
  if (headers && Object.keys(headers).length) payload.headers = headers

  const { data, error } = await resend.emails.send(payload)

  if (error) {
    const message = error.message || 'Resend rejected the email'
    const failure = new Error(message)
    failure.cause = error
    throw failure
  }

  return { skipped: false, sent: true, id: data?.id }
}
