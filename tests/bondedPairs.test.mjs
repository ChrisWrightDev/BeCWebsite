import assert from 'node:assert/strict'
import { isLegacyBondedPairClownfish } from '../shared/bondedPairGuards.js'
import {
  bondedPairStoragePublicUrl,
  enrichBondedPair,
  isShopVisibleBondedPair,
} from '../shared/bondedPairs.js'

assert.equal(
  isLegacyBondedPairClownfish({ pattern: 'Bonded Pairs Available', name: 'Standard Ocellaris' }),
  true
)
assert.equal(
  isLegacyBondedPairClownfish({ pattern: 'Ocellaris', name: 'Mocha Ocellaris Bonded Pair A' }),
  true
)
assert.equal(
  isLegacyBondedPairClownfish({ pattern: 'Ocellaris', name: 'Standard Ocellaris' }),
  false
)

assert.equal(
  bondedPairStoragePublicUrl('tanks/pair-a.mp4', 'https://janwtypmneybfzeiauzt.supabase.co'),
  'https://janwtypmneybfzeiauzt.supabase.co/storage/v1/object/public/bonded-pair-videos/tanks/pair-a.mp4'
)
assert.equal(bondedPairStoragePublicUrl('', 'https://example.supabase.co'), null)

const available = enrichBondedPair(
  {
    id: '1',
    slug: 'mocha-pair',
    name: 'Mocha Pair',
    status: 'available',
    image_url: 'https://cdn.example/pair.jpg',
    video_path: 'clips/mocha.mp4',
    video_poster_path: 'posters/mocha.jpg',
    price_cents: 4800,
  },
  'https://janwtypmneybfzeiauzt.supabase.co'
)

assert.equal(available.type, 'bonded_pair')
assert.equal(available.in_stock, true)
assert.equal(
  available.video_url,
  'https://janwtypmneybfzeiauzt.supabase.co/storage/v1/object/public/bonded-pair-videos/clips/mocha.mp4'
)
assert.equal(
  available.video_poster_url,
  'https://janwtypmneybfzeiauzt.supabase.co/storage/v1/object/public/bonded-pair-videos/posters/mocha.jpg'
)
assert.equal(isShopVisibleBondedPair({ status: 'available' }), true)
assert.equal(isShopVisibleBondedPair({ status: 'reserved' }), true)
assert.equal(isShopVisibleBondedPair({ status: 'sold' }), false)

console.log('bonded pair helpers passed')
