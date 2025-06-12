<template>
  <Base>
    <section class="flex flex-col items-center justify-center gap-y-6 w-full max-w-md bg-white p-8 rounded-lg shadow">
      <div class="text-center">
        <h2 class="text-2xl text-i-gray-800 font-semibold">Log in</h2>
        <p class="text-gray-500 mt-2">Please enter your details.</p>
      </div>

      <Vueform
        :float-placeholders="false"
        class="flex flex-col gap-y-4 w-[360px]"
        validate-on="change|step"
        :display-errors="false"
        :endpoint="false"
        @submit="onSubmit"
      >
        <TextElement
          name="email"
          label="Email"
          placeholder="Enter your email"
          :rules="['required', 'email']"
          :debounce="1000"
          :override-class="textInputClass"
          v-model="form.email"
        />

        <TextElement
          input-type="password"
          name="password"
          label="Password"
          placeholder="Enter your password"
          :rules="['required']"
          :override-class="textInputClass"
          v-model="form.password"
        />

        <div class="flex justify-between items-center text-sm w-[360px]">
          <CheckboxElement name="rememberMe" v-model="form.rememberMe">
            Remember me
          </CheckboxElement>
          <router-link to="/forget-password" class="text-i-gray-800 hover:underline">
            Forgot password?
          </router-link>
        </div>

        <ButtonElement
          name="submit"
          :button-label="form.submitting ? 'Signing in...' : 'Sign in'"
          submits
          :disabled="form.submitting"
          :override-class="{
            button: 'rounded-lg bg-primary text-white w-full transition-all cursor-pointer',
            button_md: 'h-11'
          }"
        />
      </Vueform>

      <p class="text-center text-sm pt-6">
        Don’t have an account?
        <router-link to="/sign-up" class="text-i-gray-800 hover:underline">Sign up</router-link>
      </p>
    </section>

    <template #description>
      <div class="flex-col justify-center text-left">
        <p>Sign in to explore what</p>
        <p>we have to offer!</p>
      </div>
    </template>

    <!-- Modal Before Login Confirmation -->
    <Modal
      :show="showLoginConfirmModal"
      :loading="form.submitting"
      :title="'Continue to Sign In'"
      :close="() => { showLoginConfirmModal = false }"
    >
      <div class="text-center mt-4">
        <button
          @click="confirmLogin"
          class="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition"
        >
          Continue to Sign In
        </button>
      </div>
    </Modal>

    <!-- Modal on Successful Login -->
    <Modal
      :show="showLoginSuccessModal"
      :loading="false"
      :title="'Login Successful'"
      :close="() => { showLoginSuccessModal = false }"
    >
      <div class="text-center mt-4">
        <p class="text-gray-700 mb-4">You have successfully logged in.</p>
        <button
          @click="goToDashboard"
          class="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition"
        >
          Go to Dashboard
        </button>
      </div>
    </Modal>
  </Base>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/services/auth'
import Modal from '@/components/Modal.vue'
import Base from './Base.vue'

const router = useRouter()

const form = ref({
  email: '',
  password: '',
  rememberMe: false,
  submitting: false,
})

const showLoginConfirmModal = ref(false)
const showLoginSuccessModal = ref(false)

// Styling same as Sign Up
const textInputClass = {
  inputContainer: 'border-1 rounded-lg bg-transparent w-full transition-all',
  inputContainer_default: 'border-i-gray-100',
  inputContainer_focused: 'border-primary',
  inputContainer_md: 'h-11',
  input_md: 'h-11',
  input: 'px-[10px]',
}

// Trigger modal to confirm login
const onSubmit = async () => {
  showLoginConfirmModal.value = true
}

// Confirm login after modal
const confirmLogin = async () => {
  try {
    form.value.submitting = true
    const { email, password, rememberMe } = form.value
    const result = await login({ email, password })

    if (result.success) {
      if (rememberMe) {
        localStorage.setItem('rememberEmail', email)
      } else {
        localStorage.removeItem('rememberEmail')
      }

      showLoginSuccessModal.value = true
    } else {
      alert(result.message || 'Login failed')
    }
  } catch (err) {
    alert('An error occurred while logging in.')
  } finally {
    form.value.submitting = false
    showLoginConfirmModal.value = false
  }
}

// Navigate after login
const goToDashboard = () => {
  showLoginSuccessModal.value = false
  router.push('/')
}
</script>
