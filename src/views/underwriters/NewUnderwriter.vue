<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="Add Underwriter"
    variant="edit"
    :loading="loading"
    showActions
    @confirm="handleSubmit"
    confirmButtonText="Save"
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
      
      <!-- Province and Town/City Fields -->
      <ProvinceSelect
        v-model="locationData"
        :provinceError="errors.province"
        :cityError="errors.town_city"
      />
    </form>
  </Modal>
</template>

<script setup>
import { ref, reactive, inject, watch } from 'vue'
import Modal from '@/components/Modal.vue'
import InputField from '@/components/InputField.vue'
import SelectField from '@/components/SelectField.vue'
import ProvinceSelect from '@/components/ProvinceSelect.vue'
import { useUnderwritersStore } from '@/stores/underwriters'
import notificationService from '@/services/notificationService'
import { isValidEmail } from '@/utils/validation';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:show', 'underwriter-created'])

const store = useUnderwritersStore()
const loading = ref(false)

// Form state
const formState = reactive({
  name: '',
  description: '',
  website: '',
  logo: '',
  sector: '',
  province: '',
  town_city: ''
})

// Location data for ProvinceSelect component
const locationData = ref({
  province: '',
  city: ''
})

// Sync locationData with formState
watch(locationData, (newValue) => {
  formState.province = newValue.province;
  formState.town_city = newValue.city;
}, { deep: true })

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

// Reset form when modal is opened
const resetForm = () => {
  Object.keys(formState).forEach(key => formState[key] = '')
  Object.keys(errors).forEach(key => errors[key] = '')
  locationData.value = { province: '', city: '' }
}

// Options for select fields
const sectorOptions = [
  { value: 'Funeral', label: 'Funeral' },
  { value: 'Life', label: 'Life' },
  { value: 'Medical', label: 'Medical' },
  { value: 'General', label: 'General' }
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
      name: formState.name,
      description: formState.description || null,
      website: formState.website || null,
      logo: formState.logo || null,
      sector: formState.sector,
      province: formState.province || null,
      town_city: formState.town_city || null
    }
    
    // Save to store/API
    const newUnderwriter = await store.createUnderwriter(payload)
    
    notificationService.success('Underwriter created successfully!')
    emit('underwriter-created', newUnderwriter)
    emit('update:show', false)
    resetForm()
  } catch (error) {
    console.error(error)
    notificationService.error(error?.response?.data?.detail || 'Failed to create underwriter')
  } finally {
    loading.value = false
  }
}
</script>
