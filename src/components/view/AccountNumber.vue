<template>
  <div class="account-number-container">
    <div class="account-number-display">
      <span class="account-number" :class="{ 'font-mono': true }">
        {{ displayNumber }}
      </span>
      <button
        @click="toggleVisibility"
        class="toggle-button"
        :title="isVisible ? 'Hide account number' : 'Show account number'"
      >
        <svg v-if="isVisible" class="eye-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
        </svg>
        <svg v-else class="eye-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  accountNumber: {
    type: String,
    required: true
  },
  maskLength: {
    type: Number,
    default: 4 // Show last 4 digits by default
  },
  initiallyVisible: {
    type: Boolean,
    default: false
  }
})

const isVisible = ref(props.initiallyVisible)

const displayNumber = computed(() => {
  if (!props.accountNumber) return 'N/A'
  
  if (isVisible.value) {
    return formatAccountNumber(props.accountNumber)
  } else {
    return maskAccountNumber(props.accountNumber, props.maskLength)
  }
})

const toggleVisibility = () => {
  isVisible.value = !isVisible.value
}

// Format account number for better readability (with spaces)
const formatAccountNumber = (accountNo) => {
  if (!accountNo) return 'N/A'
  
  // Add spaces every 4 digits for readability
  return accountNo.replace(/(\d{4})(?=\d)/g, '$1 ')
}

// Mask account number showing only last few digits
const maskAccountNumber = (accountNo, showLast = 4) => {
  if (!accountNo) return 'N/A'
  
  if (accountNo.length <= showLast) {
    return accountNo
  }
  
  const visiblePart = accountNo.slice(-showLast)
  const maskedLength = accountNo.length - showLast
  const maskedPart = '*'.repeat(Math.min(maskedLength, 8)) // Limit mask length for UI
  
  return `${maskedPart} ${visiblePart}`
}
</script>

<style scoped>
.account-number-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.account-number-display {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  background-color: #F7F8FA;
  border: 1px solid #E0E0E0;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.account-number-display:hover {
  border-color: #CF7F08;
  box-shadow: 0 2px 4px rgba(207, 127, 8, 0.1);
}

.account-number {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
  font-weight: 600;
  color: #222222;
  letter-spacing: 0.05em;
}

.toggle-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  background: none;
  border: none;
  color: #757575;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
}

.toggle-button:hover {
  color: #CF7F08;
  background-color: rgba(207, 127, 8, 0.1);
}

.toggle-button:focus {
  outline: none;
  ring: 2px solid #CF7F08;
  ring-opacity: 0.3;
}

.eye-icon {
  width: 1.25rem;
  height: 1.25rem;
}
</style>
