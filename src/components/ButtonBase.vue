<template>
  <button 
    class="button" 
    :class="[
      `size-${size}`, 
      { 
        'with-icon': icon !== 'none',
        'icon-leading': icon === 'leading',
        'icon-trailing': icon === 'trailing'
      }
    ]"
    :style="{
      backgroundColor: variant === 'primary' ? colors.PRIMARY : colors.WHITE,
      borderColor: variant === 'primary' ? colors.PRIMARY : colors.BORDER_DARK,
      color: variant === 'primary' ? colors.WHITE : colors.TEXT_PRIMARY
    }"
    @click="$emit('click', $event)"
  >
    <component v-if="icon === 'leading'" :is="iconComponent" class="icon" />
    <span class="text">{{ text }}</span>
    <component v-if="icon === 'trailing'" :is="iconComponent" class="icon" />
  </button>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';
import { COLORS } from '@/constants/colors';
import { Plus } from 'lucide-vue-next';

const colors = COLORS;

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline'].includes(value)
  },
  icon: {
    type: String,
    default: 'none',
    validator: (value) => ['none', 'leading', 'trailing'].includes(value)
  },
  iconComponent: {
    type: Object,
    default: () => Plus
  }
});

defineEmits(['click']);
</script>

<style scoped>
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: 500;
  border: 1px solid;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.button:hover {
  opacity: 0.9;
}

.button:active {
  transform: scale(0.98);
}

.size-sm {
  padding: 8px 14px;
  font-size: 14px;
}

.size-md {
  padding: 10px 16px;
  font-size: 16px;
}

.size-lg {
  padding: 12px 18px;
  font-size: 18px;
}

.with-icon {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-leading .text {
  order: 2;
}

.icon-leading .icon {
  order: 1;
}

.icon-trailing .text {
  order: 1;
}

.icon-trailing .icon {
  order: 2;
}
</style>
