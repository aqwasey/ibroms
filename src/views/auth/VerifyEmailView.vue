<template>
  <AuthLayout title="Verify Your Email to Continue">
    <!-- Page title and supporting text -->
    <template #page-title>Verify Email</template>
    <template #supporting-text>Please enter the code sent to your email</template>

    <!-- Form content -->
    <template #form-content>
      <div class="otp-container">
        <input
          v-for="(digit, index) in otpDigits"
          :key="index"
          v-model="otpDigits[index]"
          class="otp-input"
          type="text"
          maxlength="1"
          @input="focusNext(index)"
          @keydown.delete="focusPrev(index)"
          @keydown="handleKeyDown($event, index)"
          ref="otpInputs"
        />
      </div>

      <div class="resend-container">
        <div class="checkbox-label">
          Didn't receive code?
          <span v-if="remainingTime" class="otp-timer">({{ remainingTime }})</span>
        </div>
        <button 
          class="link-button checkbox-label" 
          @click="resendCode"
          :disabled="isResending || !canResend"
        >
          <template v-if="isResending">Sending...</template>
          <template v-else-if="!canResend">Wait</template>
          <template v-else>Resend</template>
        </button>
      </div>
    </template>

    <!-- Action buttons -->
    <template #actions>
      <ButtonBase
        :label="isSubmitting ? 'Verifying...' : 'Verify Email'"
        variant="primary"
        @click="verifyEmail"
        class="w-full"
        :disabled="isSubmitting"
        :loading="isSubmitting"
      />
    </template>

    <!-- Footer links -->
    <template #footer-links>
      <button class="link-button-secondary" @click="goToLogin">
        <span class="arrow-left">←</span> Back to log in
      </button>
    </template>
  </AuthLayout>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import AuthLayout from '@/components/auth/AuthLayout.vue';
import ButtonBase from '@/components/ButtonBase.vue';
import api from '@/services/api';
import authService from '@/services/authService';
import notificationService from '@/services/notificationService';

const router = useRouter();
const otpDigits = ref(['', '', '', '', '']); // Changed from 6 to 5 digits
const otpInputs = ref([]);
const isSubmitting = ref(false);
const isResending = ref(false);
const otpExpiry = ref(null); // To store OTP expiry timestamp
const remainingTime = ref(''); // Formatted time remaining for display
const canResend = ref(false); // Controls whether resend button is enabled
const timerInterval = ref(null); // To store the interval reference

// Get the email from localStorage (saved during registration)
const userEmail = computed(() => {
  return localStorage.getItem('registrationEmail') || '';
});

// Function to update the timer display and resend button state
const updateTimer = () => {
  if (!otpExpiry.value) {
    remainingTime.value = '';
    canResend.value = true;
    return;
  }
  
  const now = new Date();
  const expiryDate = new Date(otpExpiry.value);
  const timeDiff = expiryDate - now;
  
  if (timeDiff <= 0) {
    // OTP has expired
    remainingTime.value = '';
    canResend.value = true;
    
    // Clear the interval as we don't need to update anymore
    if (timerInterval.value) {
      clearInterval(timerInterval.value);
      timerInterval.value = null;
    }
    return;
  }
  
  // OTP still valid, calculate remaining time
  const minutes = Math.floor(timeDiff / 60000);
  const seconds = Math.floor((timeDiff % 60000) / 1000);
  remainingTime.value = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  canResend.value = false;
};

onMounted(() => {
  // Focus the first OTP input when component mounts
  if (otpInputs.value[0]) {
    otpInputs.value[0].focus();
  }
  
  // Check if we have an email to verify
  if (!userEmail.value) {
    notificationService.error('No email found to verify. Please register first.');
    router.push('/register');
  }
  
  // Check if we have a stored expiry time in localStorage
  const storedExpiry = localStorage.getItem('otpExpiry');
  if (storedExpiry) {
    otpExpiry.value = storedExpiry;
    updateTimer();
    
    // Set up timer to update every second
    timerInterval.value = setInterval(updateTimer, 1000);
  } else {
    // No stored expiry time, enable resend immediately
    canResend.value = true;
  }
});

onBeforeUnmount(() => {
  // Clean up the interval when component is unmounted
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
    timerInterval.value = null;
  }
});

const focusNext = (index) => {
  // After input, move to next input box
  if (index < otpDigits.value.length - 1 && otpDigits.value[index]) {
    otpInputs.value[index + 1].focus();
  }
};

const focusPrev = (index) => {
  // On backspace/delete, move to previous input box
  if (index > 0 && !otpDigits.value[index]) {
    otpInputs.value[index - 1].focus();
  }
};

const handleKeyDown = (event, index) => {
  // Only allow numeric inputs
  if (!/^\d$/.test(event.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
    event.preventDefault();
  }
};

const verifyEmail = async () => {
  // Join OTP digits to form the complete code
  const otp = otpDigits.value.join('');
  
  // Validate OTP format (should be 5 digits)
  if (otp.length !== 5 || !/^\d+$/.test(otp)) {
    notificationService.error('Please enter a valid 5-digit verification code');
    return;
  }
  
  isSubmitting.value = true;
  
  try {
    // Call the verify-otp API endpoint (POST method with JSON body)
    const response = await api.post('/auth/verify-otp', {
      email: userEmail.value,
      otp: otp
    });
    
    console.log('OTP verification response:', response);
    
    if (response && response.status === 1) {
      notificationService.success('Email verified successfully!');
      router.push('/verification-success');
    } else {
      notificationService.error(response?.info || 'Verification failed. Please check your OTP code.');
    }
  } catch (error) {
    console.error('OTP verification error:', error);
    
    // Handle validation errors (422 responses)
    if (error?.detail && Array.isArray(error.detail)) {
      // Extract and display specific validation errors
      const errorMessages = error.detail.map(item => item.msg || 'Validation error').join(', ');
      notificationService.error(errorMessages || 'Invalid verification code');
    } else if (error?.detail) {
      notificationService.error(typeof error.detail === 'string' ? error.detail : 'Verification failed');
    } else {
      notificationService.error('Failed to verify email. Please try again.');
    }
  } finally {
    isSubmitting.value = false;
  }
};

const resendCode = async () => {
  if (isResending.value || !canResend.value) return;
  
  isResending.value = true;
  
  try {
    // Call the refresh-otp API endpoint (POST with query parameter)
    const response = await api.post(`/auth/refresh-otp?email=${encodeURIComponent(userEmail.value)}`);
    
    console.log('Resend OTP response:', response);
    
    // Check if response contains OTP and expiry (success case)
    if (response && response.otp) {
      notificationService.success('New verification code sent to your email');
      
      // Clear the current OTP fields (5 digits)
      otpDigits.value = ['', '', '', '', ''];
      if (otpInputs.value[0]) {
        otpInputs.value[0].focus();
      }
      
      // Store expiry time and update timer
      if (response.otp_expiry) {
        otpExpiry.value = response.otp_expiry;
        localStorage.setItem('otpExpiry', response.otp_expiry);
        
        // Reset timer if needed
        if (timerInterval.value) {
          clearInterval(timerInterval.value);
        }
        
        // Update timer immediately and start interval
        updateTimer();
        timerInterval.value = setInterval(updateTimer, 1000);
      }
    } else {
      notificationService.error(response?.info || 'Failed to send new verification code');
    }
  } catch (error) {
    console.error('Resend OTP error:', error);
    
    // Handle validation errors (422 responses)
    if (error?.detail && Array.isArray(error.detail)) {
      // Extract and display specific validation errors
      const errorMessages = error.detail.map(item => item.msg || 'Validation error').join(', ');
      notificationService.error(errorMessages || 'Failed to send verification code');
    } else if (error?.detail) {
      notificationService.error(typeof error.detail === 'string' ? error.detail : 'Failed to send verification code');
    } else {
      notificationService.error('Failed to send new verification code. Please try again.');
    }
  } finally {
    isResending.value = false;
  }
};

const goToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
/* OTP input specific styles */
.otp-container {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}

.otp-input {
  width: 48px;
  height: 48px;
  border: 1px solid #D0D5DD;
  border-radius: 8px;
  background-color: white;
  font-size: 20px;
  font-weight: 500;
  text-align: center;
  color: #334054;
  box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
}

.otp-input:focus {
  border-color: #CF7F07;
  outline: none;
  box-shadow: 0px 0px 0px 4px rgba(207, 127, 7, 0.1);
}

.resend-container {
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: center;
  margin-top: 12px;
}

/* OTP timer styling */
.otp-timer {
  font-size: 0.875rem;
  color: #667085;
  margin-left: 4px;
  font-weight: 500;
}

.checkbox-label {
  color: #344053;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
}
</style>
