<template>
  <div class="w-full">
    <div class="mb-4">
      <h3 class="text-lg font-semibold" :style="{ color: COLORS.TEXT_PRIMARY }">Age Items</h3>
    </div>
    
    <div v-if="modelValue.length === 0" class="text-center py-8" :style="{ color: COLORS.TEXT_SECONDARY }">
      No age items added yet. Click "Add Age Item" to get started.
    </div>
    
    <div v-else class="space-y-4">
      <div 
        v-for="(item, index) in modelValue" 
        :key="index" 
        class="border rounded-lg p-6" 
        :style="{ borderColor: COLORS.BORDER_DARK, backgroundColor: COLORS.BACKGROUND }"
      >
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-md font-medium" :style="{ color: COLORS.TEXT_PRIMARY }">
            Age Item {{ index + 1 }}
          </h4>
          <button
            type="button"
            @click="removeAgeItem(index)"
            class="inline-flex items-center p-2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
            :style="{ 
              color: COLORS.DANGER,
              'focus:ring-color': COLORS.DANGER + '33'
            }"
            @mouseover="$event.target.style.backgroundColor = COLORS.DANGER + '1A'"
            @mouseleave="$event.target.style.backgroundColor = 'transparent'"
          >
            <TrashIcon class="w-4 h-4" />
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium" :style="{ color: COLORS.TEXT_PRIMARY }">
              Title
            </label>
            <input
              :value="item.title"
              @input="updateItem(index, 'title', $event.target.value)"
              type="text"
              placeholder="Age item title"
              class="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent text-base"
              :style="{ 
                borderColor: COLORS.BORDER_DARK, 
                color: COLORS.TEXT_BODY,
                'focus:ring-color': COLORS.PRIMARY_LIGHT,
                'focus:border-color': COLORS.PRIMARY
              }"
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-medium" :style="{ color: COLORS.TEXT_PRIMARY }">
              Start Age
            </label>
            <input
              :value="item.start_age"
              @input="handleNumericInput(index, 'start_age', $event)"
              type="text"
              placeholder="Start age"
              class="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent text-base"
              :style="{ 
                borderColor: COLORS.BORDER_DARK, 
                color: COLORS.TEXT_BODY,
                'focus:ring-color': COLORS.PRIMARY_LIGHT,
                'focus:border-color': COLORS.PRIMARY
              }"
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-medium" :style="{ color: COLORS.TEXT_PRIMARY }">
              End Age
            </label>
            <input
              :value="item.end_age"
              @input="handleNumericInput(index, 'end_age', $event)"
              type="text"
              placeholder="End age"
              class="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent text-base"
              :style="{ 
                borderColor: COLORS.BORDER_DARK, 
                color: COLORS.TEXT_BODY,
                'focus:ring-color': COLORS.PRIMARY_LIGHT,
                'focus:border-color': COLORS.PRIMARY
              }"
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-medium" :style="{ color: COLORS.TEXT_PRIMARY }">
              Relationship
            </label>
            <select
              :value="item.correlate"
              @change="updateItem(index, 'correlate', $event.target.value)"
              class="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent text-base"
              :style="{ 
                borderColor: COLORS.BORDER_DARK, 
                color: COLORS.TEXT_BODY,
                'focus:ring-color': COLORS.PRIMARY_LIGHT,
                'focus:border-color': COLORS.PRIMARY
              }"
            >
              <option value="">Select relationship</option>
              <option value="Principal Member">Principal Member</option>
              <option value="Son">Son</option>
              <option value="Child">Child</option>
              <option value="Daughter">Daughter</option>
              <option value="Uncle">Uncle</option>
              <option value="Aunty">Aunty</option>
              <option value="Extended Family">Extended Family</option>
              <option value="Mother">Mother</option>
              <option value="Father">Father</option>
              <option value="Cousin">Cousin</option>
              <option value="Niece">Niece</option>
              <option value="Nephew">Nephew</option>
              <option value="Grand-Mother">Grand-Mother</option>
              <option value="Grand-Father">Grand-Father</option>
              <option value="Spouse">Spouse</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-medium" :style="{ color: COLORS.TEXT_PRIMARY }">
              Premium
            </label>
            <input
              :value="item.premium"
              @input="handleCurrencyInput(index, 'premium', $event)"
              type="text"
              placeholder="Premium"
              class="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent text-base"
              :style="{ 
                borderColor: COLORS.BORDER_DARK, 
                color: COLORS.TEXT_BODY,
                'focus:ring-color': COLORS.PRIMARY_LIGHT,
                'focus:border-color': COLORS.PRIMARY
              }"
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-medium" :style="{ color: COLORS.TEXT_PRIMARY }">
              Payout
            </label>
            <input
              :value="item.payout"
              @input="handleCurrencyInput(index, 'payout', $event)"
              type="text"
              placeholder="Payout"
              class="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent text-base"
              :style="{ 
                borderColor: COLORS.BORDER_DARK, 
                color: COLORS.TEXT_BODY,
                'focus:ring-color': COLORS.PRIMARY_LIGHT,
                'focus:border-color': COLORS.PRIMARY
              }"
            />
          </div>
        </div>
      </div>
    </div>
    
    <!-- Add Age Item Button moved to bottom -->
    <div class="mt-6 flex justify-center">
      <button
        type="button"
        @click="addAgeItem"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
        :style="{ 
          backgroundColor: COLORS.PRIMARY, 
          ':hover': { backgroundColor: COLORS.PRIMARY_DARK },
          'focus:ring-color': COLORS.PRIMARY_LIGHT
        }"
        @mouseover="$event.target.style.backgroundColor = COLORS.PRIMARY_DARK"
        @mouseleave="$event.target.style.backgroundColor = COLORS.PRIMARY"
      >
        <PlusIcon class="w-4 h-4 mr-1" />
        Add Age Item
      </button>
    </div>
  </div>
</template>

<script setup>
import { PlusIcon, TrashIcon } from 'lucide-vue-next'
import { COLORS } from '@/constants/colors.js'
import { useInputValidation } from '@/composables/useInputValidation'

const { validateNumber, validateCurrency } = useInputValidation()

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emits = defineEmits(['update:modelValue'])

// Create a new empty age item
const createEmptyAgeItem = () => ({
  title: '',
  start_age: 0,
  end_age: 0,
  correlate: '',
  premium: 0,
  payout: 0
})

// Add a new age item
const addAgeItem = () => {
  const updatedItems = [...props.modelValue, createEmptyAgeItem()]
  emits('update:modelValue', updatedItems)
}

// Remove an age item
const removeAgeItem = (index) => {
  const updatedItems = props.modelValue.filter((_, i) => i !== index)
  emits('update:modelValue', updatedItems)
}

// Update a specific field of an age item
const updateItem = (index, field, value) => {
  const updatedItems = [...props.modelValue]
  updatedItems[index] = {
    ...updatedItems[index],
    [field]: value
  }
  emits('update:modelValue', updatedItems)
}

// Handle numeric input for age fields
const handleNumericInput = (index, field, event) => {
  const validatedValue = validateNumber(event.target.value, {
    allowDecimals: false,
    min: 0,
    max: 120
  })
  
  // Update the input value immediately
  event.target.value = validatedValue
  updateItem(index, field, validatedValue)
}

// Handle currency input for premium and payout fields
const handleCurrencyInput = (index, field, event) => {
  const validatedValue = validateCurrency(event.target.value, {
    maxDecimals: 2,
    min: 0
  })
  
  // Update the input value immediately
  event.target.value = validatedValue
  updateItem(index, field, validatedValue)
}
</script>
