<template>
  <ViewModal
    :show="show"
    @update:show="$emit('update:show', $event)"
    title="Bank Account Details"
  >
    <template v-if="account">
      <div class="grid grid-cols-1 gap-4 mb-4 p-1">
        <div class="bg-blue-50 rounded-lg p-4 mb-2">
          <h3 class="font-medium text-lg text-blue-800 mb-2">{{ account.bank_name }}</h3>
          <p class="text-gray-600">{{ account.account_type }} Account</p>
          <p class="text-gray-600 font-mono mt-1">{{ formatAccountNumber(account.account_no) }}</p>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <ViewField label="Account Purpose" :value="account.purpose" />
          <ViewField label="Email" :value="account.email" />
          <ViewField label="Reference" :value="account.reference || 'N/A'" />
          <ViewField label="Last Updated" :value="formatDate(account.updated_on)" />
        </div>
      </div>
    </template>
  </ViewModal>
</template>

<script setup>
import ViewModal from '@/components/ViewModal.vue'
import ViewField from '@/components/ViewField.vue'

const props = defineProps({
  account: {
    type: Object,
    required: true
  },
  show: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close', 'update:show'])

/**
 * Format account number for better readability
 * Example: 123456789 -> **** **** 6789
 */
const formatAccountNumber = (accountNo) => {
  if (!accountNo) return 'N/A'
  
  // Show only last 4 digits and mask the rest
  if (accountNo.length > 4) {
    const lastFour = accountNo.slice(-4)
    const maskedPart = '*'.repeat(Math.min(accountNo.length - 4, 8))
    return `${maskedPart} ${lastFour}`
  }
  
  return accountNo
}

/**
 * Format date string to a more readable format
 */
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  } catch (error) {
    console.error('Error formatting date:', error)
    return dateString
  }
}
</script>


