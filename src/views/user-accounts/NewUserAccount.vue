<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="Add User"
    variant="edit"
    :loading="loading"
    showActions
    @confirm="handleSubmit"
    confirmButtonText="Save"
  >
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-4 w-full">
      <!-- Full Name Field -->
      <InputField
        id="fullName"
        v-model="formState.fullName"
        label="Full Name"
        placeholder="Enter your full name"
        :error="errors.fullName"
      />

      <!-- Email Field -->
      <InputField
        id="email"
        v-model="formState.email"
        label="Email"
        placeholder="Enter your email"
        type="email"
        :error="errors.email"
      />

      <!-- Service Provider Field -->
      <SelectField
        id="serviceProvider"
        v-model="formState.serviceProvider"
        label="Service Provider"
        placeholder="Select account type"
        :options="serviceProviderOptions"
        :error="errors.serviceProvider"
      />

      <!-- Access Level Field -->
      <InputField
        id="accessLevel"
        v-model="formState.accessLevel"
        label="Access Level"
        placeholder="Enter level"
        :error="errors.accessLevel"
      />

      <!-- Permissions Field -->
      <SelectField
        id="permissions"
        v-model="formState.permissions"
        label="Permissions"
        placeholder="Select your purpose"
        :options="permissionsOptions"
        :error="errors.permissions"
      />
    </form>
  </Modal>
</template>

<script setup>
import { ref, reactive, inject } from 'vue'
import { useUserAccountStore } from '@/stores/userAccounts.js'
import Modal from '@/components/Modal.vue'
import InputField from '@/components/InputField.vue'
import SelectField from '@/components/SelectField.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:show', 'user-created'])

const userAccountStore = useUserAccountStore()
const messageApi = inject('messageApi')

// Reset form when modal is opened
const resetForm = () => {
  Object.keys(formState).forEach(key => formState[key] = '')
  Object.keys(errors).forEach(key => errors[key] = '')
}

// Form state
const formState = reactive({
  fullName: '',
  email: '',
  serviceProvider: '',
  accessLevel: '',
  permissions: ''
})

// Form errors
const errors = reactive({
  fullName: '',
  email: '',
  serviceProvider: '',
  accessLevel: '',
  permissions: ''
})

const loading = ref(false)

// Options for select fields
const serviceProviderOptions = [
  { label: 'Google', value: 'Google' },
  { label: 'Microsoft', value: 'Microsoft' },
  { label: 'Apple', value: 'Apple' }
]

const permissionsOptions = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' }
]

// Validate form
const validateForm = () => {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => errors[key] = '')
  
  // Full Name validation
  if (!formState.fullName) {
    errors.fullName = 'Full Name is required'
    isValid = false
  }
  
  // Email validation
  if (!formState.email) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
    errors.email = 'Please enter a valid email'
    isValid = false
  }
  
  // Service Provider validation
  if (!formState.serviceProvider) {
    errors.serviceProvider = 'Service Provider is required'
    isValid = false
  }
  
  // Access Level validation
  if (!formState.accessLevel) {
    errors.accessLevel = 'Access Level is required'
    isValid = false
  }
  
  // Permissions validation
  if (!formState.permissions) {
    errors.permissions = 'Permissions is required'
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
    const newUser = await userAccountStore.createUser({
      ...formState,
      id: Date.now().toString() // For demo purposes only, would be set by the server in production
    })
    
    emit('user-created', newUser)
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

<style scoped>
/* Using Tailwind classes instead of scoped CSS for form */
</style>
