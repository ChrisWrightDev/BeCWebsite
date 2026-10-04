<script setup>
useSiteSeo({
  title: 'Unsubscribe',
  noindex: true,
  nofollow: true,
})

const route = useRoute()
const token = computed(() => String(route.params.token || ''))
const status = ref('ready')
const message = ref('')

function errorText(err) {
  return err?.data?.statusMessage || err?.data?.message || 'Could not update your subscription.'
}

async function unsubscribe() {
  status.value = 'working'
  message.value = ''
  try {
    const result = await $fetch('/api/subscribers/unsubscribe', {
      method: 'POST',
      body: { token: token.value },
    })
    message.value = result?.message || 'You have been unsubscribed.'
    status.value = 'done'
  } catch (err) {
    message.value = errorText(err)
    status.value = 'error'
  }
}
</script>

<template>
  <section class="page">
    <div class="inner">
      <h1>Release list</h1>
      <p v-if="status === 'ready'" class="lead">
        Confirm to stop new-morph and batch emails from Blue Eyed Clowns. Order emails are not affected.
      </p>
      <p v-else class="lead" :class="{ error: status === 'error' }" role="status">
        {{ message }}
      </p>
      <button
        v-if="status !== 'done'"
        type="button"
        class="btn"
        :disabled="status === 'working'"
        @click="unsubscribe"
      >
        {{ status === 'working' ? 'Updating…' : 'Unsubscribe' }}
      </button>
      <NuxtLink v-else to="/" class="btn">Back to the homepage</NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.page {
  padding: 4rem 1.5rem;
  background: radial-gradient(circle at top, rgba(15, 23, 42, 0.9), #020617 55%, #000 100%);
  color: #e5e7eb;
  min-height: 50vh;
}

.inner {
  max-width: 560px;
  margin: 0 auto;
}

h1 {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.lead {
  color: #cbd5e1;
  line-height: 1.55;
}

.lead.error {
  color: #fecaca;
}

.btn {
  display: inline-flex;
  margin-top: 1rem;
  border: none;
  border-radius: 999px;
  padding: 0.75rem 1.4rem;
  background: linear-gradient(to right, #22d3ee, #0ea5e9);
  color: #0f172a;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
