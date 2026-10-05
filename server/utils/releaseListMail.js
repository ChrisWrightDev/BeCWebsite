import { EMAIL_BRAND } from '#shared/emailLayout.js'
import {
  buildReleaseListWelcome,
  releaseListShopUrl,
  releaseListUnsubscribeUrl,
  resolveMarketingFromAddress,
} from '#shared/releaseListEmail.js'
import { getMailSettings, sendEmail } from './mailer.js'

export async function sendReleaseListWelcome({ email, name, token }) {
  const config = useRuntimeConfig()
  const origin = config.public?.siteUrl || 'https://blueeyedclowns.com'
  const unsubscribeUrl = releaseListUnsubscribeUrl(token, origin)
  const message = buildReleaseListWelcome({
    name,
    unsubscribeUrl,
    shopUrl: releaseListShopUrl(origin),
  })
  const settings = getMailSettings()

  return sendEmail({
    to: email,
    from: resolveMarketingFromAddress(settings),
    replyTo: EMAIL_BRAND.supportEmail,
    subject: message.subject,
    html: message.html,
    text: message.text,
    headers: {
      'List-Unsubscribe': `<${unsubscribeUrl}>`,
    },
  })
}
