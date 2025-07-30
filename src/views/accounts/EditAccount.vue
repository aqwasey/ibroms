<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="Edit Account"
    variant="edit"
    :loading="bankAccountsStore.saving"
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
import { ref, reactive, inject, watch } from 'vue'
import { useBankAccountsStore } from '@/stores/bank-accounts.js'
import Modal from '@/components/Modal.vue'
import InputField from '@/components/InputField.vue'
import SelectField from '@/components/SelectField.vue'
import ButtonBase from '@/components/ButtonBase.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  account: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:show', 'account-updated'])

const bankAccountsStore = useBankAccountsStore()
const messageApi = inject('messageApi')

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

// Using saving state from the store instead of local loading state

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

// Load account data when account prop changes
watch(() => props.account, (newAccount) => {
  if (newAccount && Object.keys(newAccount).length > 0) {
    // Populate form state with account data
    Object.keys(formState).forEach(key => {
      if (newAccount[key]) {
        formState[key] = newAccount[key]
      }
    })
  }
}, { immediate: true })

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
    // Get company_id from localStorage where user info is stored
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user?.company_id) {
      messageApi.error('User company information not found')
      return
    }
    
    // Create a clean object with only the fields the API needs
    const updateData = {
      bank_name: formState.bank_name,
      account_no: formState.account_no,
      account_type: formState.account_type,
      email: formState.email,
      purpose: formState.purpose,
      company_id: user.company_id,
      reference: props.account.reference || (formState.bank_name.substring(0, 8) + '-' + formState.account_no.substring(0, 4))
    }
    
    // Update account in store/API
    const updatedAccount = await bankAccountsStore.updateBankAccount(props.account.id, updateData)
    
    messageApi.success('Account updated successfully!')
    emit('account-updated', updatedAccount)
    emit('update:show', false)
  } catch (error) {
    console.error(error)
    messageApi.error(error?.message || 'Failed to update account')
  }
}
</script>
