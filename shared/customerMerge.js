const SOURCE_RANK = {
  subscriber: 1,
  inquiry: 2,
  website: 3,
}

function textOrNull(value) {
  const text = String(value || '').trim()
  return text || null
}

export function preferCustomerSource(current, incoming) {
  const currentText = textOrNull(current)
  const incomingText = textOrNull(incoming)
  if (!currentText) return incomingText
  if (!incomingText) return currentText
  if (!Object.prototype.hasOwnProperty.call(SOURCE_RANK, currentText)) return currentText
  const currentRank = SOURCE_RANK[currentText] || 0
  const incomingRank = SOURCE_RANK[incomingText] || 0
  if (incomingRank > currentRank) return incomingText
  return currentText
}

/**
 * Keep an existing name, phone, and notes when they are already filled in.
 * Source only moves toward a stronger relationship (subscriber -> inquiry -> website).
 */
export function mergeCustomerFields(existing, incoming) {
  return {
    name: textOrNull(existing?.name) || textOrNull(incoming?.name),
    phone: textOrNull(existing?.phone) || textOrNull(incoming?.phone),
    notes: existing?.notes ?? null,
    source: preferCustomerSource(existing?.source, incoming?.source),
  }
}
