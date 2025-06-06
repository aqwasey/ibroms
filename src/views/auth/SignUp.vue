<template>
  <Base>
    <section class="w-full flex flex-col items-center justify-center gap-y-6">
      <div class="text-center">
        <h2 class="text-2xl text-i-gray-800 font-semibold">Create Account</h2>
        <p class="text-gray-500 mt-2">Please enter your details.</p>
      </div>

      <Vueform
        :float-placeholders="false"
        class="flex flex-col gap-y-4 w-[360px]"
        validate-on="step"
        :display-errors="false"
        :endpoint="false"
        @submit="onSubmit"
      >
        <TextElement
          name="organizationName"
          label="Organization Name"
          placeholder="Enter your organization name"
          :rules="['required']"
          :override-class="textInputClass"
          v-model="form.organizationName"
        />
        <TextElement
          name="email"
          label="Email"
          placeholder="Enter your email"
          :rules="['required', 'email']"
          :override-class="textInputClass"
          v-model="form.email"
        />
        <TextElement
          input-type="password"
          name="password"
          label="Password"
          placeholder="Enter your password"
          :rules="['required', 'confirmed']"
          :override-class="textInputClass"
          v-model="form.password"
        />
        <TextElement
          name="password_confirmation" 
          :rules="['required']"
          input-type="password"
          label="Confirm Password"
          placeholder="Confirm your password"
          :override-class="textInputClass"
           v-model="form.confirmPassword"
        />

        <ButtonElement
          name="submit"
          button-label="Create Account"
          submits
          :override-class="{
            button: 'rounded-lg bg-primary text-white w-full transition-all cursor-pointer',
            button_md: 'h-11'
          }"
        />
      </Vueform>

      <p class="text-center text-sm">
        Already have an account?
        <router-link to="/login" class="text-i-gray-800 hover:underline">Log in</router-link>
      </p>
    </section>
    <template #description>
    <div class="flex-col justify-center text-left">
                <p>Register Your Business </p> 
            <p>Today and Explore!</p> 
    </div>

    </template>
  </Base>
</template>

<script setup>
import { ref } from 'vue'
import Base from './Base.vue'


const textInputClass = {
  inputContainer: 'border-1 rounded-lg bg-transparent w-full transition-all',
  inputContainer_default: 'border-i-gray-100',
  inputContainer_focused: 'border-primary',
  inputContainer_md: 'h-11',
  input_md: 'h-11',
  input: 'px-[10px]'
}

const form = ref({
  organizationName: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const onSubmit =async (form$, FormData) => {
  const requestData = form$.requestData
  form$.submitting = true

  let response
  try {
      console.log({requestData})
    // Sending the request
  } catch (error) {
    return
  } finally {
    form$.submitting = false
  }
}
</script>
