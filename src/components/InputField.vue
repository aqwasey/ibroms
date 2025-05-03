<template>
  <div>
    <label v-if="label" :for="id" class="block mb-1 font-medium text-sm text-gray-700">{{ label }}</label>
    <input
      :type="type"
      :id="id"
      :placeholder="placeholder"
      v-model="localValue"
      :class="[
        'w-full px-4 py-2 border rounded-md outline-none transition focus:ring-2',
        error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-200'
      ]"
    />
    <p v-if="error" class="text-sm text-red-500 mt-1">{{ error }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  placeholder: String,
  type: {
    type: String,
    default: 'text',
  },
  id: String,
  error: String,
});

const emit = defineEmits(['update:modelValue']);

// Writable computed to bridge v-model usage
const localValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});
</script>
