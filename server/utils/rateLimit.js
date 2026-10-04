const hits = new Map()

export function allowRequest(key, { limit = 5, windowMs = 10 * 60 * 1000 } = {}, now = Date.now()) {
  const recent = (hits.get(key) || []).filter((timestamp) => now - timestamp < windowMs)
  if (recent.length >= limit) {
    hits.set(key, recent)
    return false
  }
  recent.push(now)
  hits.set(key, recent)
  return true
}

export function resetRateLimitForTests() {
  hits.clear()
}

export function requestRateKey(event, bucket) {
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  return `${bucket}:${ip}`
}
