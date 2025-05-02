<script setup>

defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text', 
  },
  placeholder: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  error: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const baseClasses = 'block w-full rounded border focus:outline-none focus:ring-2 transition'
const errorClasses = 'border-red-500 focus:ring-red-500'
const normalClasses = 'border-gray-300 focus:ring-primary'
</script>

<template>
  <div class="mb-4">
    <label v-if="label" control class="block text-sm font-medium text-text mb-1">
      {{ label }}
    </label>
    <input
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      :disabled="disabled"
      :class="[
        baseClasses,
        error ? errorClasses : normalClasses,
        disabled ? 'opacity-50 cursor-not-allowed' : '',
      ]"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
  </div>
</template>
