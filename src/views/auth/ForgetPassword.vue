<template>
  <Base>
    <section class="w-full flex flex-col items-center justify-center gap-y-6">
      <div class="text-center">
        <h2 class="text-2xl text-i-gray-800 font-semibold">Forgot Password</h2>
        <p class="text-gray-500 mt-2">We will send you reset instructions.</p>
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
          name="email"
          label="Email"
          placeholder="Enter your email"
          :rules="['required', 'email']"
          :override-class="textInputClass"
          v-model="form.email"
        />



        <ButtonElement
          name="submit"
          button-label="Send Reset Instructions"
          submits
          :override-class="{
            button: 'rounded-lg bg-primary text-white w-full transition-all cursor-pointer',
            button_md: 'h-11'
          }"
        />
      </Vueform>
    </section>
    <template #description>
      <div class="flex-col justify-center text-left">
        <p>Explore What We</p> 
        <p>Have To Offer!</p> 
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
  email: '',
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
