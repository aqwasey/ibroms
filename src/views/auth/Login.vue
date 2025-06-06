<template>
  <Base>
    <section class="w-full flex-col items-center justify-center">
      <h2 class="text-2xl text-i-gray-800 font-semibold text-center">Log in</h2>
      <p class="text-center text-gray-500 mb-6">Please enter your details.</p>

      <Vueform :float-placeholders="false" class="flex w-[360px] justify-center">
        <TextElement
          name="email"
          label="Email"
          placeholder="Enter your email"
          v-model="form.email"
          :override-class="{
            inputContainer: 'border-1 rounded-lg bg-transparent w-full transition-all',
            inputContainer_default: 'border-i-gray-100',
            inputContainer_focused: 'border-primary',
            inputContainer_md: 'h-11',
            input_md: 'h-11',
            input: 'px-[10px]'
          }"
        />

        <TextElement
          input-type="password"
          name="password"
          label="Password"
          placeholder="Enter your password"
          v-model="form.password"
          :override-class="{
            inputContainer: 'border-1 rounded-lg bg-transparent w-full transition-all',
            inputContainer_default: 'border-i-gray-100',
            inputContainer_focused: 'border-primary',
            inputContainer_md: 'h-11',
            input_md: 'h-11',
            input: 'px-[10px]'
          }"
        />

        <div class="flex w-[360px] h-[20px] py-[24px] items-center justify-between">
          <CheckboxElement 
          name="rememberMe" v-model="form.rememberMe"
          >Remember me</CheckboxElement>
            <a href="#" class="text-i-gray-800 hover:underline">Forgot password</a>
        </div>

        <ButtonElement
          name="button"
          :override-class="{
            button: 'rounded-lg bg-primary text-white w-full transition-all cursor-pointer',
            button_md: 'h-11 w-[360px]'
          }"
          @click="onSubmit"
        >
          Sign in
        </ButtonElement>
      </Vueform>

      <p class="text-center text-sm pt-[24px]">
        Don’t have an account?
        <a href="#" class="text-i-gray-800 hover:underline">Sign up</a>
      </p>
    </section>
  </Base>
</template>

<script setup>
import { ref } from 'vue'
import Base from './Base.vue'

const form = ref({
  email: '',
  password: '',
  rememberMe: false
})

const onSubmit = () => {
  console.log('Form submitted with:', form.value)
}
</script>
