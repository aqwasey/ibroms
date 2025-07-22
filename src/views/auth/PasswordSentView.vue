<template>
  <AuthLayout title="Check Your Email For Reset Instructions">
    <!-- Custom icon and title section -->
    <template #page-title>
      <div class="email-icon">
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M46.6667 9.33325H9.33333C6.75583 9.33325 4.66667 11.4224 4.66667 13.9999V41.9999C4.66667 44.5774 6.75583 46.6666 9.33333 46.6666H46.6667C49.2442 46.6666 51.3333 44.5774 51.3333 41.9999V13.9999C51.3333 11.4224 49.2442 9.33325 46.6667 9.33325Z" stroke="#0BA5EC" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M4.66667 14L28 30.3333L51.3333 14" stroke="#0BA5EC" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="title">Check your email</div>
    </template>

    <!-- Supporting text -->
    <template #supporting-text>
      We've sent password reset instructions to your email address
    </template>

    <!-- Action buttons -->
    <template #actions>
      <ButtonBase
        label="Open email app"
        variant="primary"
        @click="openEmailApp"
        class="w-full"
      />

      <div class="resend-container">
        <div class="text-small">Didn't receive the email?</div>
        <button class="link-button" @click="resendEmail">Click to resend</button>
      </div>
    </template>

    <!-- Footer links -->
    <template #footer-links>
      <button class="link-button checkbox-label" @click="goToLogin">
        <span class="arrow-left checkbox-label">←</span> Back to log in
      </button>
    </template>
  </AuthLayout>
</template>

<script setup>
import { useRouter } from 'vue-router';
import AuthLayout from '@/components/auth/AuthLayout.vue';
import ButtonBase from '@/components/ButtonBase.vue';

const router = useRouter();

const openEmailApp = () => {
  // In a real app, this could open the default email app or show more instructions
  alert('This would open the email app. For demo purposes, we\'ll redirect you to login.');
  router.push('/login');
};

const resendEmail = () => {
  console.log('Resending password reset email...');
  alert('Password reset email resent! (This is a demo)');
};

const goToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
/* Email icon specific styles */
.email-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 56px;
  height: 56px;
  margin-bottom: 16px;
}

/* Resend container specific styles */
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

/* No need for duplicated button and text styles as they're now in AuthLayout */
</style>
