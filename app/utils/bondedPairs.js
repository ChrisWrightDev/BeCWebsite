export function bondedPairImageAlt(pair) {
  return `${pair?.name || 'Bonded clownfish pair'} — unique bonded pair from Blue-Eyed Clowns`
}

export function bondedPairSeoTitle(pair) {
  if (!pair?.name) return 'Bonded Clownfish Pair for Sale'
  return `${pair.name} for Sale`
}

export function bondedPairSeoDescription(pair) {
  if (!pair?.name) {
    return 'Unique WYSIWYG bonded clownfish pairs. What you see is what you get, with UPS or FedEx overnight shipping Monday through Thursday and a 3-day live guarantee.'
  }
  return `Unique WYSIWYG ${pair.name}. What you see is what you get — the exact bonded pair shown. 3-day live guarantee, UPS or FedEx overnight shipping Monday through Thursday.`
}

export function bondedPairMorphLabel(pair) {
  const male = pair?.male_morph?.trim()
  const female = pair?.female_morph?.trim()
  if (male && female) return `${male} male + ${female} female`
  if (male) return `${male} male`
  if (female) return `${female} female`
  return 'Unique bonded pair'
}

export function formatBondedOn(value) {
  if (!value) return null
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function quickFactsForBondedPair(pair) {
  const bondedOn = formatBondedOn(pair?.bonded_on)
  const facts = [
    { label: 'Pair type', value: 'Established bonded pair — sold together only' },
    { label: 'What you receive', value: 'The exact pair shown in the video or photo' },
    { label: 'Morphs', value: bondedPairMorphLabel(pair) },
  ]

  if (pair?.tank_label) {
    facts.push({ label: 'Hatchery tank', value: pair.tank_label })
  }
  if (bondedOn) {
    facts.push({ label: 'Bonded', value: bondedOn })
  }

  facts.push(
    { label: 'Captive-bred status', value: 'Tank-raised in aquaculture systems' },
    { label: 'Suggested tank size', value: '20+ gallons for a bonded pair' },
    { label: 'Diet', value: 'Feeding on prepared marine foods before shipping' },
    { label: 'Shipping schedule', value: 'Overnight live-fish shipping Monday through Thursday via UPS or FedEx' },
    { label: 'Guarantee', value: '3-day live guarantee with live-arrival support' },
  )

  return facts
}

export function wysiwygNote(pair) {
  if (pair?.video_url) {
    return 'Each pair is unique. The video shows the exact pair you receive — what you see is what you get.'
  }
  return 'Each pair is unique. The photo shows the exact pair you receive — what you see is what you get.'
}
