<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="Add Personnel"
    variant="edit"
    :loading="loading"
    showActions
    @confirm="handleSubmit"
    confirmButtonText="Save"
  >
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
        <!-- Other Names Field -->
        <InputField
          v-model="formState.otherNames"
          label="Other Name(s)"
          placeholder="Enter other names"
          id="otherNames"
          :error="errors.otherNames"
        />
        
        <!-- Surname Field -->
        <InputField
          v-model="formState.surname"
          label="Surname"
          placeholder="Enter surname"
          id="surname"
          :error="errors.surname"
        />
        
        <!-- Gender Field -->
        <SelectField
          v-model="formState.gender"
          label="Gender"
          placeholder="Select gender"
          id="gender"
          :options="genderOptions"
          :error="errors.gender"
        />
        
        <!-- Date of Birth Field -->
        <InputField
          v-model="formState.dateOfBirth"
          label="Date of Birth"
          placeholder="DD/MM/YYYY"
          id="dateOfBirth"
          :error="errors.dateOfBirth"
        />
        
        <!-- ID Type Field -->
        <SelectField
          v-model="formState.idType"
          label="ID Type"
          placeholder="Select id"
          id="idType"
          :options="idTypeOptions"
          :error="errors.idType"
        />
        
        <!-- ID Number Field -->
        <InputField
          v-model="formState.idNumber"
          label="ID Number"
          placeholder="Enter id number"
          id="idNumber"
          :error="errors.idNumber"
        />
      </form>
  </Modal>
</template>

<script setup>
import { ref, reactive, inject } from 'vue'
import { usePersonnelStore } from '@/stores/personnels.js'
import Modal from '@/components/Modal.vue'
import InputField from '@/components/InputField.vue'
import SelectField from '@/components/SelectField.vue'
import ButtonBase from '@/components/ButtonBase.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:show', 'person-created'])

const personnelStore = usePersonnelStore()
const messageApi = inject('messageApi')

// Reset form when modal is opened
const resetForm = () => {
  Object.keys(formState).forEach(key => formState[key] = '')
  Object.keys(errors).forEach(key => errors[key] = '')
}

// Form state
const formState = reactive({
  otherNames: '',
  surname: '',
  gender: '',
  dateOfBirth: '',
  idType: '',
  idNumber: ''
})

// Form errors
const errors = reactive({
  otherNames: '',
  surname: '',
  gender: '',
  dateOfBirth: '',
  idType: '',
  idNumber: ''
})

const loading = ref(false)

// Options for select fields
const genderOptions = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Other', value: 'Other' }
]

const idTypeOptions = [
  { label: 'Passport', value: 'Passport' },
  { label: 'National ID', value: 'National ID' },
  { label: 'Driver License', value: 'Driver License' },
  { label: 'Voter ID', value: 'Voter ID' }
]

// Validate form
const validateForm = () => {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => errors[key] = '')
  
  // Surname validation
  if (!formState.surname) {
    errors.surname = 'Surname is required'
    isValid = false
  }
  
  // Other Names validation
  if (!formState.otherNames) {
    errors.otherNames = 'Other Name(s) is required'
    isValid = false
  }
  
  // Gender validation
  if (!formState.gender) {
    errors.gender = 'Gender is required'
    isValid = false
  }
  
  // Date of Birth validation
  if (!formState.dateOfBirth) {
    errors.dateOfBirth = 'Date of Birth is required'
    isValid = false
  } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(formState.dateOfBirth)) {
    errors.dateOfBirth = 'Please enter a valid date in DD/MM/YYYY format'
    isValid = false
  }
  
  // ID Type validation
  if (!formState.idType) {
    errors.idType = 'ID Type is required'
    isValid = false
  }
  
  // ID Number validation
  if (!formState.idNumber) {
    errors.idNumber = 'ID Number is required'
    isValid = false
  }
  
  return isValid
}

// Submit handler
const handleSubmit = async () => {
  if (!validateForm()) return
  
  try {
    loading.value = true
    
    // Save to store
    const newPerson = await personnelStore.createPerson({
      ...formState,
      id: Date.now().toString() // For demo purposes only, would be set by the server in group schemeion
    })
    
    emit('person-created', newPerson)
    emit('update:show', false)
    resetForm()
  } catch (error) {
    console.error(error)
    messageApi.error(error?.response?.data?.info ?? 'Something went wrong')
  } finally {
    loading.value = false
  }
}
</script>