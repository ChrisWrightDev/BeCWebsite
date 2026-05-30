/** Homepage featured-card tags and shop filter categories. */
export const PATTERN_CATEGORIES = ['Classic', 'Pattern', 'Designer']

/** Maps catalog `pattern` field values to marketing categories. */
const PATTERN_TO_CATEGORY = {
  Ocellaris: 'Classic',
  Snowflake: 'Pattern',
  'Black Ice': 'Designer',
}

export function fishPatternCategory(fish) {
  if (!fish) return null
  if (fish.pattern && PATTERN_TO_CATEGORY[fish.pattern]) {
    return PATTERN_TO_CATEGORY[fish.pattern]
  }
  if (fish.category_name && PATTERN_CATEGORIES.includes(fish.category_name)) {
    return fish.category_name
  }
  return null
}

export function isKnownPatternQuery(value) {
  if (!value || value === 'All') return true
  return PATTERN_CATEGORIES.includes(value)
}

export function fishMatchesPatternCategory(fish, category) {
  if (!category || category === 'All') return true
  return fishPatternCategory(fish) === category
}
