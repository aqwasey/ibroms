<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="Add Account"
    variant="edit"
    :loading="bankAccountsStore.saving"
    showActions
    @confirm="handleSubmit"
    confirmButtonText="Save"
  >
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
        <!-- Bank Name Field -->
        <SelectField
          v-model="formState.bank_name"
          label="Bank name"
          placeholder="Select your bank"
          id="bank_name"
          :options="bankOptions"
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
import { ref, reactive, inject } from 'vue'
import { useBankAccountsStore } from '@/stores/bank-accounts.js'
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

const emit = defineEmits(['update:show', 'account-created'])

const bankAccountsStore = useBankAccountsStore()
const messageApi = inject('messageApi')

// Reset form when modal is opened
const resetForm = () => {
  Object.keys(formState).forEach(key => formState[key] = '')
  Object.keys(errors).forEach(key => errors[key] = '')
}

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
const bankOptions = [
  { label: 'ABSA Bank', value: 'ABSA Bank' },
  { label: 'Standard Bank', value: 'Standard Bank' },
  { label: 'FirstRand Bank (FNB)', value: 'FirstRand Bank (FNB)' },
  { label: 'Nedbank', value: 'Nedbank' },
  { label: 'Capitec Bank', value: 'Capitec Bank' },
  { label: 'African Bank', value: 'African Bank' },
  { label: 'Investec Bank', value: 'Investec Bank' },
  { label: 'Discovery Bank', value: 'Discovery Bank' },
  { label: 'TymeBank', value: 'TymeBank' },
  { label: 'Bidvest Bank', value: 'Bidvest Bank' },
  { label: 'Sasfin Bank', value: 'Sasfin Bank' },
  { label: 'Access Bank South Africa', value: 'Access Bank South Africa' },
  { label: 'Albaraka Bank', value: 'Albaraka Bank' },
  { label: 'Habib Bank', value: 'Habib Bank' },
  { label: 'UBank', value: 'UBank' },
  { label: 'Other', value: 'Other' }
]

const accountTypeOptions = [
  { label: 'Stokvel', value: 'Stokvel' },
  { label: 'Savings', value: 'Savings' },
  { label: 'Current', value: 'Current' },
  { label: 'Transmission', value: 'Transmission' },
  { label: 'Other', value: 'Other' }
]

const purposeOptions = [
  { label: 'Premium', value: 'Premium' },
  { label: 'Purpose', value: 'Purpose' },
  { label: 'Claims Payout', value: 'Claims Payout' },
  { label: 'Other', value: 'Other' }
]

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

    // Save to store
    const newAccount = await bankAccountsStore.createBankAccount({
      ...formState,
      reference: formState.bank_name.substring(0, 8) + '-' + formState.account_no.substring(0, 4), // Generate simple reference from bank name and account
      company_id: user.company_id
    })

    messageApi.success('Account created successfully!')
    emit('account-created', newAccount)
    emit('update:show', false)
    resetForm()
  } catch (error) {
    console.error(error)
    messageApi.error(error?.message || 'Failed to create account')
  }
}
</script>
