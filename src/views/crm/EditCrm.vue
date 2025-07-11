<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="Edit CRM"
    @save="handleSubmit"
  >
    <div class="w-full flex flex-col gap-4">
      <InputField
        v-model="formData.otherNames"
        label="Other Name(s)"
        placeholder="Enter other names"
        class="w-full"
      />

      <InputField
        v-model="formData.surname"
        label="Surname"
        placeholder="Enter surname"
        class="w-full"
      />

      <SelectField
        v-model="formData.gender"
        label="Gender"
        placeholder="Select gender"
        :options="genderOptions"
        class="w-full"
      />

      <InputField
        v-model="formData.dateOfBirth"
        label="Date of Birth"
        placeholder="DD/MM/YYYY"
        type="date"
        class="w-full"
      />

      <SelectField
        v-model="formData.idType"
        label="ID Type"
        placeholder="Select ID type"
        :options="idTypeOptions"
        class="w-full"
      />

      <InputField
        v-model="formData.idNumber"
        label="ID Number"
        placeholder="Enter ID number"
        class="w-full"
      />
    </div>
  </Modal>
</template>

<script setup>
import { ref, reactive, defineProps, defineEmits, inject, watch } from 'vue'
import Modal from '@/components/Modal.vue'
import InputField from '@/components/InputField.vue'
import SelectField from '@/components/SelectField.vue'
import { useCrmStore } from '@/stores/crm.js'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  crm: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:show', 'crm-updated'])

// Store and services
const store = useCrmStore()
const messageApi = inject('messageApi')

// Form data and state
const loading = ref(false)
const formData = reactive({
  id: '',
  otherNames: '',
  surname: '',
  gender: '',
  dateOfBirth: '',
  idType: '',
  idNumber: ''
})

// Validation errors
const errors = reactive({
  otherNames: '',
  surname: '',
  gender: '',
  dateOfBirth: '',
  idType: '',
  idNumber: ''
})

// Options for select fields
const genderOptions = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' }
]

const idTypeOptions = [
  { value: 'Passport', label: 'Passport' },
  { value: 'National ID', label: 'National ID' },
  { value: 'Driver\'s License', label: 'Driver\'s License' },
  { value: 'Other', label: 'Other' }
]

// Watch for changes to props.crm and update form data
watch(() => props.crm, (newCrm) => {
  if (newCrm) {
    Object.keys(formData).forEach(key => {
      if (newCrm[key] !== undefined) {
        formData[key] = newCrm[key]
      }
    })
  }
}, { immediate: true, deep: true })

// Form validation
const validateForm = () => {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })

  // Validate required fields
  if (!formData.otherNames) {
    errors.otherNames = 'Other Name(s) is required'
    isValid = false
  }
  
  if (!formData.surname) {
    errors.surname = 'Surname is required'
    isValid = false
  }
  
  if (!formData.gender) {
    errors.gender = 'Gender is required'
    isValid = false
  }
  
  if (!formData.dateOfBirth) {
    errors.dateOfBirth = 'Date of Birth is required'
    isValid = false
  }
  
  if (!formData.idType) {
    errors.idType = 'ID Type is required'
    isValid = false
  }
  
  if (!formData.idNumber) {
    errors.idNumber = 'ID Number is required'
    isValid = false
  }
  
  return isValid
}

// Form submission
const handleSubmit = async () => {
  if (!validateForm()) return
  
  try {
    loading.value = true
    
    // Update CRM
    await store.updateCrm(formData)
    
    messageApi.success('CRM updated successfully')
    emit('crm-updated')
    emit('update:show', false)
  } catch (error) {
    console.error(error)
    messageApi.error(error?.response?.data?.info ?? 'Error updating CRM')
  } finally {
    loading.value = false
  }
}
</script>
