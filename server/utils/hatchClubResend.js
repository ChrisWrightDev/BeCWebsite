import { Resend } from 'resend'

// public.subscribers stays the source of truth. These calls mirror that row
// into Resend so Hatch Club broadcasts can target the segment. Failures are
// logged and never thrown: signup and unsubscribe HTTP responses must succeed
// even when Resend is down, the segment id is unset, or the key is send-only.

function envValue(name) {
  const value = process.env[name]
  return typeof value === 'string' ? value.trim() : ''
}

function runtimeValue(key) {
  if (typeof useRuntimeConfig !== 'function') return ''
  try {
    const value = useRuntimeConfig()?.[key]
    return typeof value === 'string' ? value.trim() : ''
  } catch {
    return ''
  }
}

export function readHatchClubSettings() {
  const resendApiKey = envValue('RESEND_API_KEY')
    || envValue('NUXT_RESEND_API_KEY')
    || runtimeValue('resendApiKey')
  const segmentId = envValue('RESEND_HATCH_CLUB_SEGMENT_ID')
    || envValue('NUXT_RESEND_HATCH_CLUB_SEGMENT_ID')
    || runtimeValue('resendHatchClubSegmentId')
  return { resendApiKey, segmentId }
}

// The signup form stores a single name. Resend contacts have a separate first name.
export function firstNameFromSubscriberName(name) {
  const cleaned = String(name || '').replace(/\s+/g, ' ').trim()
  if (!cleaned) return ''
  return cleaned.split(' ')[0].slice(0, 100)
}

export function isDuplicateContactError(error) {
  const status = Number(error?.statusCode)
  const name = String(error?.name || '').toLowerCase()
  const message = String(error?.message || '').toLowerCase()
  if (status === 409) return true
  if (name.includes('already_exists') || name.includes('duplicate')) return true
  return /already exists|already in use|duplicate/.test(message)
}

// Removing someone who is not in the segment, or adding someone who already is,
// still leaves them in the intended broadcast state.
export function isIgnorableMembershipError(error) {
  const status = Number(error?.statusCode)
  if (status === 404 || status === 409) return true
  const name = String(error?.name || '').toLowerCase()
  const message = String(error?.message || '').toLowerCase()
  if (name.includes('not_found') || name.includes('already')) return true
  return /not found|already (exists|in)|duplicate/.test(message)
}

function describeResendError(error) {
  const status = error?.statusCode
  const name = error?.name || 'resend_error'
  const message = error?.message || 'Resend request failed'
  const permission = status === 401
    || status === 403
    || /restricted_api_key|invalid_api_key|unauthorized|forbidden/i.test(`${name} ${message}`)
  const hint = permission
    ? ' The API key may be send-only. Contacts and Segments need a Full access or Contacts-capable key.'
    : ''
  return `${name}${status ? ` (${status})` : ''}: ${message}.${hint}`
}

function missingConfig(settings) {
  return [
    !settings.resendApiKey ? 'RESEND_API_KEY' : null,
    !settings.segmentId ? 'RESEND_HATCH_CLUB_SEGMENT_ID' : null,
  ].filter(Boolean)
}

function clientFor(settings, resend) {
  return resend || new Resend(settings.resendApiKey)
}

function contactPayload(email, name, extra) {
  const payload = { email, ...extra }
  const firstName = firstNameFromSubscriberName(name)
  if (firstName) payload.firstName = firstName
  return payload
}

export async function syncSubscribedContact(subscriber, options = {}) {
  const email = String(subscriber?.email || '').trim().toLowerCase()
  const settings = options.settings || readHatchClubSettings()
  const missing = missingConfig(settings)
  if (!email || missing.length) {
    if (missing.length) {
      console.warn(`[hatch-club] skipping Resend sync; ${missing.join(' and ')} is unset`)
    }
    return { ok: true, skipped: true, reason: missing.length ? 'missing_config' : 'missing_email' }
  }

  try {
    const resend = clientFor(settings, options.resend)
    const created = await resend.contacts.create(contactPayload(email, subscriber?.name, {
      unsubscribed: false,
      segments: [{ id: settings.segmentId }],
    }))
    if (!created?.error) return { ok: true, skipped: false, action: 'created' }

    if (!isDuplicateContactError(created.error)) {
      console.error('[hatch-club] create contact failed', email, describeResendError(created.error))
      return { ok: false, skipped: false, action: 'create_failed' }
    }

    const updated = await resend.contacts.update(contactPayload(email, subscriber?.name, {
      unsubscribed: false,
    }))
    if (updated?.error) {
      console.error('[hatch-club] update contact failed', email, describeResendError(updated.error))
      return { ok: false, skipped: false, action: 'update_failed' }
    }

    const added = await resend.contacts.segments.add({
      email,
      segmentId: settings.segmentId,
    })
    if (added?.error && !isIgnorableMembershipError(added.error)) {
      console.error('[hatch-club] add to segment failed', email, describeResendError(added.error))
      return { ok: false, skipped: false, action: 'segment_failed' }
    }
    return { ok: true, skipped: false, action: 'updated' }
  } catch (error) {
    console.error('[hatch-club] subscribe sync failed', email, error)
    return { ok: false, skipped: false, action: 'threw' }
  }
}

export async function syncUnsubscribedContact(subscriber, options = {}) {
  const email = String(subscriber?.email || '').trim().toLowerCase()
  const settings = options.settings || readHatchClubSettings()
  const missing = missingConfig(settings)
  if (!email || missing.length) {
    if (missing.length) {
      console.warn(`[hatch-club] skipping Resend sync; ${missing.join(' and ')} is unset`)
    }
    return { ok: true, skipped: true, reason: missing.length ? 'missing_config' : 'missing_email' }
  }

  try {
    const resend = clientFor(settings, options.resend)
    // unsubscribed:true stops every broadcast, including ones to a segment the
    // contact is still in. Removing the segment keeps Hatch Club itself accurate.
    const updated = await resend.contacts.update({
      email,
      unsubscribed: true,
    })
    const updateMissing = updated?.error && isIgnorableMembershipError(updated.error)
    if (updated?.error && !updateMissing) {
      console.error('[hatch-club] unsubscribe contact failed', email, describeResendError(updated.error))
    }

    const removed = await resend.contacts.segments.remove({
      email,
      segmentId: settings.segmentId,
    })
    const removeMissing = removed?.error && isIgnorableMembershipError(removed.error)
    if (removed?.error && !removeMissing) {
      console.error('[hatch-club] remove from segment failed', email, describeResendError(removed.error))
    }

    if ((updated?.error && !updateMissing) || (removed?.error && !removeMissing)) {
      return { ok: false, skipped: false, action: 'unsubscribe_failed' }
    }
    return { ok: true, skipped: false, action: 'unsubscribed' }
  } catch (error) {
    console.error('[hatch-club] unsubscribe sync failed', email, error)
    return { ok: false, skipped: false, action: 'threw' }
  }
}
