import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'

import { UNSUBSCRIBE_REASONS, validateUnsubscribeInput } from '../shared/publicForms.js'
import {
  DEFAULT_EMAIL_FROM_MARKETING,
  RELEASE_LIST_WELCOME_SUBJECT,
  buildReleaseListWelcome,
  publicSiteOrigin,
  releaseListUnsubscribeUrl,
  releaseListWelcomeDecision,
  resolveMarketingFromAddress,
} from '../shared/releaseListEmail.js'
import {
  genericMarketingShellHtml,
  sampleWelcomeInput,
} from '../email-templates/sample-marketing.mjs'

assert.equal(releaseListWelcomeDecision('subscribed'), 'skip')
assert.equal(releaseListWelcomeDecision('unsubscribed'), 'resubscribe')
assert.equal(releaseListWelcomeDecision(undefined), 'new')
assert.equal(releaseListWelcomeDecision(null), 'new')

assert.equal(
  resolveMarketingFromAddress({}),
  DEFAULT_EMAIL_FROM_MARKETING
)
assert.equal(
  resolveMarketingFromAddress({
    emailFromMarketing: 'Blue Eyed Clowns <orders@blueeyedclowns.com>',
    emailFrom: 'Blue Eyed Clowns <orders@blueeyedclowns.com>',
  }),
  'Blue Eyed Clowns <orders@blueeyedclowns.com>'
)
assert.equal(
  resolveMarketingFromAddress({
    emailFromMarketing: '  ',
    emailFrom: 'Blue Eyed Clowns <orders@blueeyedclowns.com>',
  }),
  'Blue Eyed Clowns <hello@blueeyedclowns.com>'
)
assert.equal(
  resolveMarketingFromAddress({
    emailFromMarketing: '',
    emailFrom: 'Blue Eyed Clowns <orders@blueeyedclowns.com>',
    defaultFrom: '',
  }),
  'Blue Eyed Clowns <orders@blueeyedclowns.com>'
)

const token = 'ab'.repeat(32)
assert.equal(token.length, 64)
assert.equal(
  releaseListUnsubscribeUrl(token),
  `https://blueeyedclowns.com/unsubscribe/${token}`
)
assert.equal(publicSiteOrigin('not a url'), 'https://blueeyedclowns.com')
assert.equal(
  releaseListUnsubscribeUrl(token, 'https://preview.example.com/shop'),
  `https://preview.example.com/unsubscribe/${token}`
)

const welcome = buildReleaseListWelcome({
  name: 'Ada <script>',
  unsubscribeUrl: releaseListUnsubscribeUrl(token),
  shopUrl: 'https://blueeyedclowns.com/shop',
})
assert.equal(welcome.subject, RELEASE_LIST_WELCOME_SUBJECT)
assert.match(welcome.subject, /You're on the Blue Eyed Clowns release list/)
assert.match(welcome.html, /bec-email-shell/)
assert.match(welcome.html, /Thanks for joining the Blue Eyed Clowns release list/)
assert.match(welcome.html, /new captive-bred morphs and batches drop/)
assert.match(welcome.html, /Florida Panhandle/)
assert.match(welcome.html, /Monday through Friday from 10 AM to 5 PM CT/)
assert.match(welcome.html, /https:\/\/blueeyedclowns\.com\/shop/)
assert.match(welcome.html, new RegExp(`https://blueeyedclowns\\.com/unsubscribe/${token}`))
assert.match(welcome.html, />Unsubscribe<\/a> from release-list emails/)
assert.match(welcome.html, /Ada &lt;script&gt;/)
assert.doesNotMatch(welcome.html, /<script>/)
assert.doesNotMatch(welcome.html, /display\s*:\s*flex/i)
assert.doesNotMatch(welcome.html, /display\s*:\s*grid/i)
assert.match(welcome.text, /Visit the shop: https:\/\/blueeyedclowns\.com\/shop/)
assert.match(welcome.text, new RegExp(`Unsubscribe from release-list emails: https://blueeyedclowns\\.com/unsubscribe/${token}`))
assert.throws(() => buildReleaseListWelcome({ name: 'Ada' }), /unsubscribe URL/)

const shell = genericMarketingShellHtml()
assert.match(shell, /\{\{unsubscribe_url\}\}/)
assert.match(shell, />Unsubscribe<\/a> from release-list emails/)
assert.match(shell, /New captive-bred batch/)
assert.doesNotMatch(shell, /display\s*:\s*flex/i)

const welcomeFile = readFileSync(
  new URL('../email-templates/bec-marketing-welcome-sample.html', import.meta.url),
  'utf8'
)
const welcomeHtml = buildReleaseListWelcome(sampleWelcomeInput).html
assert.ok(welcomeFile.includes(welcomeHtml))
assert.ok(welcomeFile.includes(`Subject: ${RELEASE_LIST_WELCOME_SUBJECT}`))
assert.ok(welcomeFile.includes(`From: ${DEFAULT_EMAIL_FROM_MARKETING}`))
assert.match(welcomeFile, /Avery Sample/)
assert.match(welcomeFile, />Unsubscribe</)

const shellFile = readFileSync(
  new URL('../email-templates/bec-marketing-shell-sample.html', import.meta.url),
  'utf8'
)
assert.ok(shellFile.includes(shell))
assert.match(shellFile, /wrapMarketingEmail|unsubscribeUrl/)
assert.match(shellFile, /\{\{unsubscribe_url\}\}/)

const orderSample = readFileSync(
  new URL('../email-templates/bec-order-confirmation-sample.html', import.meta.url),
  'utf8'
)
assert.equal(orderSample.includes('>Unsubscribe<'), false)

assert.deepEqual(UNSUBSCRIBE_REASONS, [
  'Too many emails',
  'Not interested right now',
  'Never signed up',
  'Other',
])

const valid = validateUnsubscribeInput({
  token: token.toUpperCase(),
  reason: 'Other',
  feedback: '  Just browsing.  ',
})
assert.equal(valid.ok, true)
assert.equal(valid.value.token, token)
assert.equal(valid.value.reason, 'Other')
assert.equal(valid.value.feedback, 'Just browsing.')

assert.equal(validateUnsubscribeInput({ token: 'short', reason: 'Other' }).ok, false)
assert.match(validateUnsubscribeInput({ token, reason: '' }).error, /Choose why/)
assert.equal(validateUnsubscribeInput({ token, reason: 'Too many emails', feedback: '' }).value.feedback, null)
assert.match(
  validateUnsubscribeInput({ token, reason: 'Other', feedback: 'x'.repeat(1001) }).error,
  /1,000/
)

const migrationName = readdirSync(new URL('../supabase/migrations/', import.meta.url))
  .find((name) => name.endsWith('_subscriber_unsubscribe_feedback.sql'))
assert.ok(migrationName)
const migration = readFileSync(new URL(`../supabase/migrations/${migrationName}`, import.meta.url), 'utf8')
assert.match(migration, /unsubscribe_reason/)
assert.match(migration, /unsubscribe_feedback/)
for (const reason of UNSUBSCRIBE_REASONS) {
  assert.ok(migration.includes(`'${reason}'`))
}
assert.match(migration, /enable row level security/i)
assert.match(migration, /Admins can select subscribers/)
assert.match(migration, /for select/)
assert.match(migration, /grant select on table public\.subscribers to authenticated/)
assert.match(migration, /grant select, insert, update, delete on table public\.subscribers to service_role/)
assert.doesNotMatch(migration, /for update/i)
assert.doesNotMatch(migration, /for insert/i)
assert.doesNotMatch(migration, /for delete/i)
assert.doesNotMatch(migration, /delete\s+from\s+public\.subscribers/i)
assert.doesNotMatch(migration, /to anon/i)

const unsubscribeRoute = readFileSync(
  new URL('../server/api/subscribers/unsubscribe.post.js', import.meta.url),
  'utf8'
)
assert.match(unsubscribeRoute, /unsubscribe_reason/)
assert.match(unsubscribeRoute, /unsubscribe_feedback/)
assert.match(unsubscribeRoute, /unsubscribed_at/)
assert.doesNotMatch(unsubscribeRoute, /\.delete\(/)

const subscribeRoute = readFileSync(
  new URL('../server/api/subscribers/index.post.js', import.meta.url),
  'utf8'
)
assert.match(subscribeRoute, /sendReleaseListWelcome/)
assert.match(subscribeRoute, /decision === 'skip'/)
assert.match(subscribeRoute, /unsubscribe_reason: null/)
assert.doesNotMatch(subscribeRoute, /\.delete\(/)

console.log('release list email tests passed')
