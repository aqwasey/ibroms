<template>
  <Base>
    <section class="w-full px-4 flex flex-col items-center justify-center gap-y-6">
      <!-- Header -->
      <div class="text-center">
        <h2 class="text-2xl text-i-gray-800 font-semibold">Create Account</h2>
        <p class="text-gray-500 mt-2">Please enter your details.</p>
      </div>

      <!-- Form -->
      <Vueform
        :float-placeholders="false"
        class="w-full max-w-[720px]"
        validate-on="step"
        :display-errors="false"
        :endpoint="false"
        @submit="onSubmit"
      >
        <!-- Organization Name -->
        <TextElement
          name="business_name"
          label="Organization Name"
          placeholder="Enter your organization name"
          :rules="['required']"
          :override-class="textInputClass"
        />
           <!-- Town/City + Province -->
           <GroupElement 
            name="resident"
            :override-class="{
            wrapper: 'flex flex-col lg:flex-row gap-4 w-full',
            wrapper_md: 'w-full',
            }"

 
          >
          <TextElement
            name="town_city"
            label="Town / City"
            placeholder="Enter your town or city"
            :rules="['required']"
            :override-class="textInputClass"
            class="lg:w-1/2"

          />
          <TextElement
            name="province"
            label="Province"
            placeholder="Enter your province"
            :rules="['required']"
            :override-class="textInputClass"
            class="lg:w-1/2"
  
          />
        </GroupElement>


            <!-- Registration Number + Phone -->
            <GroupElement  
           name="contact"
           :override-class="{
            wrapper: 'flex flex-col lg:flex-row gap-4 w-full',
            wrapper_md: 'w-full',
          }"  
      >
          <TextElement
            name="regis_no"
            label="Registration Number"
            placeholder="Enter your Registration Number"
            :rules="['required']"
            :override-class="textInputClass"
            class="lg:w-1/2"
          />
          <PhoneElement
            name="phone"
            label="Phone"
            placeholder="Enter your phone"
            :rules="['required']"
            field-name="Phone"
            :allow-incomplete="true"
            :override-class="phoneInputClass"
            class="lg:w-1/2"
          />

        </GroupElement>
        <!-- Email -->
        <TextElement
          name="email"
          label="Email"
          placeholder="Enter your email"
          :rules="['required', 'email']"
          :override-class="textInputClass"
        />

        <!-- Password -->
        <TextElement
          input-type="password"
          name="password"
          label="Password"
          placeholder="Enter your password"
          :override-class="textInputClass"
          :rules="[
          'required',
          'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/',
          'confirmed'
          ]"
          :messages="{
          regex: 'The Password must at least 8 characters long and contain at least one number, one uppercase and one lowercase character.'
        }"
        />

        <!-- Confirm Password -->
        <TextElement
          input-type="password"
          name="password_confirmation"
          label="Confirm Password"
          placeholder="Confirm your password"
          :rules="['required']"
          :override-class="textInputClass"

        />

        <!-- Submit Button -->
        <ButtonElement
         :button-label="isSubmitting ? 'Creating Account ...' : 'Create Account'"
          submits
          :disabled="isSubmitting"
          name="submit"
          :override-class="{
            button: 'rounded-lg bg-primary text-white w-full transition-all cursor-pointer',
            button_md: 'h-11',
          }"
        />

      </Vueform>

      <!-- Footer -->
      <p class="text-center text-sm">
        Already have an account?
        <router-link to="/login" class="text-i-gray-800 hover:underline">Log in</router-link>
      </p>
    </section>

    <!-- Side Description -->
    <template #description>
      <div class="flex-col justify-center text-left">
        <p>Register Your Business</p>
        <p>Today and Explore!</p>
      </div>
    </template>
  </Base>

  <Modal
  :show="showCreateModel"
  :loading="isSubmitting"
  :title="'Continue to Create Account'"
  :close="() => { showCreateModel = false }">
  <div class="text-center mt-4">
    <button
      @click="createAccount"
      class="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition"
    >
      Continue to Create Account
    </button>
  </div>
</Modal>
  <Modal
  :show="showSuccessModal"
  :loading="isSubmitting"
  :title="'Account Created Successfully'"
  :close="() => { showSuccessModal = false }">
  <div class="text-center mt-4">
    <p class="text-gray-700 mb-4">Your account has been created successfully!</p>
    <button
      @click="goToLogin"
      class="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition"
    >
      Continue to Login 
    </button>
  </div>
</Modal>

</template>

<script setup>
import { ref } from 'vue'
import Base from './Base.vue'
import { signup } from '@/services/auth'
import Modal from '@/components/Modal.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const showSuccessModal = ref(false);
const showCreateModel=ref(false);
const isSubmitting=ref(false)
const formData=ref({})
// Custom input styling
const textInputClass = {
  inputContainer: 'border-1 rounded-lg bg-transparent w-full transition-all',
  inputContainer_default: 'border-i-gray-100',
  inputContainer_focused: 'border-primary',
  inputContainer_md: 'h-11',
  input_md: 'h-11',
  input: 'px-[10px]',
}
const phoneInputClass = {
  inputContainer: 'flex flex-row border-1 rounded-lg bg-transparent w-full transition-all',
  inputContainer_default: 'border-i-gray-100',
  inputContainer_focused: 'border-primary',
  inputContainer_md: 'h-11',
  input_md: 'h-11',
  input: 'px-[10px]',
}


// Submit handler
const onSubmit = async (form$, FormData) => {
  const requestData = form$.requestData;
  formData.value=requestData
  showCreateModel.value = true
}
const goToLogin = () => {
  showSuccessModal.value = false
  router.push('/login')
}
const createAccount = async() => {
  try {
    isSubmitting.value=true
    console.log({formData})
    await signup({
      business_name:formData.value.business_name,
      regis_no: formData.value.regis_no,
      phone: formData.value.phone,
      province: formData.value.province,
      town_city: formData.value.town_city,
      email: formData.value.email,
      auth:{
        email: formData.value.email,
        password: formData.value.password,
      }
    })
    showSuccessModal.value=true
  } catch (error) {
    alert('Signup failed')
  } finally {
    isSubmitting.value=false
    showCreateModel.value=false
  }
}
</script>
