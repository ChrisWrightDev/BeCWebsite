<script setup>
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  already: {
    type: Boolean,
    default: false,
  },
  welcomeSent: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

const dialogEl = ref(null)
const titleId = `signup-confirm-title-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
const formId = `signup-confirm-form-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`

watch(() => props.open, async (isOpen) => {
  await nextTick()
  const el = dialogEl.value
  if (!el) return
  if (isOpen) {
    if (!el.open) el.showModal()
    el.querySelector('.confirm')?.focus()
  } else if (el.open) {
    el.close()
  }
})

function onDialogClose() {
  emit('close')
}

function onBackdropClick(event) {
  if (event.target === dialogEl.value) emit('close')
}
</script>

<template>
  <Teleport to="body">
    <dialog
      ref="dialogEl"
      class="signup-dialog"
      :aria-labelledby="titleId"
      @close="onDialogClose"
      @click="onBackdropClick"
    >
      <div class="panel">
        <p class="eyebrow">Release list</p>
        <h2 :id="titleId">You're on the list</h2>
        <p v-if="already">
          You're already signed up. We'll email you when new captive-bred morphs and batches drop.
        </p>
        <template v-else>
          <p>
            Thanks for joining. We'll email you when new captive-bred morphs and batches are released.
          </p>
          <p v-if="welcomeSent" class="note">A welcome note from Blue Eyed Clowns is on its way.</p>
        </template>
        <p class="note">You can unsubscribe anytime.</p>
        <form :id="formId" method="dialog">
          <button class="confirm" type="submit">Got it</button>
        </form>
      </div>
    </dialog>
  </Teleport>
</template>

<style scoped>
.signup-dialog {
  margin: auto;
  width: min(32rem, calc(100% - 2rem));
  max-width: 32rem;
  padding: 0;
  border: 1px solid rgba(125, 211, 252, 0.45);
  border-radius: 1.25rem;
  background: #0f172a;
  color: #f8fafc;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.55);
}

.signup-dialog::backdrop {
  background: rgba(2, 6, 23, 0.78);
}

.panel {
  padding: 1.75rem 1.5rem 1.5rem;
}

.eyebrow {
  margin: 0 0 0.45rem;
  color: #7dd3fc;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

h2 {
  margin: 0 0 0.75rem;
  font-size: 1.85rem;
  line-height: 1.15;
}

p {
  margin: 0 0 0.75rem;
  color: #e2e8f0;
  font-size: 1.02rem;
  line-height: 1.55;
}

.note {
  color: #bae6fd;
}

.confirm {
  margin-top: 0.5rem;
  border: none;
  border-radius: 999px;
  padding: 0.75rem 1.4rem;
  background: linear-gradient(to right, #22d3ee, #0ea5e9);
  color: #0f172a;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
}

.confirm:hover {
  filter: brightness(1.05);
}

.confirm:focus-visible {
  outline: 2px solid #22d3ee;
  outline-offset: 3px;
}
</style>
