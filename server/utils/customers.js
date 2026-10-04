import { mergeCustomerFields } from '#shared/customerMerge.js'
import { cleanSingleLine, isValidEmail, normalizeEmail } from '#shared/publicForms.js'

export async function upsertCustomer(supabase, input) {
  const email = normalizeEmail(input?.email)
  if (!isValidEmail(email)) return null

  const incoming = {
    name: cleanSingleLine(input?.name, 120) || null,
    phone: cleanSingleLine(input?.phone, 40) || null,
    source: cleanSingleLine(input?.source, 40) || null,
  }

  return writeCustomer(supabase, email, incoming, false)
}

async function writeCustomer(supabase, email, incoming, isRetry) {
  const { data: existing, error: readError } = await supabase
    .from('customers')
    .select('id, name, email, phone, source, notes')
    .eq('email', email)
    .maybeSingle()

  if (readError) throw readError

  if (!existing) {
    const { data, error } = await supabase
      .from('customers')
      .insert({
        email,
        name: incoming.name,
        phone: incoming.phone,
        source: incoming.source,
      })
      .select('id')
      .single()

    if (error?.code === '23505' && !isRetry) {
      return writeCustomer(supabase, email, incoming, true)
    }
    if (error) throw error
    return data.id
  }

  const merged = mergeCustomerFields(existing, incoming)
  const unchanged = merged.name === (existing.name || null)
    && merged.phone === (existing.phone || null)
    && merged.source === (existing.source || null)
  if (unchanged) return existing.id

  const { error: updateError } = await supabase
    .from('customers')
    .update({
      name: merged.name,
      phone: merged.phone,
      source: merged.source,
      updated_at: new Date().toISOString(),
    })
    .eq('id', existing.id)

  if (updateError) throw updateError
  return existing.id
}
