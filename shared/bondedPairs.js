export const BONDED_PAIR_VIDEO_BUCKET = 'bonded-pair-videos'

export const BONDED_PAIR_STATUS = {
  AVAILABLE: 'available',
  RESERVED: 'reserved',
  SOLD: 'sold',
}

export function bondedPairStoragePublicUrl(path, supabaseUrl) {
  if (!path || typeof path !== 'string') return null
  const cleanUrl = String(supabaseUrl || '').replace(/\/$/, '')
  if (!cleanUrl) return null
  const cleanPath = path.trim().replace(/^\//, '')
  if (!cleanPath) return null
  return `${cleanUrl}/storage/v1/object/public/${BONDED_PAIR_VIDEO_BUCKET}/${cleanPath}`
}

export function isShopVisibleBondedPair(pair) {
  return pair?.status === BONDED_PAIR_STATUS.AVAILABLE || pair?.status === BONDED_PAIR_STATUS.RESERVED
}

export function enrichBondedPair(row, supabaseUrl) {
  const videoUrl = bondedPairStoragePublicUrl(row?.video_path, supabaseUrl)
  const posterFromVideo = bondedPairStoragePublicUrl(row?.video_poster_path, supabaseUrl)

  return {
    ...row,
    type: 'bonded_pair',
    video_url: videoUrl,
    video_poster_url: posterFromVideo || row?.image_url || null,
    in_stock: row?.status === BONDED_PAIR_STATUS.AVAILABLE,
  }
}
