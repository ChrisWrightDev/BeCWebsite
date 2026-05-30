<script setup>
const config = useRuntimeConfig()
const siteUrl = (config.public.siteUrl || 'https://www.blueeyedclowns.com').replace(/\/$/, '')

useSiteSeo({
  title: 'Contact — Shipping & Support',
  description:
    'Questions about clownfish, shipping, or wholesale? We reply within one business day.',
})

useJsonLd(buildContactPageSchema(siteUrl))

const submitted = ref(false)
const formError = ref('')

const faqItems = [
  {
    question: 'When do you ship live fish?',
    answer:
      'We ship Monday through Wednesday only, via overnight delivery. This keeps transit time minimal and gives your clownfish the best chance of arriving healthy. Orders placed after our cutoff may ship the following eligible day.',
  },
  {
    question: 'How should I acclimate new clownfish?',
    answer:
      'Float the sealed bag in your tank for 15–20 minutes to equalize temperature. Then drip-acclimate over 30–45 minutes, slowly mixing tank water into the bag. Net the fish into your display — avoid adding bag water. Keep lights dim for the first few hours.',
  },
  {
    question: 'What is your health guarantee?',
    answer:
      'Every clownfish is covered by our 30-day health guarantee. If your fish arrives unhealthy or declines within 30 days due to a pre-existing condition, contact us with photos and we will work with you on a replacement or refund.',
  },
  {
    question: 'What if my fish arrives DOA?',
    answer:
      'Take clear photos of the unopened bag within two hours of delivery and email support@blueeyedclowns.com. We will replace or refund per our Live Arrival Guarantee policy. Do not discard the fish until we confirm next steps.',
  },
  {
    question: 'Do you offer wholesale or local pickup?',
    answer:
      'Yes — we work with select local fish stores and serious hobbyists on wholesale orders. Use the contact form below and select a wholesale inquiry in your subject line, or email support@blueeyedclowns.com directly.',
  },
]

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})

function handleSubmit() {
  formError.value = ''
  const subject = form.subject.trim() || 'Blue-Eyed Clowns inquiry'
  const body = [
    `Name: ${form.name}`,
    `Email: ${form.email}`,
    '',
    form.message,
  ].join('\n')

  const mailto = `mailto:support@blueeyedclowns.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  try {
    window.location.href = mailto
    submitted.value = true
  } catch {
    formError.value = 'Could not open your email client. Email us directly at support@blueeyedclowns.com.'
  }
}
</script>

<template>
  <section class="page">
    <div class="inner">
      <header class="header">
        <h1>Contact us</h1>
        <p>
          Have a question about a specific clownfish, shipping, or wholesale? Send us a note and
          we'll get back within one business day.
        </p>
      </header>

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
        <form class="form" @submit.prevent="handleSubmit">
          <p v-if="submitted" class="form-success" role="status">
            Your email client should open with a draft to support@blueeyedclowns.com. Send it when
            ready — we'll reply within one business day.
          </p>
          <p v-if="formError" class="form-error" role="alert">{{ formError }}</p>

          <label>
            Name
            <input
              v-model="form.name"
              type="text"
              name="name"
              autocomplete="name"
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
              required
            />
          </label>

          <label>
            Subject
            <input
              v-model="form.subject"
              type="text"
              name="subject"
              autocomplete="off"
            />
          </label>

          <label>
            Message
            <textarea
              v-model="form.message"
              name="message"
              rows="5"
              required
            ></textarea>
          </label>

          <button type="submit" class="btn">Send message</button>
          <p class="form-note">
            Prefer email directly?
            <a href="mailto:support@blueeyedclowns.com">support@blueeyedclowns.com</a>
          </p>
        </form>

        <aside class="details">
          <h2>Quick details</h2>
          <ul>
            <li><strong>Support email</strong> support@blueeyedclowns.com</li>
            <li><strong>Facility</strong> Captive-breeding and quarantine systems in the U.S.</li>
            <li><strong>Live shipping schedule</strong> Monday–Wednesday, overnight delivery only</li>
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
textarea {
  border-radius: 0.75rem;
  border: 1px solid rgba(148, 163, 184, 0.6);
  background-color: rgba(15, 23, 42, 0.9);
  color: #e5e7eb;
  padding: 0.6rem 0.75rem;
  font-size: 0.95rem;
  outline: none;
}

input:focus-visible,
textarea:focus-visible {
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
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
