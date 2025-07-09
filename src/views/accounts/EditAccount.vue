<template>
  <Modal
    :show="true"
    :close="() => navigateBack()"
    title="Edit Account"
    variant="edit"
    :loading="loading"
    showActions
    @confirm="handleSubmit"
    confirmButtonText="Save Changes"
  >
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
      <!-- Bank Name Field -->
      <InputField
        v-model="formState.bank_name"
        label="Bank name"
        placeholder="Enter your bank name"
        id="bank_name"
        :error="errors.bank_name"
      />
      
      <!-- Account Number Field -->
      <InputField
        v-model="formState.account_no"
        label="Account No"
        placeholder="Enter your account no"
        id="account_no"
        :error="errors.account_no"
      />
      
      <!-- Account Type Field -->
      <SelectField
        v-model="formState.account_type"
        label="Account Type"
        placeholder="Select account type"
        id="account_type"
        :options="accountTypeOptions"
        :error="errors.account_type"
      />
      
      <!-- Email Field -->
      <InputField
        v-model="formState.email"
        label="Email"
        placeholder="Enter your email"
        type="email"
        id="email"
        :error="errors.email"
      />
      
      <!-- Purpose Field -->
      <SelectField
        v-model="formState.purpose"
        label="Purpose"
        placeholder="Select your purpose"
        id="purpose"
        :options="purposeOptions"
        :error="errors.purpose"
      />
    </form>
  </Modal>
</template>

<script setup>
import { ref, reactive, inject, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBankAccountsStore } from '@/stores/bank-accounts.js'
import Modal from '@/components/Modal.vue'
import InputField from '@/components/InputField.vue'
import SelectField from '@/components/SelectField.vue'
import ButtonBase from '@/components/ButtonBase.vue'

const route = useRoute()
const router = useRouter()
const bankAccountsStore = useBankAccountsStore()
const messageApi = inject('messageApi')

// Account ID from route params
const accountId = route.params.id

// Form state
const formState = reactive({
  bank_name: '',
  account_no: '',
  account_type: '',
  email: '',
  purpose: ''
})

// Form errors
const errors = reactive({
  bank_name: '',
  account_no: '',
  account_type: '',
  email: '',
  purpose: ''
})

const loading = ref(false)
const accountLoaded = ref(false)

// Options for select fields
const accountTypeOptions = [
  { label: 'Savings', value: 'Savings' },
  { label: 'Checking', value: 'Checking' },
  { label: 'Business', value: 'Business' },
  { label: 'Trust', value: 'Trust' },
  { label: 'Credit', value: 'Credit' }
]

const purposeOptions = [
  { label: 'General Operations', value: 'General Operations' },
  { label: 'Payroll', value: 'Payroll' },
  { label: 'Expenses', value: 'Expenses' },
  { label: 'Investments', value: 'Investments' },
  { label: 'Emergency Fund', value: 'Emergency Fund' },
  { label: 'Claims Payment', value: 'Claims Payment' }
]

// Load account data when component mounts
onMounted(async () => {
  try {
    loading.value = true
    
    // DUMMY DATA - In a real application, you would fetch from API
    // For demo purposes, we'll look for the account in the store
    const account = bankAccountsStore.bankAccounts.find(acc => acc.id === accountId)
    
    if (account) {
      // Populate form state with account data
      Object.keys(formState).forEach(key => {
        if (account[key]) {
          formState[key] = account[key]
        }
      })
      accountLoaded.value = true
    } else {
      messageApi.error('Account not found')
      navigateBack()
    }
  } catch (error) {
    console.error(error)
    messageApi.error('Error loading account details')
  } finally {
    loading.value = false
  }
})

// Validate form
const validateForm = () => {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => errors[key] = '')
  
  // Bank name validation
  if (!formState.bank_name) {
    errors.bank_name = 'Bank name is required'
    isValid = false
  }
  
  // Account number validation
  if (!formState.account_no) {
    errors.account_no = 'Account number is required'
    isValid = false
  }
  
  // Account type validation
  if (!formState.account_type) {
    errors.account_type = 'Account type is required'
    isValid = false
  }
  
  // Email validation
  if (!formState.email) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/^\S+@\S+\.\S+$/.test(formState.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }
  
  // Purpose validation
  if (!formState.purpose) {
    errors.purpose = 'Purpose is required'
    isValid = false
  }
  
  return isValid
}

// Submit handler
const handleSubmit = async () => {
  if (!validateForm()) return
  
  try {
    loading.value = true
    
    // Update account in store/API
    await bankAccountsStore.updateBankAccount(accountId, {
      ...formState,
      id: accountId // Ensure the ID is included
    })
    
    messageApi.success('Account updated successfully!')
    navigateBack()
  } catch (error) {
    console.error(error)
    messageApi.error(error?.response?.data?.info ?? 'Something went wrong')
  } finally {
    loading.value = false
  }
}

// Navigation
const navigateBack = () => {
  router.push('/accounts')
}
</script>
