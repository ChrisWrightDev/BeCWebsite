/**
 * Bonded pairs now live in public.bonded_pairs.
 * Rows may still exist in public.clownfish until a follow-up deletion.
 * Never treat those leftover rows as shop or checkout inventory.
 */
export function isLegacyBondedPairClownfish(row) {
  const pattern = String(row?.pattern || '').trim()
  const name = String(row?.name || '')
  return pattern === 'Bonded Pairs Available' || /bonded pair/i.test(name)
}
