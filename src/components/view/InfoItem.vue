<template>
  <div class="info-item" :class="{ 'full-width': fullWidth }">
    <span class="info-label">{{ label }}</span>
    <div class="info-content">
      <!-- Slot for custom content -->
      <slot>
        <!-- Default value display -->
        <span 
          class="info-value" 
          :class="{ 
            'font-mono': monospace,
            'info-description': isDescription 
          }"
        >
          {{ displayValue }}
        </span>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number, Boolean, Object, Array],
    default: ''
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  monospace: {
    type: Boolean,
    default: false
  },
  isDescription: {
    type: Boolean,
    default: false
  },
  formatter: {
    type: Function,
    default: null
  }
})

const displayValue = computed(() => {
  if (props.formatter && typeof props.formatter === 'function') {
    return props.formatter(props.value)
  }
  
  if (Array.isArray(props.value)) {
    return props.value.join(', ')
  }
  
  if (typeof props.value === 'boolean') {
    return props.value ? 'Yes' : 'No'
  }
  
  return props.value || ''
})
</script>

<style scoped>
.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #757575;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-value {
  font-size: 1rem;
  font-weight: 500;
  color: #222222;
  line-height: 1.5;
}

.info-value.font-mono {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
  background-color: #F7F8FA;
  padding: 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid #E0E0E0;
}

.info-value.info-description {
  font-size: 1rem;
  color: #757575;
  line-height: 1.6;
  margin: 0;
  padding: 1rem;
  background-color: #FBF3E7;
  border-radius: 0.5rem;
  border-left: 4px solid #CF7F08;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
