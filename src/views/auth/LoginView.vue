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
        :disabled="isLoading"
        :loading="isLoading"
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
import authService from '@/services/authService';
import notificationService from '@/services/notificationService';
import { isValidEmail, sanitizeInput, validatePassword } from '@/utils/validation';

const router = useRouter();
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const isLoading = ref(false);



const login = async () => {
  // Validate required fields
  if (!email.value?.trim() || !password.value?.trim()) {
    notificationService.error('Please fill in all required fields');
    return;
  }
  
  // Validate email format
  if (!isValidEmail(email.value)) {
    notificationService.error('Please enter a valid email address');
    return;
  }
  
  // Validate password
  const passwordValidation = validatePassword(password.value);
  if (!passwordValidation.isValid) {
    notificationService.error(passwordValidation.errors[0]);
    return;
  }
  
  // Sanitize inputs (extra security measure)
  const sanitizedEmail = sanitizeInput(email.value.trim());
  const sanitizedPassword = password.value; // Don't modify password but ensure it's a string

  try {
    isLoading.value = true;
    const response = await authService.login(sanitizedEmail, sanitizedPassword);

    if (response.status === 1) {
      // Show success notification
      notificationService.success('Login successful!');

      // If remember me is not checked, we could set token to expire sooner
      if (!rememberMe.value) {
        // For demo, we'll just log this - in a real app we might set a shorter expiry
        console.log('Remember me not checked - token would expire sooner');
      }

      // Navigate to dashboard after successful login
      router.push('/dashboard/products');
    } else {
      // Handle unsuccessful login but with response
      notificationService.error(response.info || 'Login failed. Please try again.');
    }
  } catch (error) {
    // Handle API errors
    console.error('Login error:', error);
    notificationService.error(error.data || 'An error occurred during login. Please try again.', 'Authentication Error');
  } finally {
    isLoading.value = false;
  }
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

.error-message {
  color: #d92d20;
  font-size: 14px;
  font-weight: 500;
  margin-top: 8px;
  padding: 8px 12px;
  background-color: #fff1f0;
  border-radius: 6px;
  border-left: 3px solid #d92d20;
}
</style>
