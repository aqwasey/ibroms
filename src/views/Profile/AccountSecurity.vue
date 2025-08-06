<template>
  <div class="bg-white rounded-xl p-10 ">
    <!-- Section Header -->
    <div class="mb-10">
      <TitleLabel
        title="Account Security"
        subtitle="Manage your account security settings"
      />
    </div>

    <div class="space-y-10">
      <!-- Email Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
        <div class="lg:col-span-2">
          <InputField
            v-model="formState.email"
            label="Email Address"
            placeholder="Enter your email"
            type="email"
            disabled
          />
        </div>
        <div class="flex justify-start lg:justify-end">
          <ButtonBase
            label="Change Email"
            variant="secondary"
            @click="changeEmail"
          />
        </div>
      </div>

      <!-- Password Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end mt-6">
        <div class="lg:col-span-2">
          <InputField
            v-model="formState.password"
            label="Password"
            placeholder="*******************"
            type="password"
            disabled
          />
        </div>
        <div class="flex justify-start lg:justify-end">
          <ButtonBase
            label="Change Password"
            variant="secondary"
            @click="changePassword"
          />
        </div>
      </div>

      <!-- 2-Step Verification Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center mt-6">
        <div class="lg:col-span-2">
          <div class="space-y-2">
            <h3 class="text-base font-semibold text-gray-900">2-Step Verification</h3>
            <p class="text-gray-600 text-sm leading-relaxed">Add an additional layer of security to your account during login. This helps protect your account even if your password is compromised.</p>
          </div>
        </div>
        <div class="flex justify-start lg:justify-end">
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              v-model="formState.twoFactorEnabled"
              class="sr-only peer"
              @change="toggleTwoFactor"
            >
            <div class="w-12 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 shadow-sm"></div>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, onMounted, reactive } from 'vue'
import InputField from '@/components/InputField.vue'
import ButtonBase from '@/components/ButtonBase.vue'
import TitleLabel from '@/components/TitleLabel.vue'

const messageApi = inject('messageApi')

// Form state for account security
let formState = reactive({
  email: '',
  password: '***************',
  phone: '',
  address: '',
  twoFactorEnabled: false
})

// Load user data from localStorage to populate fields
const loadUserData = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (user) {
    formState.email = user.email || ''
    formState.phone = user.phone || ''
    // Password remains masked
    // Address would come from company profile if available
  }
}

// Action handlers for buttons
const changeEmail = () => {
  messageApi.info('Change email functionality coming soon')
}

const changePassword = () => {
  messageApi.info('Change password functionality coming soon')
}

const changePhone = () => {
  messageApi.info('Change phone functionality coming soon')
}

const toggleTwoFactor = () => {
  if (formState.twoFactorEnabled) {
    messageApi.success('2-Step verification enabled')
  } else {
    messageApi.info('2-Step verification disabled')
  }
}

// Load user data when component mounts
onMounted(() => {
  loadUserData()
})

</script>

