/**
 * Filled marketing HTML for Mission Control.
 * Run: node email-templates/sample-marketing.mjs
 *
 * bec-marketing-welcome-sample.html is the release-list welcome.
 * bec-marketing-shell-sample.html is a generic marketing shell.
 * Nothing in this script sends mail.
 */
import { writeFileSync } from 'node:fs'

import { wrapMarketingEmail } from '../shared/emailLayout.js'
import {
  DEFAULT_EMAIL_FROM_MARKETING,
  RELEASE_LIST_WELCOME_SUBJECT,
  buildReleaseListWelcome,
  releaseListShopUrl,
  releaseListUnsubscribeUrl,
} from '../shared/releaseListEmail.js'

export const SAMPLE_WELCOME_NAME = 'Avery Sample'
export const SAMPLE_UNSUBSCRIBE_TOKEN = 'a'.repeat(64)

export const sampleWelcomeInput = {
  name: SAMPLE_WELCOME_NAME,
  unsubscribeUrl: releaseListUnsubscribeUrl(SAMPLE_UNSUBSCRIBE_TOKEN),
  shopUrl: releaseListShopUrl(),
}

const GENERIC_UNSUBSCRIBE = '{{unsubscribe_url}}'

export function genericMarketingShellHtml() {
  return wrapMarketingEmail({
    title: 'New captive-bred batch',
    preheader: 'Snowflake and designer clownfish just landed on the site.',
    bodyHtml: '<p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.55;color:#0f172a;">A new batch is listed at <a href="https://blueeyedclowns.com/shop" style="color:#0369a1;">blueeyedclowns.com/shop</a>.</p>',
    unsubscribeUrl: GENERIC_UNSUBSCRIBE,
  })
}

const isDirect = process.argv[1] && process.argv[1].endsWith('sample-marketing.mjs')

if (isDirect) {
  const welcome = buildReleaseListWelcome(sampleWelcomeInput)
  const welcomeBanner = `<!--
  Blue-Eyed Clowns release-list welcome. Filled sample for Mission Control.
  Regenerated via: node email-templates/sample-marketing.mjs
  This file does not send itself.
  Subject: ${RELEASE_LIST_WELCOME_SUBJECT}
  From: ${DEFAULT_EMAIL_FROM_MARKETING}
  Mock only: ${SAMPLE_WELCOME_NAME}. Unsubscribe URL uses a fake token.
-->
`
  writeFileSync(
    new URL('./bec-marketing-welcome-sample.html', import.meta.url),
    `${welcomeBanner}${welcome.html}`
  )

  const shellBanner = `<!--
  Blue-Eyed Clowns generic marketing shell for Mission Control.
  Regenerated via: node email-templates/sample-marketing.mjs
  This file does not send itself.
  Marketing mail must pass unsubscribeUrl. This sample uses {{unsubscribe_url}}.
  Transactional mail uses wrapEmail and omits that link.
-->
`
  writeFileSync(
    new URL('./bec-marketing-shell-sample.html', import.meta.url),
    `${shellBanner}${genericMarketingShellHtml()}`
  )
}
