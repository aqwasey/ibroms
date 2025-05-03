<template>
  <main class="flex w-full h-screen">
    <section class="w-1/2 bg-background flex items-center justify-center">
      <div class="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <h2 class="text-2xl font-semibold text-center">Log in</h2>
        <p class="text-center text-gray-500 mb-6">Please enter your details.</p>

        <form class="space-y-4"></form>

        <!-- Footer -->
        <p class="text-center text-sm mt-6">
          Don’t have an account? <a href="#" class="text-purple-600 hover:underline">Sign up</a>
        </p>
      </div>
    </section>
    <section class="w-1/2 bg-background-secondary text-secondary font-semibold flex items-center flex-col justify-center text-white">
      <h2 class="text-5xl font-bold mb-6">Sign in to explore what <br> we have to offer!</h2>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
const email = ref('')
const password = ref('')
const rememberMe = ref(false)

const login = () => {
  console.log('Logging in with:', {
    email: email.value,
    password: password.value,
    rememberMe: rememberMe.value,
  })
}
</script>
