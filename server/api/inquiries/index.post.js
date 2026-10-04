import { INQUIRY_TYPE_LABELS, honeypotTripped, validateInquiryInput } from '#shared/publicForms.js'
import { SHOP_NOTIFY_EMAIL, buildInquiryNotice } from '#shared/orderEmail.js'
import { allowRequest, requestRateKey } from '../../utils/rateLimit.js'
import { useSupabaseAdmin } from '../../utils/supabaseAdmin.js'
import { upsertCustomer } from '../../utils/customers.js'
import { sendEmail } from '../../utils/mailer.js'

const SUCCESS_MESSAGE = "Thanks, we received your message and will reply within one business day."

function httpError(statusCode, statusMessage) {
  return createError({ statusCode, statusMessage, message: statusMessage })
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!allowRequest(requestRateKey(event, 'inquiries'))) {
    throw httpError(429, 'Too many messages. Please wait a few minutes, or email blueeyedclowns@gmail.com.')
  }
  if (honeypotTripped(body)) {
    return { ok: true, message: SUCCESS_MESSAGE }
  }

  const parsed = validateInquiryInput(body)
  if (!parsed.ok) throw httpError(400, parsed.error)

  const supabase = useSupabaseAdmin()
  const { data, error } = await supabase
    .from('inquiries')
    .insert(parsed.value)
    .select('id')
    .single()

  if (error) {
    console.error('[inquiries] insert failed', error)
    throw httpError(500, 'Could not save your message. Please try again.')
  }

  try {
    await upsertCustomer(supabase, {
      email: parsed.value.email,
      name: parsed.value.name,
      phone: parsed.value.phone,
      source: 'inquiry',
    })
  } catch (customerError) {
    console.error('[inquiries] customer upsert failed', customerError)
  }

  try {
    const notice = buildInquiryNotice({
      ...parsed.value,
      typeLabel: INQUIRY_TYPE_LABELS[parsed.value.type] || 'Inquiry',
    })
    await sendEmail({
      to: SHOP_NOTIFY_EMAIL,
      subject: notice.subject,
      html: notice.html,
      text: notice.text,
      replyTo: parsed.value.email,
    })
  } catch (mailError) {
    console.error('[email] inquiry notification failed', mailError)
  }

  return { ok: true, id: data.id, message: SUCCESS_MESSAGE }
})
