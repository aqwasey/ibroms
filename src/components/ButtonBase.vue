<template>
  <button 
    class="button" 
    :class="[
      variant,
      { 'disabled': disabled }
    ]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <Plus v-if="variant === 'add'" class="icon" />
    <span class="text">{{ label }}</span>
  </button>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { COLORS } from '@/constants/colors';
import { Plus } from 'lucide-vue-next';

const colors = COLORS;

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'add'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value)
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
  padding: 6px 16px;
  font-size: 14px;
  gap: 8px;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
}

.button:hover {
  opacity: 0.9;
}

.button:active {
  transform: scale(0.98);
}

/* Primary Button - Main actions */
.primary {
  background-color: v-bind('colors.PRIMARY');
  border-color: v-bind('colors.PRIMARY');
  color: v-bind('colors.WHITE');
}

/* Secondary Button - Cancel/alternative actions */
.secondary {
  background-color: v-bind('colors.WHITE');
  border-color: v-bind('colors.BORDER_DARK');
  color: v-bind('colors.TEXT_PRIMARY');
}

/* Add Button with Plus Icon */
.add {
  background-color: v-bind('colors.PRIMARY');
  border-color: v-bind('colors.PRIMARY');
  color: v-bind('colors.WHITE');
}

/* Disabled state */
.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.disabled:hover {
  opacity: 0.6;
}

.disabled:active {
  transform: none;
}

.icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
