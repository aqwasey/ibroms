<template>
  <div class="text-and-supporting">
    <h1 class="title" :style="{ color: colors.TEXT_PRIMARY }">{{ title }}</h1>
    <p v-if="subtitle" class="subtitle" :style="{ color: colors.TEXT_SECONDARY }">{{ subtitle }}</p>
  </div>
</template>

<script setup>
import { COLORS } from '@/constants/colors';

// Props
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  }
});

const colors = COLORS;
</script>

<style scoped>
.text-and-supporting {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
}

.title {
  align-self: stretch;
  font-size: 30px;
  font-weight: 500;
  line-height: 38px;
  margin-top: -1px;
  position: relative;
}

.subtitle {
  font-size: 14px;
  line-height: 20px;
  margin-top: 4px;
}
</style>
