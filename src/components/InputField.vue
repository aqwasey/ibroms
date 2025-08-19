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
          :type="inputType"
          :id="id"
          :placeholder="placeholder"
          v-model="localValue"
          @input="handleInput"
          class="input-field"
          :style="{ color: colors.TEXT_PRIMARY }"
          :disabled="disabled"
          v-bind="additionalAttrs"
        />
      </div>
    </div>
    <p v-if="error" class="error-text" :style="{ color: colors.DANGER }">{{ error }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { COLORS } from '@/constants/colors';
import { useInputValidation } from '@/composables/useInputValidation';

const colors = COLORS;
const { createInputHandler } = useInputValidation();

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  placeholder: String,
  type: {
    type: String,
    default: 'text',
  },
  // New validation props
  validationType: {
    type: String,
    default: null, // 'number', 'phone', 'email', 'text', 'currency'
    validator: (value) => [null, 'number', 'phone', 'email', 'text', 'currency'].includes(value)
  },
  validationOptions: {
    type: Object,
    default: () => ({})
  },
  id: String,
  error: String,
  disabled: {
    type: Boolean,
    default: false
  },
  // Additional HTML attributes
  step: [String, Number],
  min: [String, Number],
  max: [String, Number],
  maxlength: [String, Number]
});

const emit = defineEmits(['update:modelValue']);

// Computed input type - use 'text' for validated inputs to prevent browser interference
const inputType = computed(() => {
  if (props.validationType) {
    return props.validationType === 'email' ? 'email' : 'text'
  }
  return props.type
});

// Additional attributes to pass to input
const additionalAttrs = computed(() => {
  const attrs = {}
  if (props.step !== undefined) attrs.step = props.step
  if (props.min !== undefined) attrs.min = props.min
  if (props.max !== undefined) attrs.max = props.max
  if (props.maxlength !== undefined) attrs.maxlength = props.maxlength
  return attrs
});

// Create validation handler if validation type is specified
const validationHandler = computed(() => {
  if (props.validationType) {
    return createInputHandler(props.validationType, props.validationOptions)
  }
  return null
});

// Handle input with validation
const handleInput = (event) => {
  let value = event.target.value
  
  // Apply validation if specified
  if (validationHandler.value) {
    value = validationHandler.value(event)
  }
  
  emit('update:modelValue', value)
};

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
  gap: 8px;
  position: relative;
}

.input-field {
  background: transparent;
  border: none;
  flex: 1;
  font-size: 14px;
  line-height: 22px;
  outline: none;
  padding: 0;
  width: 100%;
}

.input-field::placeholder {
  color: var(--gray-400, #A3A3A3);
}

.input-field:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-text {
  font-size: 12px;
  line-height: 16px;
  margin-top: 2px;
}
</style>
