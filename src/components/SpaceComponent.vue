<template>
  <div 
    :class="spaceClass"
    :style="spaceStyle"
  ></div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Direction of spacing
  direction: {
    type: String,
    default: 'vertical',
    validator: (value) => ['vertical', 'horizontal', 'both'].includes(value)
  },
  // Size of spacing
  size: {
    type: [String, Number],
    default: 'medium',
    validator: (value) => {
      if (typeof value === 'number') return value >= 0
      return ['xs', 'sm', 'medium', 'lg', 'xl', '2xl'].includes(value)
    }
  },
  // Custom spacing value (overrides size)
  spacing: {
    type: [String, Number],
    default: null
  }
})

// Predefined spacing values
const spacingMap = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  medium: '1rem',   // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem'     // 48px
}

const spaceClass = computed(() => {
  const classes = []
  
  if (props.direction === 'vertical' || props.direction === 'both') {
    classes.push('block')
  }
  
  if (props.direction === 'horizontal') {
    classes.push('inline-block')
  }
  
  return classes.join(' ')
})

const spaceStyle = computed(() => {
  const style = {}
  
  // Use custom spacing if provided, otherwise use predefined size
  const spacingValue = props.spacing || 
    (typeof props.size === 'number' ? `${props.size}px` : spacingMap[props.size])
  
  switch (props.direction) {
    case 'vertical':
      style.height = spacingValue
      style.width = '100%'
      break
    case 'horizontal':
      style.width = spacingValue
      style.height = '1px'
      break
    case 'both':
      style.height = spacingValue
      style.width = spacingValue
      break
  }
  
  return style
})
</script>

<style scoped>
/* Ensure the space component doesn't interfere with layout */
div {
  flex-shrink: 0;
}
</style>
