<template>
  <div class="select-wrapper">
    <label v-if="label" :for="id" class="label" :style="{ color: colors.TEXT_PRIMARY }">{{ label }}</label>
    <div class="select-input" :class="{ 'input-error': error }" 
      :style="{ 
        borderColor: error ? colors.DANGER : colors.BORDER,
        backgroundColor: colors.WHITE,
        boxShadow: 'var(--shadow-xs)'
      }">
      <div class="select-content">
        <select
          :id="id"
          v-model="localValue"
          class="select-field"
          :style="{ color: colors.TEXT_PRIMARY }"
          :disabled="disabled">
          <option v-if="placeholder" value="" disabled selected>{{ placeholder }}</option>
          <option v-for="option in options" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
      <ChevronDown class="chevron-icon" :color="colors.GRAY_600" />
    </div>
    <p v-if="error" class="error-text" :style="{ color: colors.DANGER }">{{ error }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { ChevronDown } from 'lucide-vue-next';
import { COLORS } from '@/constants/colors';

const colors = COLORS;

const props = defineProps({
  modelValue: [String, Number, Boolean, Object],
  label: String,
  placeholder: String,
  id: String,
  error: String,
  disabled: {
    type: Boolean,
    default: false
  },
  options: {
    type: Array,
    default: () => []
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
.select-wrapper {
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

.select-input {
  align-items: center;
  align-self: stretch;
  border: 1px solid;
  border-radius: 8px;
  display: flex;
  padding: 10px 14px;
  position: relative;
  width: 100%;
  justify-content: space-between;
}

.select-content {
  align-items: center;
  display: flex;
  flex: 1;
  gap: 8px;
  position: relative;
}

.select-field {
  appearance: none;
  background: transparent;
  border: none;
  flex: 1;
  font-size: 14px;
  line-height: 22px;
  outline: none;
  padding: 0;
  width: 100%;
}

.chevron-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.select-field:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-text {
  font-size: 12px;
  line-height: 16px;
  margin-top: 2px;
}
</style>
