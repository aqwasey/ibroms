<template>
  <div class="flex items-center gap-1">
    <input
      :id="id"
      type="checkbox"
      v-model="localValue"
      class="form-checkbox h-4 w-4 text-indigo-600"
    />
    <label :for="id" class="inline-flex items-center ml-2 space-x-2">
      <span><slot /></span> {{ label }}
    </label>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  label: String,
  id: String,
})
const emit = defineEmits(['update:modelValue'])

const localValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})
</script>
