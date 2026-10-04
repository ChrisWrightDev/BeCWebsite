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
  const stripeWebhookSecret = envValue('STRIPE_WEBHOOK_SECRET')
    || envValue('NUXT_STRIPE_WEBHOOK_SECRET')
    || config.stripeWebhookSecret
    || ''
  return { resendApiKey, emailFrom, stripeWebhookSecret }
}

export async function sendEmail({ to, subject, html, text, replyTo }) {
  const { resendApiKey, emailFrom } = getMailSettings()
  if (!resendApiKey) {
    console.warn('[email] RESEND_API_KEY is not set; skipping email to', to)
    return { skipped: true }
  }

  const resend = new Resend(resendApiKey)
  const { data, error } = await resend.emails.send({
    from: emailFrom,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
    text,
    replyTo: replyTo || undefined,
  })

  if (error) {
    const message = error.message || 'Resend rejected the email'
    const failure = new Error(message)
    failure.cause = error
    throw failure
  }

  return { skipped: false, id: data?.id }
}
