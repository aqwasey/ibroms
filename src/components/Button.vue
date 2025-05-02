<script setup>

defineProps({
  type: {
    type: String,
    default: 'button',
  },
  variant: {
    type: String,
    default: 'primary',
  },
  size: {
    type: String,
    default: 'md',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  height: {
    type: String,
    default: '',
  },
  width: {
    type: String,
    default: '',
  },
})

const baseClasses = 'font-medium rounded focus:outline-none focus:ring-2 transition'
const variants = {
  primary: 'bg-[#D38D11] text-white hover:bg-[#B3740E]',
  secondary: 'bg-secondary text-white hover:bg-primary',
  accent: 'bg-accent text-black hover:bg-primary',
}
const sizes = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}
</script>

<template>
  <button
    :type="type"
    :class="[
      baseClasses,
      variants[variant] || variants.primary,
      sizes[size] || sizes.md,
      disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90',
    ]"
    :style="{ height: height || 'auto', width: width || 'auto' }"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>
