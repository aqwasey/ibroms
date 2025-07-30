<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="Edit Underwriter"
    variant="edit"
    :loading="loading"
    showActions
    @confirm="handleSubmit"
    confirmButtonText="Update"
  >
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
      <!-- Underwriter Name Field -->
      <InputField 
        v-model="formState.name"
        label="Underwriter Name"
        placeholder="Enter underwriter name"
        id="name"
        :error="errors.name"
      />
      
      <!-- Description Field -->
      <InputField 
        v-model="formState.description"
        label="Description"
        placeholder="Enter description"
        id="description"
        :error="errors.description"
      />
      
      <!-- Website Field -->
      <InputField 
        v-model="formState.website"
        label="Website"
        placeholder="Enter website URL"
        id="website"
        :error="errors.website"
      />
      
      <!-- Logo Field -->
      <InputField 
        v-model="formState.logo"
        label="Logo URL"
        placeholder="Enter logo URL"
        id="logo"
        :error="errors.logo"
      />
      
      <!-- Sector Field -->
      <SelectField 
        v-model="formState.sector"
        label="Sector"
        placeholder="Select sector"
        id="sector"
        :options="sectorOptions"
        :error="errors.sector"
      />
      
      <!-- Province Field -->
      <SelectField 
        v-model="formState.province"
        label="Province"
        placeholder="Select province"
        id="province"
        :options="provinceOptions"
        :error="errors.province"
      />
      
      <!-- Town/City Field -->
      <InputField 
        v-model="formState.town_city"
        label="Town/City"
        placeholder="Enter town/city"
        id="town_city"
        :error="errors.town_city"
      />
    </form>
  </Modal>
</template>

<script setup>
import { ref, reactive, inject, watch } from 'vue'
import Modal from '@/components/Modal.vue'
import InputField from '@/components/InputField.vue'
import SelectField from '@/components/SelectField.vue'
import { useUnderwritersStore } from '@/stores/underwriters'
import notificationService from '@/services/notificationService'

const store = useUnderwritersStore()
const loading = ref(false)

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  underwriter: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:show', 'underwriter-updated'])

// Form state
const formState = reactive({
  id: '',
  name: '',
  description: '',
  website: '',
  logo: '',
  sector: '',
  province: '',
  town_city: '',
  active: false,
  created_on: '',
  updated_on: ''
})

// Form errors
const errors = reactive({
  name: '',
  description: '',
  website: '',
  logo: '',
  sector: '',
  province: '',
  town_city: ''
})

// Watch for changes in the underwriter prop to update form
watch(() => props.underwriter, (newVal) => {
  if (newVal) {
    // Map all properties from the provided underwriter object
    Object.keys(formState).forEach(key => {
      formState[key] = newVal[key] !== undefined ? newVal[key] : '';
    });
  }
}, { immediate: true, deep: true })

// Options for select fields
const sectorOptions = [
  { value: 'Funeral', label: 'Funeral' },
  { value: 'Life', label: 'Life' },
  { value: 'Medical', label: 'Medical' },
  { value: 'General', label: 'General' }
]

const provinceOptions = [
  { value: 'Eastern Cape', label: 'Eastern Cape' },
  { value: 'Free State', label: 'Free State' },
  { value: 'Gauteng', label: 'Gauteng' },
  { value: 'KwaZulu-Natal', label: 'KwaZulu-Natal' },
  { value: 'Limpopo', label: 'Limpopo' },
  { value: 'Mpumalanga', label: 'Mpumalanga' },
  { value: 'Northern Cape', label: 'Northern Cape' },
  { value: 'North West', label: 'North West' },
  { value: 'Western Cape', label: 'Western Cape' }
]

// Validate form
const validateForm = () => {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => errors[key] = '')
  
  // Required field validation
  if (!formState.name) {
    errors.name = 'Underwriter name is required'
    isValid = false
  } else if (formState.name.length > 120) {
    errors.name = 'Name must be 120 characters or less'
    isValid = false
  }
  
  // Sector validation
  if (!formState.sector) {
    errors.sector = 'Sector is required'
    isValid = false
  } else if (formState.sector.length > 25) {
    errors.sector = 'Sector must be 25 characters or less'
    isValid = false
  }
  
  // Website validation (optional but must be valid URL if provided)
  if (formState.website) {
    try {
      new URL(formState.website)
    } catch (e) {
      errors.website = 'Please enter a valid URL'
      isValid = false
    }
  }
  
  return isValid
}

// Submit handler
const handleSubmit = async () => {
  if (!validateForm()) return
  
  try {
    loading.value = true
    
    // Create API payload
    const payload = {
      id: formState.id,
      name: formState.name,
      description: formState.description || null,
      website: formState.website || null,
      logo: formState.logo || null,
      sector: formState.sector,
      province: formState.province || null,
      town_city: formState.town_city || null,
      active: formState.active,
      created_on: formState.created_on,
      updated_on: formState.updated_on
    }
    
    // Save to store/API
    const updatedUnderwriter = await store.updateUnderwriter(formState.id, payload)
    
    notificationService.success('Underwriter updated successfully!')
    emit('underwriter-updated', updatedUnderwriter)
    emit('update:show', false)
  } catch (error) {
    console.error(error)
    notificationService.error(error?.response?.data?.detail || 'Failed to update underwriter')
  } finally {
    loading.value = false
  }
}
</script>
