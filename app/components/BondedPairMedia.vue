<template>
  <div class="pair-media">
    <video
      v-if="videoUrl"
      :src="videoUrl"
      :poster="posterUrl || undefined"
      class="media"
      controls
      muted
      playsinline
      loop
      preload="metadata"
    />
    <img
      v-else-if="imageUrl"
      :src="imageUrl"
      :alt="alt"
      class="media"
      :width="width"
      :height="height"
      :loading="priority ? undefined : 'lazy'"
      :fetchpriority="priority ? 'high' : undefined"
      decoding="async"
    />
    <div v-else class="media placeholder">
      <span>Bonded pair preview</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  videoUrl: { type: String, default: '' },
  posterUrl: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  alt: { type: String, default: 'Bonded clownfish pair' },
  width: { type: Number, default: 720 },
  height: { type: Number, default: 540 },
  priority: { type: Boolean, default: false },
})
</script>

<style scoped>
.pair-media {
  width: 100%;
  height: 100%;
}

.media {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background-color: #020617;
}

.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 0.9rem;
  min-height: 10rem;
}
</style>
