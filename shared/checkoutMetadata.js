const CART_CHUNK_LIMIT = 500
const EXTRA_CART_KEYS = 6

export class CartMetadataError extends Error {
  constructor(message) {
    super(message)
    this.name = 'CartMetadataError'
  }
}

function metaText(value, max = CART_CHUNK_LIMIT) {
  return String(value ?? '').trim().slice(0, max)
}

function countryCode(value) {
  const country = String(value ?? '').trim().toUpperCase()
  return /^[A-Z]{2}$/.test(country) ? country : 'US'
}

export function encodeCartLine(item) {
  const type = item?.type === 'bonded_pair' || item?.itemType === 'bonded_pair' ? 'p' : 's'
  const id = String(item?.id || item?.item_id || '').trim()
  if (!id) return null
  if (id.includes(':') || id.includes(',')) {
    throw new CartMetadataError('A cart item id cannot be stored on the payment.')
  }
  const quantity = type === 'p' ? 1 : Math.max(1, parseInt(item?.quantity, 10) || 1)
  const line = `${type}:${id}:${quantity}`
  if (line.length > CART_CHUNK_LIMIT) {
    throw new CartMetadataError('A cart item id is too long to check out.')
  }
  return line
}

export function encodeCartMetadata(items) {
  const parts = (Array.isArray(items) ? items : []).map(encodeCartLine).filter(Boolean)
  if (parts.length === 0) {
    throw new CartMetadataError('Add at least one fish before checkout.')
  }

  const chunks = []
  let current = ''
  for (const part of parts) {
    const next = current ? `${current},${part}` : part
    if (next.length > CART_CHUNK_LIMIT) {
      if (!current) throw new CartMetadataError('A cart item id is too long to check out.')
      chunks.push(current)
      current = part
    } else {
      current = next
    }
  }
  if (current) chunks.push(current)
  if (chunks.length > EXTRA_CART_KEYS + 1) {
    throw new CartMetadataError('This cart is too large to check out online. Contact us and we will invoice it.')
  }

  const metadata = {}
  chunks.forEach((chunk, index) => {
    metadata[index === 0 ? 'cart' : `cart_${index + 1}`] = chunk
  })
  for (let index = chunks.length + 1; index <= EXTRA_CART_KEYS + 1; index += 1) {
    metadata[`cart_${index}`] = ''
  }
  return metadata
}

function cartMetadataKeys(metadata) {
  return Object.keys(metadata || [])
    .filter((key) => key === 'cart' || /^cart_\d+$/.test(key))
    .sort((left, right) => {
      const leftIndex = left === 'cart' ? 1 : Number(left.slice(5))
      const rightIndex = right === 'cart' ? 1 : Number(right.slice(5))
      return leftIndex - rightIndex
    })
}

export function decodeCartMetadata(metadata) {
  const raw = cartMetadataKeys(metadata)
    .map((key) => String(metadata[key] || '').trim())
    .filter(Boolean)
    .join(',')
  if (!raw) return []

  return raw.split(',').filter(Boolean).map((token) => {
    const pieces = token.split(':')
    const typeCode = pieces[0]
    const quantityCode = pieces[pieces.length - 1]
    const id = pieces.slice(1, -1).join(':')
    const type = typeCode === 'p' ? 'bonded_pair' : 'single'
    return {
      id,
      type,
      quantity: type === 'bonded_pair' ? 1 : Math.max(1, parseInt(quantityCode, 10) || 1),
    }
  }).filter((item) => item.id)
}

export function buildPaymentIntentMetadata({
  items,
  customerEmail,
  customerName,
  shippingAddress,
  merchandiseSubtotalCents,
  shippingCents,
}) {
  const address = shippingAddress || {}
  return {
    ...encodeCartMetadata(items),
    customer_email: metaText(customerEmail),
    customer_name: metaText(customerName, 200),
    ship_line1: metaText(address.line1, 200),
    ship_line2: metaText(address.line2, 200),
    ship_city: metaText(address.city, 120),
    ship_state: metaText(address.state, 80),
    ship_postal: metaText(address.postal_code || address.postalCode, 32),
    ship_country: countryCode(address.country),
    merchandise_subtotal_cents: String(merchandiseSubtotalCents ?? ''),
    shipping_cents: String(shippingCents ?? ''),
  }
}

function addressFromParts(source) {
  const address = source || {}
  return {
    line1: metaText(address.line1, 200),
    line2: metaText(address.line2, 200),
    city: metaText(address.city, 120),
    state: metaText(address.state, 80),
    postal_code: metaText(address.postal_code || address.postalCode, 32),
    country: countryCode(address.country),
  }
}

function hasStreetAddress(address) {
  return Boolean(address?.line1 && address?.city && address?.postal_code)
}

export function orderInputFromMetadata(metadata) {
  const source = metadata || {}
  return {
    customerEmail: metaText(source.customer_email),
    customerName: metaText(source.customer_name, 200),
    shippingAddress: addressFromParts({
      line1: source.ship_line1,
      line2: source.ship_line2,
      city: source.ship_city,
      state: source.ship_state,
      postal_code: source.ship_postal,
      country: source.ship_country,
    }),
    items: decodeCartMetadata(source),
  }
}

export function resolvePaidOrderInput({ metadata, receiptEmail, shipping, fallback }) {
  const fromMetadata = orderInputFromMetadata(metadata)
  const stripeAddress = addressFromParts(shipping?.address)
  const body = fallback || {}
  const bodyAddress = addressFromParts(body.shippingAddress)

  const items = fromMetadata.items.length
    ? fromMetadata.items
    : (Array.isArray(body.items) ? body.items : [])

  const customerEmail = fromMetadata.customerEmail
    || metaText(receiptEmail)
    || metaText(body.customerEmail)

  const customerName = fromMetadata.customerName
    || metaText(body.customerName, 200)
    || metaText(shipping?.name, 200)

  let shippingAddress = fromMetadata.shippingAddress
  if (!hasStreetAddress(shippingAddress)) {
    shippingAddress = hasStreetAddress(bodyAddress) ? bodyAddress : stripeAddress
  }

  return {
    customerEmail,
    customerName,
    shippingAddress,
    items,
  }
}

export function assertCheckoutContact(contact) {
  const errors = []
  if (!contact?.customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.customerEmail)) {
    errors.push('A valid email is required.')
  }
  if (!contact?.shippingAddress?.line1) errors.push('Shipping address is required.')
  if (!contact?.shippingAddress?.city) errors.push('Shipping city is required.')
  if (!contact?.shippingAddress?.postal_code) errors.push('Shipping ZIP code is required.')
  if ((contact?.customerName || '').length > 120) errors.push('Name must be 120 characters or fewer.')
  return errors
}

export function normalizeCheckoutContact(body) {
  const address = body?.shippingAddress || {}
  return {
    customerEmail: metaText(body?.customerEmail).toLowerCase(),
    customerName: metaText(body?.customerName, 120),
    shippingAddress: {
      line1: metaText(address.line1, 200),
      line2: metaText(address.line2, 200),
      city: metaText(address.city, 120),
      state: metaText(address.state, 80),
      postal_code: metaText(address.postal_code, 32),
      country: countryCode(address.country),
    },
  }
}
