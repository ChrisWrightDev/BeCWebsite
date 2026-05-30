<script setup>
const toast = useCartToast()
</script>

<template>
  <div
    class="cart-toast"
    :class="{ visible: toast.visible }"
    role="status"
    aria-live="polite"
    aria-atomic="true"
  >
    <span v-if="toast.visible">{{ toast.message }}</span>
    <NuxtLink v-if="toast.visible" to="/cart" class="cart-toast-link" @click="toast.dismiss()">
      View cart
    </NuxtLink>
    <button
      v-if="toast.visible"
      type="button"
      class="cart-toast-dismiss"
      aria-label="Dismiss notification"
      @click="toast.dismiss()"
    >
      ×
    </button>
  </div>
</template>

<style scoped>
.cart-toast {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1.1rem;
  border-radius: 0.75rem;
  background: linear-gradient(to right, rgba(15, 23, 42, 0.98), rgba(8, 47, 73, 0.98));
  border: 1px solid rgba(34, 211, 238, 0.4);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
  color: #f1f5f9;
  font-size: 0.9rem;
  font-weight: 500;
  opacity: 0;
  transform: translateY(1rem);
  pointer-events: none;
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.cart-toast.visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.cart-toast-link {
  color: #22d3ee;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-decoration: none;
  white-space: nowrap;
}

.cart-toast-link:hover {
  color: #7dd3fc;
}

.cart-toast-dismiss {
  border: none;
  background: transparent;
  color: #94a3b8;
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
  padding: 0 0.15rem;
}

.cart-toast-dismiss:hover {
  color: #e2e8f0;
}

.cart-toast-dismiss:focus-visible {
  outline: 2px solid #22d3ee;
  outline-offset: 2px;
  border-radius: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .cart-toast {
    transition: none;
    transform: none;
  }
}
</style>
