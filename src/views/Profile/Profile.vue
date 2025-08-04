<template>
  <div class="p-4">
    <!-- Page Header -->
    <PageHeader title="My Account" />
    
    <div>
      <div class="pt-5">
        <div class="flex items-center gap-4">
          <div class="relative h-20 w-20 rounded-full bg-cover bg-center overflow-hidden" style="background-image: url('https://placehold.co/600x400')">
            <div class="absolute inset-0 bg-black opacity-60  clip-top-half flex justify-center">
              <svg class="absolute bottom-1" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.1025 3.33301C12.856 3.3351 13.5449 3.76066 13.8838 4.43359C13.885 4.43604 13.8861 4.43911 13.8887 4.44434L14.5732 5.8125C14.835 6.33591 15.3699 6.66699 15.9551 6.66699C16.8083 6.66708 17.5 7.35864 17.5 8.21191V12.3809C17.5 13.5775 17.5003 14.1762 17.332 14.6572C17.0305 15.5188 16.3528 16.1964 15.4912 16.498C15.0101 16.6664 14.4108 16.667 13.2139 16.667H6.78613C5.58918 16.667 4.98991 16.6664 4.50879 16.498C3.64725 16.1964 2.96946 15.5188 2.66797 14.6572C2.49975 14.1762 2.5 13.5775 2.5 12.3809V8.21191C2.5 7.35864 3.19167 6.66708 4.04492 6.66699C4.63013 6.66699 5.16502 6.33591 5.42676 5.8125L6.11133 4.44434C6.11394 4.43911 6.11498 4.43604 6.11621 4.43359C6.45512 3.76066 7.144 3.3351 7.89746 3.33301H12.1025ZM10 7.5C8.15931 7.50018 6.66717 8.99232 6.66699 10.833L6.6709 11.0049C6.75731 12.7094 8.12455 14.0759 9.8291 14.1621L10 14.167C11.7833 14.1668 13.2398 12.766 13.3291 11.0049L13.334 10.833C13.3338 9.04984 11.9329 7.59334 10.1719 7.50391L10 7.5ZM10 9.5C10.7361 9.50018 11.3338 10.0969 11.334 10.833C11.334 11.5693 10.7362 12.1668 10 12.167C9.26377 12.1668 8.66699 11.5693 8.66699 10.833C8.66717 10.0969 9.26388 9.50018 10 9.5Z" fill="white" fill-opacity="0.6"/>
              </svg>
            </div>
          </div>
          <div>
            <a-button class="!h-[36px] !bg-black !border-black !text-white !rounded-lg">Remove Image</a-button>
            <p class="text-[#344054] text-sm !mt-3">We support PNGs, JPEGs and GIFs under 2MB</p>
          </div>
        </div>
      </div>
      <div class="form-section">
        <div class="grid grid-cols-2 gap-x-5">
          <InputField
            v-model="formState.firstName"
            label="First Name"
            placeholder="Enter first name"
          />
          <InputField
            v-model="formState.lastName"
            label="Last Name"
            placeholder="Enter last name"
          />
          <InputField
            v-model="formState.birthDate"
            label="Birth Date"
            placeholder="Select birth date"
            type="date"
          />
          <SelectField
            v-model="formState.country"
            label="Country"
            placeholder="Select Country"
            :options="countryOptions"
          />
        </div>
        <InputField
          v-model="formState.address"
          label="Address"
          placeholder="Enter your address"
          class="mt-5"
        />
      </div>
    </div>
    <account-security/>
  </div>
</template>

<script setup>
import { inject, onMounted, reactive } from 'vue'
import { useUnderwritersStore } from '@/stores/underwriters.js'
import PageHeader from '@/components/PageHeader.vue'
import InputField from '@/components/InputField.vue'
import SelectField from '@/components/SelectField.vue'
import AccountSecurity from '@/views/Profile/AccountSecurity.vue'

let formState = reactive({
  firstName: '',
  lastName: '',
  birthDate: '',
  country: '',
  address: ''
})

// Country options for select field
const countryOptions = [
  { value: 'south-africa', label: 'South Africa' },
  { value: 'nigeria', label: 'Nigeria' },
  { value: 'ghana', label: 'Ghana' },
  { value: 'kenya', label: 'Kenya' }
]

const messageApi = inject('messageApi')

const underwritersStore = useUnderwritersStore()

onMounted(() => {
  underwritersStore.fetchUnderwriters()
})

</script>

