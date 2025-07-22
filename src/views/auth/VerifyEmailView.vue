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
        <div class="checkbox-label">Didn't receive code?</div>
        <button class="link-button checkbox-label" @click="resendCode">Resend</button>
      </div>
    </template>

    <!-- Action buttons -->
    <template #actions>
      <ButtonBase
        label="Verify Email"
        variant="primary"
        @click="verifyEmail"
        class="w-full"
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AuthLayout from '@/components/auth/AuthLayout.vue';
import ButtonBase from '@/components/ButtonBase.vue';

const router = useRouter();
const otpDigits = ref(['', '', '', '', '', '']);
const otpInputs = ref([]);

onMounted(() => {
  // Focus the first OTP input when component mounts
  if (otpInputs.value[0]) {
    otpInputs.value[0].focus();
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

const verifyEmail = () => {
  const otp = otpDigits.value.join('');
  console.log('Verifying email with OTP:', otp);

  // For demo purposes, check if OTP is "123456"
  if (otp === "123456") {
    router.push('/verification-success');
  } else {
    alert('Invalid OTP. For demo purposes, use "123456"');
  }
};

const resendCode = () => {
  console.log('Resending verification code...');
  alert('New verification code sent! (This is a demo)');
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

.checkbox-label {
  color: #344053;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
}
</style>
