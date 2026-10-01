<script setup>
import {
  formatUsdFromCents,
  retailOrderTotals,
  retailShippingHint,
} from '#shared/retailShipping.js'

const props = defineProps({
  merchandiseSubtotalCents: {
    type: Number,
    required: true,
  },
  itemCount: {
    type: Number,
    default: 0,
  },
  totalsOverride: {
    type: Object,
    default: null,
  },
})

const totals = computed(() => {
  if (props.totalsOverride) return props.totalsOverride
  return retailOrderTotals(props.merchandiseSubtotalCents)
})

const itemLabel = computed(() => (props.itemCount === 1 ? 'item' : 'items'))
const hint = computed(() => retailShippingHint(totals.value))
</script>

<template>
  <div class="order-totals">
    <div class="summary-row">
      <span>Subtotal ({{ itemCount }} {{ itemLabel }})</span>
      <span>{{ formatUsdFromCents(totals.merchandiseSubtotalCents) }}</span>
    </div>
    <div class="summary-row">
      <span>Overnight shipping</span>
      <span :class="{ 'is-free': totals.freeShipping }">
        {{ totals.freeShipping ? 'FREE' : formatUsdFromCents(totals.shippingCents) }}
      </span>
    </div>
    <p class="shipping-hint">{{ hint }}</p>
    <div class="summary-row summary-total">
      <span>Total</span>
      <span>{{ formatUsdFromCents(totals.totalCents) }}</span>
    </div>
  </div>
</template>

<style scoped>
.order-totals {
  display: grid;
  gap: 0.45rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  font-size: 0.95rem;
}

.summary-total {
  margin-top: 0.35rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(148, 163, 184, 0.3);
  font-weight: 700;
}

.is-free {
  color: #6ee7b7;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.shipping-hint {
  margin: 0 0 0.15rem;
  color: #94a3b8;
  font-size: 0.8rem;
  line-height: 1.45;
}

@media (max-width: 390px) {
  .summary-row {
    font-size: 0.9rem;
  }
}
</style>
