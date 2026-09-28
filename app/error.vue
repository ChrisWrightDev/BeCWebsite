<template>
  <div class="error-page">
    <div class="error-inner">
      <h1>{{ errorTitle }}</h1>
      <p class="error-message">{{ errorMessage }}</p>
      <div class="error-actions">
        <NuxtLink to="/" class="btn btn-primary">Go home</NuxtLink>
        <NuxtLink to="/shop" class="btn btn-secondary">Shop clownfish</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  error: Object,
})

const errorTitle = computed(() => {
  if (props.error?.statusCode === 404) {
    return 'Page not found'
  }
  return 'Something went wrong'
})

const errorMessage = computed(() => {
  if (props.error?.statusCode === 404) {
    return 'The page you're looking for doesn't exist. Check the URL or explore our clownfish catalog.'
  }
  return props.error?.message || 'An unexpected error occurred. Please try again or contact us if the problem persists.'
})

useSiteSeo({
  title: errorTitle.value,
  description: errorMessage.value,
  noindex: true,
})
</script>

<style scoped>
.error-page {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  background: radial-gradient(circle at top, rgba(15, 23, 42, 0.9), #020617 55%, #000 100%);
  color: #e5e7eb;
}

.error-inner {
  max-width: 600px;
  text-align: center;
}

h1 {
  font-size: clamp(2rem, 5vw, 3rem);
  margin: 0 0 1rem;
  color: #f8fafc;
}

.error-message {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #cbd5e1;
  margin: 0 0 2rem;
}

.error-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.85rem 1.5rem;
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 700;
  text-decoration: none;
  border: 1px solid transparent;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.btn-primary {
  background: linear-gradient(to right, #22d3ee, #0ea5e9);
  color: #0f172a;
}

.btn-secondary {
  background: transparent;
  color: #e5e7eb;
  border-color: rgba(148, 163, 184, 0.5);
}

.btn-secondary:hover {
  border-color: #7dd3fc;
  color: #7dd3fc;
}
</style>
