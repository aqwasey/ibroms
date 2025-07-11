<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="Edit User"
    variant="edit"
    :loading="loading"
    showActions
    @confirm="handleSubmit"
    confirmButtonText="Save Changes"
  >
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-4 w-full">
      <!-- Full Name Field -->
      <InputField
        id="fullName"
        v-model="formState.fullName"
        label="Full Name"
        :error="errors.fullName"
      />

      <!-- Email Field -->
      <InputField
        id="email"
        v-model="formState.email"
        label="Email"
        placeholder="xyz@gmail.com"
        type="email"
        :error="errors.email"
      />

      <!-- Service Provider Field -->
      <SelectField
        id="serviceProvider"
        v-model="formState.serviceProvider"
        label="Service Provider"
        :options="serviceProviderOptions"
        :error="errors.serviceProvider"
      />

      <!-- Access Level Field -->
      <InputField
        id="accessLevel"
        v-model="formState.accessLevel"
        label="Access Level"
        :error="errors.accessLevel"
      />

      <!-- Permissions Field -->
      <SelectField
        id="permissions"
        v-model="formState.permissions"
        label="Permissions"
        :options="permissionsOptions"
        :error="errors.permissions"
      />
    </form>
  </Modal>
</template>

<script setup>
import { ref, reactive, inject, watch } from 'vue'
import { useUserAccountStore } from '@/stores/userAccounts.js'
import Modal from '@/components/Modal.vue'
import InputField from '@/components/InputField.vue'
import SelectField from '@/components/SelectField.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  user: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:show', 'user-updated'])

const userAccountStore = useUserAccountStore()
const messageApi = inject('messageApi')

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

// Load user data when user prop changes
watch(() => props.user, (newUser) => {
  if (newUser && Object.keys(newUser).length > 0) {
    // Populate form state with user data
    Object.keys(formState).forEach(key => {
      if (newUser[key]) {
        formState[key] = newUser[key]
      }
    })
  }
}, { immediate: true })

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
    
    // Update user in store/API
    const updatedUser = await userAccountStore.updateUser(props.user.id, {
      ...formState,
      id: props.user.id // Ensure the ID is included
    })
    
    messageApi.success('User account updated successfully!')
    emit('user-updated', updatedUser)
    emit('update:show', false)
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
