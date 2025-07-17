<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">{{ label }}</label>
    
    <!-- Selected Tags Display -->
    <div class="flex flex-wrap gap-2 mb-2">
      <div 
        v-for="(tag, index) in modelValue" 
        :key="tag"
        class="flex items-center bg-blue-100 px-2 py-1 rounded-md"
      >
        <span>{{ getOptionLabel(tag) }}</span>
        <button 
          @click="removeTag(tag)" 
          class="ml-2 text-gray-500 hover:text-gray-700"
          type="button"
        >
          &times;
        </button>
      </div>
    </div>
    
    <!-- Dropdown Select -->
    <div class="relative">
      <div 
        @click="toggleDropdown" 
        class="flex items-center justify-between border border-gray-300 rounded-md px-3 py-2 bg-white cursor-pointer"
      >
        <span class="text-gray-500">{{ placeholder }}</span>
        <span class="ml-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
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
          v-if="filteredOptions.length === 0" 
          class="px-3 py-2 text-gray-500 text-sm"
        >
          No options available
        </div>
        <div 
          v-for="option in filteredOptions" 
          :key="getOptionValue(option)"
          @click="toggleOption(option)"
          class="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
        >
          <input 
            type="checkbox" 
            :checked="isSelected(option)" 
            class="mr-2" 
            @click.stop 
          />
          <span>{{ getOptionLabel(option) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed, onMounted, onBeforeUnmount } from 'vue'
import { message } from 'ant-design-vue'

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

// Filtered options that aren't already selected
const filteredOptions = computed(() => {
  return props.options.filter(option => !isSelected(option))
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
