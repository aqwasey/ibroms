<template>
  <div class="w-full">
    <label 
      v-if="label" 
      :for="fieldId" 
      class="block text-sm font-medium mb-1"
      :style="{ color: error ? colors.DANGER : colors.TEXT_PRIMARY }"
    >
      {{ label }}
      <span v-if="required" class="ml-1" :style="{ color: colors.DANGER }">*</span>
    </label>
    
    <textarea
      :id="fieldId"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      :rows="rows"
      :disabled="disabled"
      :required="required"
      class="textarea-field"
      :style="textareaStyles"
    />
    
    <p v-if="error" class="mt-1 text-sm" :style="{ color: colors.DANGER }">{{ error }}</p>
    <p v-else-if="hint" class="mt-1 text-sm" :style="{ color: colors.TEXT_SECONDARY }">{{ hint }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { COLORS } from '@/constants/colors'

const colors = COLORS

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  rows: {
    type: Number,
    default: 3
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])

// Generate unique field ID
const fieldId = computed(() => {
  return props.id || `textarea-${Math.random().toString(36).substr(2, 9)}`
})

// Computed styles for textarea
const textareaStyles = computed(() => {
  const baseStyles = {
    width: '100%',
    padding: '8px 12px',
    border: `1px solid ${colors.BORDER}`,
    borderRadius: '6px',
    fontSize: '14px',
    lineHeight: '1.5',
    transition: 'all 0.2s ease',
    resize: 'none',
    outline: 'none'
  }

  if (props.disabled) {
    return {
      ...baseStyles,
      backgroundColor: colors.BACKGROUND_SECONDARY,
      color: colors.TEXT_DISABLED,
      cursor: 'not-allowed',
      borderColor: colors.BORDER
    }
  }

  if (props.error) {
    return {
      ...baseStyles,
      borderColor: colors.DANGER,
      color: colors.DANGER,
      backgroundColor: '#FEF2F2'
    }
  }

  return {
    ...baseStyles,
    color: colors.TEXT_PRIMARY,
    backgroundColor: colors.BACKGROUND,
    borderColor: colors.BORDER
  }
})
</script>

<style scoped>
/* Custom scrollbar for webkit browsers */
textarea::-webkit-scrollbar {
  width: 6px;
}

textarea::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

textarea::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Focus styles for better accessibility */
textarea:focus {
  box-shadow: 0 0 0 3px rgba(207, 127, 8, 0.1);
}

/* Disabled state */
textarea:disabled {
  opacity: 0.6;
}
</style>
