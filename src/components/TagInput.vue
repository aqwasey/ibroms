<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">{{ label }}</label>

    <!-- Dropdown Select with Tags Inside -->
    <div class="relative">
      <div
        @click="toggleDropdown"
        class="flex flex-wrap items-center min-h-[42px] border border-gray-300 rounded-md px-3 py-1 bg-white cursor-pointer relative"
        :class="{'border-primary': isOpen}"
      >
        <!-- Selected Tags Inside Input -->
        <div
          v-for="tag in modelValue"
          :key="tag"
          class="flex items-center bg-primary-bg text-primary border border-primary border-opacity-30 px-3 py-1 m-2 rounded-md"
        >
          <span>{{ getOptionLabel(tag) }}</span>
          <button
            @click.stop="removeTag(tag)"
            class="ml-3 text-primary hover:text-primary-dark"
            type="button"
          >
            &times;
          </button>
        </div>

        <!-- Placeholder if nothing selected -->
        <span v-if="modelValue.length === 0" class="text-gray-600 py-1 ml-1">{{ placeholder }}</span>

        <!-- Dropdown Icon - positioned absolutely to extreme right -->
        <span class="absolute right-3 top-1/2 transform -translate-y-1/2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </span>
      </div>

      <!-- Dropdown Options -->
      <div
        v-if="isOpen"
        class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg py-1 max-h-60 overflow-auto"
      >
        <div
          v-if="availableOptions.length === 0"
          class="px-3 py-2 text-gray-500 text-sm"
        >
          No options available
        </div>

        <!-- Show all options, both selected and unselected -->
        <div
          v-for="option in props.options"
          :key="getOptionValue(option)"
          @click="toggleOption(option)"
          class="px-4 py-3 cursor-pointer flex items-center"
          :class="[isSelected(option) ? 'bg-primary-bg text-primary font-medium' : 'hover:bg-gray-50 text-gray-800']"
        >
          <div
            class="w-4 h-4 mr-8 flex items-center justify-center rounded border"
            :class="[isSelected(option) ? 'bg-primary border-primary' : 'border-gray-400']"
          >
            <svg v-if="isSelected(option)" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <span class="text-sm font-medium">{{ getOptionLabel(option) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed, onMounted, onBeforeUnmount } from 'vue'
import { message } from 'ant-design-vue'
import { COLORS } from '@/constants/colors.js'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  options: {
    type: Array,
    default: () => []
  },
  optionLabel: {
    type: String,
    default: 'label'
  },
  optionValue: {
    type: String,
    default: 'value'
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Select options'
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)

// Helper functions to get option label and value
const getOptionLabel = (option) => {
  if (typeof option === 'string') return option
  return option[props.optionLabel] || option.toString()
}

const getOptionValue = (option) => {
  if (typeof option === 'string') return option
  return option[props.optionValue] || option.toString()
}

// Available options - now we show all options in the dropdown, but style them differently when selected
const availableOptions = computed(() => {
  return props.options
})

// Check if an option is selected
const isSelected = (option) => {
  const value = getOptionValue(option)
  return props.modelValue.includes(value)
}

// Toggle dropdown open/closed
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

// Add or remove an option
const toggleOption = (option) => {
  const value = getOptionValue(option)

  if (isSelected(option)) {
    removeTag(value)
  } else {
    addTag(value)
  }
}

// Add a tag
const addTag = (value) => {
  // Don't add duplicates
  if (props.modelValue.includes(value)) {
    return
  }

  const updatedTags = [...props.modelValue, value]
  emit('update:modelValue', updatedTags)
}

// Remove a tag
const removeTag = (value) => {
  const updatedTags = props.modelValue.filter(tag => tag !== value)
  emit('update:modelValue', updatedTags)
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (isOpen.value && !event.target.closest('.relative')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Add custom styles for the component using our color constants */
:deep(.border-primary) {
  border-color: v-bind('COLORS.PRIMARY');
}

:deep(.text-primary) {
  color: v-bind('COLORS.PRIMARY');
}

:deep(.hover\:text-primary-dark:hover) {
  color: v-bind('COLORS.PRIMARY_DARK');
}

:deep(.bg-primary) {
  background-color: v-bind('COLORS.PRIMARY');
}

:deep(.border-primary) {
  border-color: v-bind('COLORS.PRIMARY');
}

:deep(.bg-primary-bg) {
  background-color: v-bind('COLORS.PRIMARY_BG');
}
</style>
