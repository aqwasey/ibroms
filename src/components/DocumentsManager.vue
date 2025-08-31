<template>
  <div class="w-full">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold" :style="{ color: COLORS.TEXT_PRIMARY }">Documents</h3>
      <button
        type="button"
        @click="addDocument"
        class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
        :style="{ 
          backgroundColor: COLORS.PRIMARY, 
          ':hover': { backgroundColor: COLORS.PRIMARY_DARK },
          'focus:ring-color': COLORS.PRIMARY_LIGHT
        }"
        @mouseover="$event.target.style.backgroundColor = COLORS.PRIMARY_DARK"
        @mouseleave="$event.target.style.backgroundColor = COLORS.PRIMARY"
      >
        <PlusIcon class="w-4 h-4 mr-1" />
        Add Document
      </button>
    </div>
    
    <div v-if="modelValue.length === 0" class="text-center py-8" :style="{ color: COLORS.TEXT_SECONDARY }">
      No documents added yet. Click "Add Document" to get started.
    </div>
    
    <div v-else class="space-y-4">
      <div 
        v-for="(doc, index) in modelValue" 
        :key="index" 
        class="border rounded-lg p-6" 
        :style="{ borderColor: COLORS.BORDER_DARK, backgroundColor: COLORS.BACKGROUND }"
      >
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-md font-medium" :style="{ color: COLORS.TEXT_PRIMARY }">
            Document {{ index + 1 }}
          </h4>
          <button
            type="button"
            @click="removeDocument(index)"
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
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium" :style="{ color: COLORS.TEXT_PRIMARY }">
              Document Type
            </label>
            <select
              :value="doc.doc_kind"
              @change="updateDocument(index, 'doc_kind', $event.target.value)"
              class="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent text-base"
              :style="{ 
                borderColor: COLORS.BORDER_DARK, 
                color: COLORS.TEXT_BODY,
                'focus:ring-color': COLORS.PRIMARY_LIGHT,
                'focus:border-color': COLORS.PRIMARY
              }"
            >
              <option value="">Select document type</option>
              <option value="ID_COPY">ID Copy</option>
              <option value="PASSPORT_COPY">Passport Copy</option>
              <option value="BIRTH_CERTIFICATE">Birth Certificate</option>
              <option value="PROOF_OF_ADDRESS">Proof of Address</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-medium" :style="{ color: COLORS.TEXT_PRIMARY }">
              Document Path
            </label>
            <input
              :value="doc.doc_path"
              @input="handleTextInput(index, 'doc_path', $event, { maxLength: 255 })"
              type="text"
              placeholder="Enter document path"
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
              Filename
            </label>
            <input
              :value="doc.filename"
              @input="handleTextInput(index, 'filename', $event, { maxLength: 100 })"
              type="text"
              placeholder="Enter filename"
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
              Notes
            </label>
            <textarea
              :value="doc.notes"
              @input="handleTextInput(index, 'notes', $event, { maxLength: 500 })"
              placeholder="Enter notes (optional)"
              rows="3"
              class="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent text-base resize-none"
              :style="{ 
                borderColor: COLORS.BORDER_DARK, 
                color: COLORS.TEXT_BODY,
                'focus:ring-color': COLORS.PRIMARY_LIGHT,
                'focus:border-color': COLORS.PRIMARY
              }"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PlusIcon, TrashIcon } from 'lucide-vue-next'
import { COLORS } from '@/constants/colors.js'
import { useInputValidation } from '@/composables/useInputValidation'

const { validateText } = useInputValidation()

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emits = defineEmits(['update:modelValue'])

// Create a new empty document
const createEmptyDocument = () => ({
  doc_kind: '',
  doc_path: '',
  filename: '',
  notes: ''
})

// Add a new document
const addDocument = () => {
  const updatedDocs = [...props.modelValue, createEmptyDocument()]
  emits('update:modelValue', updatedDocs)
}

// Remove a document
const removeDocument = (index) => {
  const updatedDocs = props.modelValue.filter((_, i) => i !== index)
  emits('update:modelValue', updatedDocs)
}

// Update a specific field of a document
const updateDocument = (index, field, value) => {
  const updatedDocs = [...props.modelValue]
  updatedDocs[index] = {
    ...updatedDocs[index],
    [field]: value
  }
  emits('update:modelValue', updatedDocs)
}

// Handle text input with validation
const handleTextInput = (index, field, event, options = {}) => {
  const validatedValue = validateText(event.target.value, options)
  
  // Update the input value immediately
  event.target.value = validatedValue
  updateDocument(index, field, validatedValue)
}
</script>
