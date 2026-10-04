export const INQUIRY_TYPES = ['contact', 'wholesale', 'local_pickup', 'product_question']

export const INQUIRY_TYPE_LABELS = {
  contact: 'General question',
  wholesale: 'Wholesale inquiry',
  local_pickup: 'Local pickup',
  product_question: 'Product question',
}

export const DEFAULT_INQUIRY_SUBJECTS = {
  contact: '',
  wholesale: 'Wholesale inquiry',
  local_pickup: 'Local pickup request',
  product_question: '',
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase()
}

export function isValidEmail(value) {
  const email = normalizeEmail(value)
  if (!email || email.length > 254) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function cleanSingleLine(value, max) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, max)
}

export function cleanMultiline(value, max) {
  return String(value || '').replace(/\r\n/g, '\n').trim().slice(0, max)
}

export function honeypotTripped(body) {
  const value = body?.bec_hp ?? body?.company
  return String(value || '').trim().length > 0
}

export function optionalSlug(value) {
  const slug = cleanSingleLine(value, 80).toLowerCase()
  if (!slug) return null
  return SLUG_PATTERN.test(slug) ? slug : null
}

export function normalizeSubscriberSource(value) {
  const source = cleanSingleLine(value, 40).toLowerCase()
  if (source === 'homepage' || source === 'footer' || source === 'restock' || source === 'website') {
    return source
  }
  return 'website'
}

export function validateSubscriberInput(body) {
  const email = normalizeEmail(body?.email)
  if (!isValidEmail(email)) {
    return { ok: false, error: 'Enter a valid email address.' }
  }
  const name = cleanSingleLine(body?.name, 120)
  if (String(body?.name || '').trim().length > 120) {
    return { ok: false, error: 'Name must be 120 characters or fewer.' }
  }
  return {
    ok: true,
    value: {
      email,
      name: name || null,
      source: normalizeSubscriberSource(body?.source),
    },
  }
}

export function validateInquiryInput(body) {
  const type = String(body?.type || 'contact').trim()
  if (!INQUIRY_TYPES.includes(type)) {
    return { ok: false, error: 'Choose a valid inquiry type.' }
  }

  const name = cleanSingleLine(body?.name, 120)
  if (!name) return { ok: false, error: 'Name is required.' }
  if (String(body?.name || '').trim().length > 120) {
    return { ok: false, error: 'Name must be 120 characters or fewer.' }
  }

  const email = normalizeEmail(body?.email)
  if (!isValidEmail(email)) return { ok: false, error: 'Enter a valid email address.' }

  const phone = cleanSingleLine(body?.phone, 40)
  if (String(body?.phone || '').trim().length > 40) {
    return { ok: false, error: 'Phone number must be 40 characters or fewer.' }
  }

  const subject = cleanSingleLine(body?.subject, 200)
  if (String(body?.subject || '').trim().length > 200) {
    return { ok: false, error: 'Subject must be 200 characters or fewer.' }
  }

  const message = cleanMultiline(body?.message, 5000)
  if (!message) return { ok: false, error: 'Message is required.' }
  if (String(body?.message || '').trim().length > 5000) {
    return { ok: false, error: 'Message must be 5,000 characters or fewer.' }
  }

  return {
    ok: true,
    value: {
      type,
      name,
      email,
      phone: phone || null,
      subject: subject || DEFAULT_INQUIRY_SUBJECTS[type] || null,
      message,
      related_product_slug: optionalSlug(body?.productSlug || body?.product),
      related_pair_slug: optionalSlug(body?.pairSlug || body?.pair),
    },
  }
}
