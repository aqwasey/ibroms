<template>
  <div class="input-wrapper">
    <label v-if="label" :for="id" class="label" :style="{ color: colors.TEXT_PRIMARY }">{{ label }}</label>
    <div class="input" :class="{ 'input-error': error }" :style="{ 
      borderColor: error ? colors.DANGER : colors.BORDER,
      backgroundColor: colors.WHITE,
      boxShadow: 'var(--shadow-xs)' 
    }">
      <div class="input-content">
        <input
          type="datetime-local"
          :id="id"
          :placeholder="placeholder"
          v-model="localValue"
          class="input-field datetime-input"
          :style="{ color: colors.TEXT_PRIMARY }"
          :disabled="disabled"
        />
      </div>
    </div>
    <p v-if="error" class="error-text" :style="{ color: colors.DANGER }">{{ error }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { COLORS } from '@/constants/colors';

const colors = COLORS;

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  placeholder: String,
  id: String,
  error: String,
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

// Writable computed to bridge v-model usage
const localValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});
</script>

<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.label {
  font-family: var(--text-sm-medium-font-family, sans-serif);
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  margin-top: -1px;
  white-space: nowrap;
}

.input {
  align-items: center;
  align-self: stretch;
  border: 1px solid;
  border-radius: 8px;
  display: flex;
  padding: 10px 14px;
  position: relative;
  width: 100%;
}

.input-content {
  align-items: center;
  display: flex;
  flex: 1;
  flex-grow: 1;
  gap: 8px;
}

.input-field {
  background: transparent;
  border: 0;
  flex: 1;
  flex-grow: 1;
  font-family: var(--text-sm-regular-font-family, sans-serif);
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  outline: none;
  padding: 0;
}

/* Enhanced datetime-local input styling */
.datetime-input {
  color: #374151 !important; /* text-gray-700 */
}

.datetime-input::-webkit-datetime-edit {
  color: #374151; /* text-gray-700 */
}

.datetime-input::-webkit-datetime-edit-text {
  color: #6b7280; /* text-gray-500 for separators */
}

.datetime-input::-webkit-datetime-edit-month-field,
.datetime-input::-webkit-datetime-edit-day-field,
.datetime-input::-webkit-datetime-edit-year-field,
.datetime-input::-webkit-datetime-edit-hour-field,
.datetime-input::-webkit-datetime-edit-minute-field {
  color: #374151; /* text-gray-700 */
}

.datetime-input::-webkit-calendar-picker-indicator {
  color: #6b7280; /* text-gray-500 */
  cursor: pointer;
}

.input-error {
  border-color: #ef4444 !important; /* red-500 */
}

.error-text {
  font-family: var(--text-sm-regular-font-family, sans-serif);
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  margin-top: 2px;
}
</style>
