<template>
  <NuxtLink to="/cart" class="cart-link" aria-label="Shopping cart">
    <span class="cart-icon-wrap">
      <span class="cart-icon" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
      </span>
      <span v-if="count > 0" class="cart-badge">{{ count }}</span>
    </span>
  </NuxtLink>
</template>

<script setup>
const cart = useCart()
const count = computed(() => cart.itemCount?.value ?? cart.itemCount ?? 0)
</script>

<style scoped>
.cart-link {
  display: flex;
  align-items: center;
}

.cart-icon-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-icon {
  color: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-link:hover .cart-icon {
  color: #7dd3fc;
}

.cart-badge {
  position: absolute;
  top: -6px;
  right: -8px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  font-size: 0.7rem;
  font-weight: 700;
  color: #0f172a;
  background: #22d3ee;
  border: 2px solid rgba(15, 23, 42, 0.95);
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  box-sizing: border-box;
}
</style>
