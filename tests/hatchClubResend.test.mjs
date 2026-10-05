import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import {
  firstNameFromSubscriberName,
  isDuplicateContactError,
  isIgnorableMembershipError,
  syncSubscribedContact,
  syncUnsubscribedContact,
} from '../server/utils/hatchClubResend.js'

const settings = { resendApiKey: 're_test', segmentId: 'seg_hatch_club' }

function fakeResend(handlers = {}) {
  const calls = []
  return {
    calls,
    contacts: {
      async create(payload) {
        calls.push(['create', payload])
        return handlers.create?.(payload) ?? { data: { id: 'contact_1' }, error: null }
      },
      async update(payload) {
        calls.push(['update', payload])
        return handlers.update?.(payload) ?? { data: { id: 'contact_1' }, error: null }
      },
      segments: {
        async add(payload) {
          calls.push(['add', payload])
          return handlers.add?.(payload) ?? { data: { id: 'seg_hatch_club' }, error: null }
        },
        async remove(payload) {
          calls.push(['remove', payload])
          return handlers.remove?.(payload) ?? { data: { deleted: true }, error: null }
        },
      },
    },
  }
}

assert.equal(firstNameFromSubscriberName('Ada Lovelace'), 'Ada')
assert.equal(firstNameFromSubscriberName('  Ada   Lovelace  '), 'Ada')
assert.equal(firstNameFromSubscriberName('Ada'), 'Ada')
assert.equal(firstNameFromSubscriberName(''), '')
assert.equal(firstNameFromSubscriberName(null), '')

assert.equal(isDuplicateContactError({ name: 'contact_already_exists', message: 'nope' }), true)
assert.equal(isDuplicateContactError({ name: 'validation_error', message: 'Contact already exists' }), true)
assert.equal(isDuplicateContactError({ name: 'validation_error', message: 'Email already in use' }), true)
assert.equal(isDuplicateContactError({ statusCode: 409, name: 'conflict', message: 'Conflict' }), true)
assert.equal(isDuplicateContactError({ name: 'validation_error', message: 'Invalid email' }), false)
assert.equal(isIgnorableMembershipError({ statusCode: 404, name: 'not_found', message: 'Contact not found' }), true)
assert.equal(isIgnorableMembershipError({ statusCode: 422, name: 'validation_error', message: 'Invalid segment' }), false)

const missing = fakeResend()
const skipped = await syncSubscribedContact(
  { email: 'Ada@Example.com', name: 'Ada Lovelace' },
  { settings: { resendApiKey: 're_test', segmentId: '' }, resend: missing }
)
assert.equal(skipped.skipped, true)
assert.equal(skipped.ok, true)
assert.equal(missing.calls.length, 0)

const createdClient = fakeResend()
const created = await syncSubscribedContact(
  { email: 'Ada@Example.com', name: 'Ada Lovelace' },
  { settings, resend: createdClient }
)
assert.equal(created.action, 'created')
assert.deepEqual(createdClient.calls, [[
  'create',
  {
    email: 'ada@example.com',
    firstName: 'Ada',
    unsubscribed: false,
    segments: [{ id: 'seg_hatch_club' }],
  },
]])

const nameless = fakeResend()
await syncSubscribedContact({ email: 'ada@example.com', name: null }, { settings, resend: nameless })
assert.equal(Object.hasOwn(nameless.calls[0][1], 'firstName'), false)

const existing = fakeResend({
  create: () => ({ data: null, error: { name: 'contact_already_exists', message: 'Contact already exists', statusCode: 409 } }),
})
const updated = await syncSubscribedContact(
  { email: 'ada@example.com', name: 'Ada' },
  { settings, resend: existing }
)
assert.equal(updated.action, 'updated')
assert.deepEqual(existing.calls.map((call) => call[0]), ['create', 'update', 'add'])
assert.equal(existing.calls[1][1].unsubscribed, false)
assert.equal(existing.calls[1][1].firstName, 'Ada')
assert.deepEqual(existing.calls[2][1], { email: 'ada@example.com', segmentId: 'seg_hatch_club' })

const createFailed = fakeResend({
  create: () => ({ data: null, error: { name: 'restricted_api_key', message: 'This API key is restricted', statusCode: 403 } }),
})
const failed = await syncSubscribedContact({ email: 'ada@example.com' }, { settings, resend: createFailed })
assert.equal(failed.ok, false)
assert.equal(failed.action, 'create_failed')
assert.deepEqual(createFailed.calls.map((call) => call[0]), ['create'])

const thrown = fakeResend({
  create: () => { throw new Error('network down') },
})
const threw = await syncSubscribedContact({ email: 'ada@example.com' }, { settings, resend: thrown })
assert.equal(threw.ok, false)
assert.equal(threw.action, 'threw')

const unsubscribed = fakeResend()
const off = await syncUnsubscribedContact({ email: 'Ada@Example.com' }, { settings, resend: unsubscribed })
assert.equal(off.action, 'unsubscribed')
assert.deepEqual(unsubscribed.calls[0], ['update', { email: 'ada@example.com', unsubscribed: true }])
assert.deepEqual(unsubscribed.calls[1], ['remove', { email: 'ada@example.com', segmentId: 'seg_hatch_club' }])
assert.equal(Object.hasOwn(unsubscribed.calls[0][1], 'firstName'), false)

const alreadyGone = fakeResend({
  update: () => ({ data: null, error: { name: 'not_found', message: 'Contact not found', statusCode: 404 } }),
  remove: () => ({ data: null, error: { name: 'not_found', message: 'Contact not found', statusCode: 404 } }),
})
const gone = await syncUnsubscribedContact({ email: 'ada@example.com' }, { settings, resend: alreadyGone })
assert.equal(gone.ok, true)
assert.equal(gone.action, 'unsubscribed')

const removeFailed = fakeResend({
  remove: () => ({ data: null, error: { name: 'validation_error', message: 'Invalid segment', statusCode: 422 } }),
})
const removeResult = await syncUnsubscribedContact({ email: 'ada@example.com' }, { settings, resend: removeFailed })
assert.equal(removeResult.ok, false)

const subscribeSource = readFileSync(new URL('../server/api/subscribers/index.post.js', import.meta.url), 'utf8')
const unsubscribeSource = readFileSync(new URL('../server/api/subscribers/unsubscribe.post.js', import.meta.url), 'utf8')
assert.match(subscribeSource, /await syncHatchClub\(\{ email, name: storedName \}\)/)
assert.match(unsubscribeSource, /syncUnsubscribedContact/)
assert.match(unsubscribeSource, /\.select\('id, email'\)/)
assert.doesNotMatch(subscribeSource, /broadcasts\.create|emails\.send/)
assert.doesNotMatch(unsubscribeSource, /\.delete\(/)

console.log('hatch club resend tests passed')
