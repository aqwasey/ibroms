<template>
  <AuthLayout title="Register Your Business Today and Explore!">
    <!-- Page title and supporting text -->
    <template #page-title>Create Account</template>
    <template #supporting-text>Please enter your details.</template>

    <!-- Form content -->
    <template #form-content>
      <InputField
        v-model="organizationName"
        label="Organization Name"
        placeholder="Enter your organization name"
      />
      <InputField
        v-model="email"
        label="Email"
        placeholder="Enter your email"
      />
      <InputField
        v-model="password"
        label="Password"
        placeholder="••••••••"
        type="password"
      />
      <InputField
        v-model="confirmPassword"
        label="Confirm Password"
        placeholder="••••••••"
        type="password"
      />
    </template>

    <!-- Action buttons -->
    <template #actions>
      <ButtonBase
        label="Create Account"
        variant="primary"
        @click="register"
        class="w-full"
      />
    </template>

    <!-- Footer links -->
    <template #footer-links>
      <div class="text-small checkbox-label">Already have an account?</div>
      <button class="link-button checkbox-label" @click="goToLogin">Log in</button>
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
const organizationName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

const register = () => {
  // Validate passwords match
  if (password.value !== confirmPassword.value) {
    alert('Passwords do not match');
    return;
  }

  console.log('Registering with:', {
    organizationName: organizationName.value,
    email: email.value,
    password: password.value,
  });

  // For demo purposes, navigate to verification page
  router.push('/verify-email');
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
