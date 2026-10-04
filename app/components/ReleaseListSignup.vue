<script setup>
const props = defineProps({
  source: {
    type: String,
    default: 'homepage',
  },
  showName: {
    type: Boolean,
    default: true,
  },
  compact: {
    type: Boolean,
    default: false,
  },
  heading: {
    type: String,
    default: '',
  },
  idPrefix: {
    type: String,
    default: 'release',
  },
  buttonLabel: {
    type: String,
    default: 'Notify me',
  },
})

const name = ref('')
const email = ref('')
const honeypot = ref('')
const sending = ref(false)
const message = ref('')
const error = ref('')

function errorText(err) {
  return err?.data?.statusMessage || err?.data?.message || err?.statusMessage || 'Could not save your signup. Please try again.'
}

async function submit() {
  if (sending.value) return
  error.value = ''
  message.value = ''
  sending.value = true
  try {
    const result = await $fetch('/api/subscribers', {
      method: 'POST',
      body: {
        email: email.value,
        name: props.showName ? name.value : '',
        source: props.source,
        bec_hp: honeypot.value,
      },
    })
    message.value = result?.message || "You're on the list."
    email.value = ''
    name.value = ''
  } catch (err) {
    error.value = errorText(err)
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <form class="release-form" :class="{ compact, named: showName }" @submit.prevent="submit">
    <p v-if="heading" class="heading">{{ heading }}</p>
    <label v-if="showName" class="field">
      <span class="label">Name <span class="optional">(optional)</span></span>
      <input
        v-model="name"
        type="text"
        :name="`${idPrefix}-name`"
        :id="`${idPrefix}-name`"
        autocomplete="name"
        maxlength="120"
        placeholder="Your name"
      />
    </label>
    <label class="field">
      <span class="label">Email</span>
      <input
        v-model="email"
        type="email"
        required
        :name="`${idPrefix}-email`"
        :id="`${idPrefix}-email`"
        autocomplete="email"
        maxlength="254"
        placeholder="you@example.com"
      />
    </label>
    <div class="hp" aria-hidden="true">
      <label>
        Leave this blank
        <input v-model="honeypot" type="text" name="bec_hp" tabindex="-1" autocomplete="off" />
      </label>
    </div>
    <button class="submit" type="submit" :disabled="sending">
      {{ sending ? 'Sending…' : buttonLabel }}
    </button>
    <p v-if="message" class="status" role="status">{{ message }}</p>
    <p v-else-if="!compact" class="hint">New batches and designer morphs only. Unsubscribe anytime.</p>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
  </form>
</template>

<style scoped>
.release-form {
  display: grid;
  gap: 0.65rem;
  width: min(100%, 24rem);
}

.heading {
  margin: 0;
  color: #e0f2fe;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.field {
  display: grid;
  gap: 0.3rem;
}

.label {
  font-size: 0.82rem;
  color: #cbd5e1;
}

.optional {
  color: #94a3b8;
  font-weight: 400;
}

input {
  width: 100%;
  border-radius: 0.75rem;
  border: 1px solid rgba(148, 163, 184, 0.55);
  background: rgba(2, 6, 23, 0.9);
  color: #e5e7eb;
  padding: 0.6rem 0.75rem;
  font-size: 0.95rem;
}

input:focus-visible {
  outline: 2px solid #22d3ee;
  outline-offset: 2px;
}

.submit {
  border: none;
  border-radius: 999px;
  padding: 0.7rem 1.2rem;
  background: linear-gradient(to right, #22d3ee, #0ea5e9);
  color: #0f172a;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
}

.submit:hover:not(:disabled) {
  filter: brightness(1.05);
}

.submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.submit:focus-visible {
  outline: 2px solid #22d3ee;
  outline-offset: 2px;
}

.hint,
.status,
.error {
  margin: 0;
  font-size: 0.82rem;
  line-height: 1.4;
}

.hint,
.status {
  color: #7dd3fc;
}

.error {
  color: #fecaca;
}

.compact .label {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.hp {
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
</style>
