<template>
  <div class="info-grid" :class="gridClass">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  columns: {
    type: Number,
    default: 2
  },
  gridClass: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.info-grid.single-column {
  grid-template-columns: 1fr;
}

.info-grid.three-columns {
  grid-template-columns: 1fr 1fr 1fr;
}

/* Responsive Design */
@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
