<script setup>
import { UNSUBSCRIBE_REASONS } from '#shared/publicForms.js'

useSiteSeo({
  title: 'Unsubscribe',
  noindex: true,
  nofollow: true,
})

const route = useRoute()
const token = computed(() => String(route.params.token || ''))
const tokenOk = computed(() => /^[a-f0-9]{64}$/i.test(token.value))
const reasons = UNSUBSCRIBE_REASONS

const status = ref('ready')
const message = ref('')
const reason = ref('')
const feedback = ref('')

watch(tokenOk, (ok) => {
  if (!ok) {
    status.value = 'invalid'
    message.value = ''
  }
}, { immediate: true })

function errorText(err) {
  return err?.data?.statusMessage || err?.data?.message || err?.statusMessage || 'Could not update your subscription.'
}

async function unsubscribe() {
  if (status.value === 'working' || !tokenOk.value) return
  status.value = 'working'
  message.value = ''
  try {
    const result = await $fetch('/api/subscribers/unsubscribe', {
      method: 'POST',
      body: {
        token: token.value,
        reason: reason.value,
        feedback: feedback.value,
      },
    })
    message.value = result?.message || "You're off the release list."
    status.value = 'done'
  } catch (err) {
    message.value = errorText(err)
    status.value = /unsubscribe link/i.test(message.value) ? 'invalid' : 'error'
  }
}
</script>

<template>
  <section class="page">
    <div class="inner">
      <p class="eyebrow">Release list</p>
      <h1 v-if="status === 'done'">You're unsubscribed</h1>
      <h1 v-else-if="status === 'invalid'">This link doesn't work</h1>
      <h1 v-else>Leave the release list?</h1>

      <template v-if="status === 'invalid'">
        <p class="lead error" role="alert">
          {{ message || 'This unsubscribe link is invalid or no longer works.' }}
          If you still get release-list emails, use the unsubscribe link in the latest message, or write
          <a href="mailto:blueeyedclowns@gmail.com">blueeyedclowns@gmail.com</a>.
        </p>
        <NuxtLink to="/" class="btn">Back to the homepage</NuxtLink>
      </template>

      <template v-else-if="status === 'done'">
        <p class="lead" role="status">
          {{ message }} Thanks for telling us why. Order and shipping emails are not affected.
        </p>
        <p class="lead">You can join the release list again anytime from the homepage.</p>
        <NuxtLink to="/" class="btn">Back to the homepage</NuxtLink>
      </template>

      <form v-else class="form" @submit.prevent="unsubscribe">
        <p class="lead">
          Confirm you want to leave the Blue Eyed Clowns release list. You'll stop hearing about new morph drops and batches. Order and shipping emails are not affected.
        </p>

        <fieldset class="reasons">
          <legend>Why are you leaving? <span class="required">Required</span></legend>
          <label v-for="option in reasons" :key="option" class="reason">
            <input v-model="reason" type="radio" name="unsubscribe-reason" :value="option" required />
            <span>{{ option }}</span>
          </label>
        </fieldset>

        <label class="feedback">
          <span class="label">Anything else? <span class="optional">(optional)</span></span>
          <textarea
            v-model="feedback"
            name="unsubscribe-feedback"
            rows="4"
            maxlength="1000"
            placeholder="A short note helps, especially if you chose Other."
          />
        </label>

        <p v-if="status === 'error'" class="lead error" role="alert">{{ message }}</p>

        <button class="btn" type="submit" :disabled="status === 'working'">
          {{ status === 'working' ? 'Updating…' : 'Unsubscribe' }}
        </button>
      </form>
    </div>
  </section>
</template>

<style scoped>
.page {
  padding: 4rem 1.5rem 5rem;
  background: radial-gradient(circle at top, rgba(15, 23, 42, 0.9), #020617 55%, #000 100%);
  color: #e5e7eb;
  min-height: 60vh;
}

.inner {
  max-width: 36rem;
  margin: 0 auto;
}

.eyebrow {
  margin: 0 0 0.45rem;
  color: #7dd3fc;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

h1 {
  font-size: clamp(1.8rem, 1.4rem + 1.5vw, 2.25rem);
  line-height: 1.15;
  margin: 0 0 0.85rem;
}

.lead {
  margin: 0 0 0.85rem;
  color: #cbd5e1;
  line-height: 1.55;
}

.lead a {
  color: #7dd3fc;
}

.lead.error {
  color: #fecaca;
}

.form {
  margin-top: 0.5rem;
}

.reasons {
  margin: 1.25rem 0;
  padding: 1rem 1rem 0.35rem;
  border: 1px solid rgba(125, 211, 252, 0.28);
  border-radius: 1rem;
  background: rgba(15, 23, 42, 0.55);
}

legend {
  padding: 0 0.35rem;
  color: #f8fafc;
  font-weight: 700;
}

.required,
.optional {
  font-weight: 500;
  color: #94a3b8;
}

.reason {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  margin: 0 0 0.75rem;
  color: #e2e8f0;
  cursor: pointer;
}

.reason input {
  margin-top: 0.2rem;
  accent-color: #22d3ee;
}

.feedback {
  display: grid;
  gap: 0.4rem;
}

.label {
  color: #e2e8f0;
  font-weight: 600;
}

textarea {
  width: 100%;
  border-radius: 0.85rem;
  border: 1px solid rgba(148, 163, 184, 0.55);
  background: rgba(2, 6, 23, 0.9);
  color: #e5e7eb;
  padding: 0.75rem 0.85rem;
  font: inherit;
  line-height: 1.45;
  resize: vertical;
}

textarea:focus-visible,
.reason input:focus-visible {
  outline: 2px solid #22d3ee;
  outline-offset: 2px;
}

.btn {
  display: inline-flex;
  margin-top: 1.15rem;
  border: none;
  border-radius: 999px;
  padding: 0.75rem 1.4rem;
  background: linear-gradient(to right, #22d3ee, #0ea5e9);
  color: #0f172a;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
}

.btn:hover:not(:disabled) {
  filter: brightness(1.05);
}

.btn:focus-visible {
  outline: 2px solid #22d3ee;
  outline-offset: 3px;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
