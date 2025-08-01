<template>
  <AuthLayout title="Welcome to Your Agent Dashboard!">
    <!-- Custom icon and title section -->
    <template #page-title>
      <div class="success-icon">
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M28 0C12.5607 0 0 12.5607 0 28C0 43.4393 12.5607 56 28 56C43.4393 56 56 43.4393 56 28C56 12.5607 43.4393 0 28 0ZM28 51.3333C15.1273 51.3333 4.66667 40.8727 4.66667 28C4.66667 15.1273 15.1273 4.66667 28 4.66667C40.8727 4.66667 51.3333 15.1273 51.3333 28C51.3333 40.8727 40.8727 51.3333 28 51.3333Z" fill="#12B76A"/>
          <path d="M39.0814 19.8339L24.2667 34.6486L16.9209 27.3028C15.8923 26.2742 14.1857 26.2742 13.1571 27.3028C12.1285 28.3314 12.1285 30.038 13.1571 31.0666L22.3848 40.2943C22.8991 40.8086 23.5819 41.0667 24.2657 41.0667C24.9495 41.0667 25.6324 40.8086 26.1467 40.2943L42.8453 23.5957C43.8739 22.5671 43.8739 20.8605 42.8453 19.8319C41.8167 18.8033 40.1111 18.8044 39.0814 19.8339Z" fill="#12B76A"/>
        </svg>
      </div>
      <div class="title">Email verified!</div>
    </template>

    <!-- Supporting text -->
    <template #supporting-text>
      Your account has been successfully created
    </template>

    <!-- Action buttons -->
    <template #actions>
      <ButtonBase
        label="Continue to Login"
        variant="primary"
        @click="goToLogin"
        class="w-full"
      />
    </template>
  </AuthLayout>
</template>

<script setup>
import { useRouter } from 'vue-router';
import AuthLayout from '@/components/auth/AuthLayout.vue';
import ButtonBase from '@/components/ButtonBase.vue';
import notificationService from '@/services/notificationService';

const router = useRouter();

const goToLogin = () => {
  // After verification is complete, user needs to log in
  localStorage.removeItem('registrationEmail'); // Clean up stored email
  notificationService.success('Your account has been verified. Please log in.');
  router.push('/login');
};
</script>

<style scoped>
/* Success icon specific styles */
.success-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 56px;
  height: 56px;
  margin-bottom: 16px;
}

.checkbox-label {
  color: #344053;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
}
</style>
