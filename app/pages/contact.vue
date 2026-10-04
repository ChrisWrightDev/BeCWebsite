<script setup>
import {
  RETAIL_SHIPPING,
  formatUsdFromCents,
  retailShippingPolicySentence,
} from '#shared/retailShipping.js'

const config = useRuntimeConfig()
const siteUrl = (config.public.siteUrl || 'https://www.blueeyedclowns.com').replace(/\/$/, '')
const thresholdLabel = formatUsdFromCents(RETAIL_SHIPPING.freeThresholdCents, {
  trimZeroCents: true,
})

useSiteSeo({
  title: 'Contact Us',
  description:
    'Questions about clownfish, shipping, or wholesale? We reply within one business day.',
})

useJsonLd(buildContactPageSchema(siteUrl))

const route = useRoute()
const submitted = ref(false)
const submitting = ref(false)
const formError = ref('')
const mailtoFallback = ref('')

const inquiryTypes = [
  { value: 'contact', label: 'General question' },
  { value: 'wholesale', label: 'Wholesale inquiry' },
  { value: 'local_pickup', label: 'Local pickup' },
  { value: 'product_question', label: 'Question about a fish or pair' },
]

const defaultSubjects = {
  contact: '',
  wholesale: 'Wholesale inquiry',
  local_pickup: 'Local pickup request',
  product_question: '',
}

const faqItems = [
  {
    question: 'When do you ship live fish?',
    answer:
      'We ship Monday through Thursday via UPS or FedEx overnight. This keeps transit time minimal and gives your clownfish the best chance of arriving healthy. Orders placed after our cutoff may ship the following eligible day.',
  },
  {
    question: 'How much does shipping cost?',
    answer:
      `${retailShippingPolicySentence()} Exactly ${thresholdLabel} qualifies for free shipping. Wholesale orders are arranged separately and are not charged this retail rate.`,
  },
  {
    question: 'How should I acclimate new clownfish?',
    answer:
      'Float the sealed bag in your tank for 15–20 minutes to equalize temperature. Then drip-acclimate over 30–45 minutes, slowly mixing tank water into the bag. Net the fish into your display — avoid adding bag water. Keep lights dim for the first few hours.',
  },
  {
    question: 'What is your live guarantee?',
    answer:
      'Every clownfish is covered by our 3-day live guarantee. If your fish arrives unhealthy or declines within 3 days due to a pre-existing condition, contact us with photos and we will work with you on a replacement or refund.',
  },
  {
    question: 'What if my fish arrives DOA?',
    answer:
      'Take clear photos of the unopened bag within two hours of delivery and email blueeyedclowns@gmail.com. We will replace or refund per our Live Arrival Guarantee policy. Do not discard the fish until we confirm next steps.',
  },
  {
    question: 'Do you offer wholesale or local pickup?',
    answer:
      'Yes — we work with select local fish stores and serious hobbyists on wholesale orders. Wholesale is typically a $300 minimum with shipping included, arranged by inquiry rather than website checkout. Local pickup is available at our Florida Panhandle storefront, Monday–Friday, 10 AM–5 PM Central. Use the contact form below and choose Wholesale inquiry or Local pickup.',
  },
]

const form = reactive({
  type: 'contact',
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  productSlug: '',
  pairSlug: '',
  bec_hp: '',
})

function queryValue(value) {
  return Array.isArray(value) ? String(value[0] || '') : String(value || '')
}

function applyQuery() {
  const type = queryValue(route.query.type)
  if (inquiryTypes.some((option) => option.value === type)) form.type = type
  const subject = queryValue(route.query.subject)
  if (subject) form.subject = subject
  else if (!form.subject && defaultSubjects[form.type]) form.subject = defaultSubjects[form.type]
  form.productSlug = queryValue(route.query.product || route.query.productSlug)
  form.pairSlug = queryValue(route.query.pair || route.query.pairSlug)
  if ((form.productSlug || form.pairSlug) && !queryValue(route.query.type)) {
    form.type = 'product_question'
  }
}

function applyDefaultSubject(type) {
  const usesDefault = !form.subject.trim() || Object.values(defaultSubjects).includes(form.subject)
  if (usesDefault) form.subject = defaultSubjects[type] || ''
}

function selectType(type) {
  form.type = type
  applyDefaultSubject(type)
  document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function onTypeInput(event) {
  applyDefaultSubject(event.target.value)
}

function mailtoHref() {
  const subject = form.subject.trim() || defaultSubjects[form.type] || 'Blue-Eyed Clowns inquiry'
  const body = [
    `Name: ${form.name}`,
    `Email: ${form.email}`,
    form.phone ? `Phone: ${form.phone}` : '',
    form.productSlug ? `Fish: ${form.productSlug}` : '',
    form.pairSlug ? `Bonded pair: ${form.pairSlug}` : '',
    '',
    form.message,
  ].filter(Boolean).join('\n')
  return `mailto:blueeyedclowns@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

async function handleSubmit() {
  formError.value = ''
  mailtoFallback.value = ''
  submitted.value = false
  submitting.value = true
  try {
    const result = await $fetch('/api/inquiries', {
      method: 'POST',
      body: { ...form },
    })
    submitted.value = true
    form.message = ''
    if (result?.message) formError.value = ''
  } catch (err) {
    mailtoFallback.value = mailtoHref()
    formError.value = err?.data?.statusMessage
      || err?.data?.message
      || 'Could not save your message. Email us directly at blueeyedclowns@gmail.com.'
  } finally {
    submitting.value = false
  }
}

applyQuery()
watch(() => route.query, applyQuery)
</script>

<template>
  <section class="page">
    <div class="inner">
      <header class="header">
        <h1>Contact us</h1>
        <p>
          Have a question about a specific clownfish, shipping, wholesale, or local pickup? Our
          Florida Panhandle storefront is open Monday–Friday, 10 AM–5 PM Central. Send us a note
          and we'll get back within one business day.
        </p>
      </header>

      <div class="contact-ctas" aria-label="Contact shortcuts">
        <NuxtLink to="/shop" class="contact-cta">Question about a fish</NuxtLink>
        <div class="contact-cta-card">
          <button type="button" class="contact-cta" @click="selectType('wholesale')">Wholesale inquiry</button>
          <a class="cta-mail" href="mailto:blueeyedclowns@gmail.com?subject=Wholesale%20inquiry">or email us</a>
        </div>
        <div class="contact-cta-card">
          <button type="button" class="contact-cta" @click="selectType('local_pickup')">Local pickup request</button>
          <a class="cta-mail" href="mailto:blueeyedclowns@gmail.com?subject=Local%20pickup%20request">or email us</a>
        </div>
      </div>

      <section id="faq" class="faq" aria-labelledby="faq-heading">
        <h2 id="faq-heading">Shipping &amp; acclimation FAQ</h2>
        <p class="faq-intro">
          Common questions before you reach out — most orders ship within one business day of
          confirmation.
        </p>
        <div class="faq-list">
          <details v-for="(item, index) in faqItems" :key="index" class="faq-item">
            <summary>{{ item.question }}</summary>
            <p>{{ item.answer }}</p>
          </details>
        </div>
      </section>

      <div class="grid">
        <form id="contact-form" class="form" @submit.prevent="handleSubmit">
          <p v-if="submitted" class="form-success" role="status">
            Thanks, we received your message and will reply within one business day.
          </p>
          <p v-if="formError" class="form-error" role="alert">
            {{ formError }}
            <a v-if="mailtoFallback" :href="mailtoFallback">Open an email draft instead.</a>
          </p>
          <p v-if="form.productSlug || form.pairSlug" class="form-context">
            About {{ form.pairSlug || form.productSlug }}
          </p>

          <label>
            What is this about?
            <select v-model="form.type" name="type" @change="onTypeInput">
              <option v-for="option in inquiryTypes" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </label>

          <label>
            Name
            <input
              v-model="form.name"
              type="text"
              name="name"
              autocomplete="name"
              maxlength="120"
              required
            />
          </label>

          <label>
            Email
            <input
              v-model="form.email"
              type="email"
              name="email"
              autocomplete="email"
              maxlength="254"
              required
            />
          </label>

          <label>
            Phone <span class="optional">(optional)</span>
            <input
              v-model="form.phone"
              type="tel"
              name="phone"
              autocomplete="tel"
              maxlength="40"
            />
          </label>

          <label>
            Subject
            <input
              v-model="form.subject"
              type="text"
              name="subject"
              autocomplete="off"
              maxlength="200"
            />
          </label>

          <label>
            Message
            <textarea
              v-model="form.message"
              name="message"
              rows="5"
              maxlength="5000"
              required
            ></textarea>
          </label>

          <div class="hp" aria-hidden="true">
            <label>
              Leave this blank
              <input v-model="form.bec_hp" type="text" name="bec_hp" tabindex="-1" autocomplete="off" />
            </label>
          </div>

          <button type="submit" class="btn" :disabled="submitting">
            {{ submitting ? 'Sending…' : 'Send message' }}
          </button>
          <p class="form-note">
            Prefer email directly?
            <a href="mailto:blueeyedclowns@gmail.com">blueeyedclowns@gmail.com</a>
          </p>
        </form>

        <aside class="details">
          <h2>Quick details</h2>
          <ul>
            <li><strong>Support email</strong> blueeyedclowns@gmail.com</li>
            <li><strong>Local storefront</strong> Florida Panhandle, with captive-breeding systems on site. Monday–Friday, 10 AM–5 PM Central.</li>
            <li><strong>Live shipping schedule</strong> Monday through Thursday, UPS or FedEx overnight only</li>
            <li><strong>Response time</strong> Most messages answered within 1 business day</li>
          </ul>
        </aside>
      </div>
    </div>
  </section>
</template>

<style scoped>
.page {
  padding: 3.5rem 1.5rem 4rem;
  background: radial-gradient(circle at top, rgba(15, 23, 42, 0.9), #020617 55%, #000 100%);
  color: #e5e7eb;
}

.inner {
  max-width: 960px;
  margin: 0 auto;
}

.header h1 {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.header p {
  color: #cbd5f5;
  max-width: 40rem;
}

.contact-ctas {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.85rem;
  margin-top: 1.5rem;
}

.contact-cta {
  border: 1px solid rgba(125, 211, 252, 0.24);
  border-radius: 1rem;
  background: rgba(15, 23, 42, 0.68);
  color: #e0f2fe;
  padding: 1rem;
  text-align: center;
  text-decoration: none;
  font-weight: 700;
}

.contact-cta:hover {
  border-color: #7dd3fc;
}

.contact-cta-card {
  display: grid;
  gap: 0.45rem;
}

.contact-cta-card .contact-cta {
  width: 100%;
  font: inherit;
  cursor: pointer;
}

.cta-mail {
  color: #7dd3fc;
  font-size: 0.82rem;
  text-align: center;
}

.optional {
  color: #94a3b8;
  font-weight: 400;
}

select {
  border-radius: 0.75rem;
  border: 1px solid rgba(148, 163, 184, 0.6);
  background-color: rgba(15, 23, 42, 0.9);
  color: #e5e7eb;
  padding: 0.6rem 0.75rem;
  font-size: 0.95rem;
}

.form-context {
  margin: 0;
  color: #bae6fd;
  font-size: 0.9rem;
}

.form-error a {
  color: #7dd3fc;
}

.hp {
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.faq {
  margin-top: 2.5rem;
}

.faq h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.faq-intro {
  color: #94a3b8;
  margin: 0 0 1.25rem;
  max-width: 40rem;
}

.faq-list {
  display: grid;
  gap: 0.6rem;
  max-width: 52rem;
}

.faq-item {
  border-radius: 0.75rem;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: rgba(15, 23, 42, 0.5);
  overflow: hidden;
}

.faq-item summary {
  padding: 0.85rem 1rem;
  font-weight: 600;
  color: #e2e8f0;
  cursor: pointer;
  list-style: none;
}

.faq-item summary::-webkit-details-marker {
  display: none;
}

.faq-item summary::after {
  content: '+';
  float: right;
  color: #22d3ee;
  font-weight: 700;
}

.faq-item[open] summary::after {
  content: '−';
}

.faq-item summary:focus-visible {
  outline: 2px solid #22d3ee;
  outline-offset: -2px;
}

.faq-item p {
  margin: 0;
  padding: 0 1rem 1rem;
  color: #cbd5e1;
  line-height: 1.55;
  font-size: 0.95rem;
}

.grid {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(0, 1.1fr);
  gap: 2.25rem;
  margin-top: 2.5rem;
  align-items: flex-start;
}

.form {
  display: grid;
  gap: 1rem;
  padding: 1.75rem 1.5rem;
  border-radius: 1.25rem;
  background: radial-gradient(circle at top left, #020617, #020617 55%, #000 100%);
  border: 1px solid rgba(148, 163, 184, 0.4);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.9);
}

label {
  display: grid;
  gap: 0.35rem;
  font-size: 0.9rem;
}

input,
textarea,
select {
  border-radius: 0.75rem;
  border: 1px solid rgba(148, 163, 184, 0.6);
  background-color: rgba(15, 23, 42, 0.9);
  color: #e5e7eb;
  padding: 0.6rem 0.75rem;
  font-size: 0.95rem;
  outline: none;
}

input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  border-color: #7dd3fc;
  box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.4);
}

.form-success {
  margin: 0;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  background: rgba(8, 47, 73, 0.5);
  color: #bae6fd;
  font-size: 0.9rem;
}

.form-error {
  margin: 0;
  color: #fecaca;
  font-size: 0.9rem;
}

.form-note {
  margin: 0;
  font-size: 0.85rem;
  color: #94a3b8;
}

.form-note a {
  color: #7dd3fc;
}

.btn {
  margin-top: 0.5rem;
  border: none;
  border-radius: 999px;
  padding: 0.7rem 1.4rem;
  background: linear-gradient(to right, #22d3ee, #0ea5e9);
  color: #0f172a;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-size: 0.9rem;
  cursor: pointer;
}

.btn:hover {
  filter: brightness(1.04);
}

.btn:focus-visible {
  outline: 2px solid #22d3ee;
  outline-offset: 2px;
}

.details h2 {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
}

.details ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.details li {
  margin-bottom: 0.6rem;
}

@media (max-width: 800px) {
  .grid,
  .contact-ctas {
    grid-template-columns: 1fr;
  }
}
</style>
