<template>
  <AuthLayout title="Explore What We Have To Offer!">
    <!-- Page title and supporting text -->
    <template #page-title>Forgot Password</template>
    <template #supporting-text>We will send you reset instructions</template>

    <!-- Form content -->
    <template #form-content>
      <InputField
        v-model="email"
        label="Email"
        placeholder="Enter your email"
      />
    </template>

    <!-- Action buttons -->
    <template #actions>
      <ButtonBase
        label="Send Reset Instructions"
        variant="primary"
        @click="sendResetInstructions"
        class="w-full"
      />
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthLayout from '@/components/auth/AuthLayout.vue';
import InputField from '@/components/InputField.vue';
import ButtonBase from '@/components/ButtonBase.vue';

const router = useRouter();
const email = ref('');

const sendResetInstructions = () => {
  console.log('Sending reset instructions to:', email.value);
  // For demo purposes, navigate to password sent confirmation page
  router.push('/password-sent');
};

const goToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.checkbox-label {
  color: #344053;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
}
</style>
