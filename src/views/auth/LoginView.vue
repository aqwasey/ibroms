<template>
  <AuthLayout title="Sign in to explore what we have to offer!">
    <!-- Page title and supporting text -->
    <template #page-title>Log in</template>
    <template #supporting-text>Please enter your details.</template>

    <!-- Form content -->
    <template #form-content>
      <form @submit.prevent="login">
        <InputField
          v-model="email"
          label="Email"
          placeholder="Enter your email"
          @keyup.enter="login"
        />

        <SpaceComponent size="medium" />

        <InputField
          v-model="password"
          label="Password"
          placeholder="••••••••"
          type="password"
          @keyup.enter="login"
        />

        <SpaceComponent size="medium" />

        <!-- Remember me and forgot password row -->
        <div class="row">
          <div class="checkbox-container">
            <Checkbox v-model="rememberMe" />
            <div class="checkbox-label">Remember me</div>
            <br>
          </div>

          <SpaceComponent size="medium" />

          <button type="button" class="link-button checkbox-label" @click.prevent="goToForgotPassword">Forgot password</button>
        </div>
      </form>
    </template>



    <!-- Action buttons -->
    <template #actions>
      <ButtonBase
        label="Sign in"
        variant="primary"
        @click.prevent="login"
        class="w-full"
        :disabled="isLoading"
        :loading="isLoading"
        type="button"
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
import SpaceComponent from '@/components/SpaceComponent.vue';
import authService from '@/services/authService';
import notificationService from '@/services/notificationService';
import { isValidEmail, sanitizeInput } from '@/utils/validation';

const router = useRouter();
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const isLoading = ref(false);



const login = async (event) => {
  // Prevent any form submission behavior
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  // Validate required fields
  if (!email.value?.trim() || !password.value?.trim()) {
    notificationService.error('Please fill in all required fields', '', { autoClose: true, duration: 5000 });
    return;
  }

  // Validate email format
  if (!isValidEmail(email.value)) {
    notificationService.error('Please enter a valid email address', '', { autoClose: true, duration: 5000 });
    return;
  }

  // Sanitize inputs (extra security measure)
  const sanitizedEmail = sanitizeInput(email.value.trim());
  const sanitizedPassword = password.value;

  try {
    isLoading.value = true;

    const response = await authService.login(sanitizedEmail, sanitizedPassword);

    if (response && response.status === 1) {
      notificationService.success('Login successful!');

      setTimeout(() => {
        router.push('/dashboard/profile');
      }, 1000);
    } else {
      const errorMessage = response?.info || response?.message || 'Login failed. Please check your credentials.';

      setTimeout(() => {
        notificationService.error(errorMessage, '', {
          autoClose: true,
          duration: 5000,
          dismissable: true
        });
      }, 100);
    }
  } catch (error) {

    let errorMessage = 'An error occurred during login. Please try again.';

    if (error.data && typeof error.data === 'string') {
      errorMessage = error.data;
    } else if (error.response?.data?.info) {
      errorMessage = error.response.data.info;
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data) {
      errorMessage = typeof error.response.data === 'string' ? error.response.data : errorMessage;
    } else if (error.message) {
      errorMessage = error.message;
    }


    setTimeout(() => {
      notificationService.error(errorMessage, '', {
        autoClose: true,
        duration: 5000,
        dismissable: true
      });
    }, 100);
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
