<template>
  <AuthLayout title="Sign in to explore what we have to offer!">
    <!-- Page title and supporting text -->
    <template #page-title>Log in</template>
    <template #supporting-text>Please enter your details.</template>

    <!-- Form content -->
    <template #form-content>
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

      <!-- Remember me and forgot password row -->
      <div class="row">
        <div class="checkbox-container">
          <Checkbox v-model="rememberMe" />
          <div class="checkbox-label">Remember me</div>
          <br>
        </div>
        <button class="link-button checkbox-label" @click="goToForgotPassword">Forgot password</button>
      </div>
    </template>

    <!-- Action buttons -->
    <template #actions>
      <ButtonBase
        label="Sign in"
        variant="primary"
        @click="login"
        class="w-full"
      />
    </template>

    <!-- Footer links -->
    <template #footer-links>
      <div class="text-small checkbox-label">Don't have an account?</div>
      <button class="link-button checkbox-label" @click="goToRegister">Sign up</button>
    </template>
  </AuthLayout>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthLayout from '@/components/auth/AuthLayout.vue';
import InputField from '@/components/InputField.vue';
import ButtonBase from '@/components/ButtonBase.vue';
import Checkbox from '@/components/Checkbox.vue';

const router = useRouter();
const email = ref('');
const password = ref('');
const rememberMe = ref(false);

const login = () => {
  if (!email.value || !password.value) {
    alert('Please fill in all required fields');
    return;
  }

  console.log('Logging in with:', { email: email.value, rememberMe: rememberMe.value });

  // Navigate to dashboard after successful login
  router.push('/dashboard/products');
};

const goToRegister = () => {
  router.push('/register');
};

const goToForgotPassword = () => {
  router.push('/forgot-password');
};
</script>

<style scoped>
/* Styles now moved to AuthLayout.vue */
.checkbox-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.checkbox-label {
  color: #344053;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
}
</style>
