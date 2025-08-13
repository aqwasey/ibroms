<template>
  <div class="p-4">
    <!-- Page Header - Title only -->
    <div class="mb-8">
      <PageHeader
        title="My Account"
        :showSearch="false"
        :showButton="false"
        :showShareExport="false"
      />
    </div>

    <div v-if="companyStore.loading" class="text-center py-12">
      <div class="text-gray-500 text-lg">Loading profile...</div>
    </div>

    <div v-else class="space-y-8">
      <!-- Profile Image Section -->
      <div class="bg-white rounded-xl p-10">
        <div class="flex items-center gap-6">
          <div class="relative h-24 w-24 rounded-full bg-cover bg-center overflow-hidden shadow-lg" style="background-image: url('https://placehold.co/600x400')">
            <div class="absolute inset-0 bg-black opacity-60 clip-top-half flex justify-center">
              <svg class="absolute bottom-1.5" width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.1025 3.33301C12.856 3.3351 13.5449 3.76066 13.8838 4.43359C13.885 4.43604 13.8861 4.43911 13.8887 4.44434L14.5732 5.8125C14.835 6.33591 15.3699 6.66699 15.9551 6.66699C16.8083 6.66708 17.5 7.35864 17.5 8.21191V12.3809C17.5 13.5775 17.5003 14.1762 17.332 14.6572C17.0305 15.5188 16.3528 16.1964 15.4912 16.498C15.0101 16.6664 14.4108 16.667 13.2139 16.667H6.78613C5.58918 16.667 4.98991 16.6664 4.50879 16.498C3.64725 16.1964 2.96946 15.5188 2.66797 14.6572C2.49975 14.1762 2.5 13.5775 2.5 12.3809V8.21191C2.5 7.35864 3.19167 6.66708 4.04492 6.66699C4.63013 6.66699 5.16502 6.33591 5.42676 5.8125L6.11133 4.44434C6.11394 4.43911 6.11498 4.43604 6.11621 4.43359C6.45512 3.76066 7.144 3.3351 7.89746 3.33301H12.1025ZM10 7.5C8.15931 7.50018 6.66717 8.99232 6.66699 10.833L6.6709 11.0049C6.75731 12.7094 8.12455 14.0759 9.8291 14.1621L10 14.167C11.7833 14.1668 13.2398 12.766 13.3291 11.0049L13.334 10.833C13.3338 9.04984 11.9329 7.59334 10.1719 7.50391L10 7.5ZM10 9.5C10.7361 9.50018 11.3338 10.0969 11.334 10.833C11.334 11.5693 10.7362 12.1668 10 12.167C9.26377 12.1668 8.66699 11.5693 8.66699 10.833C8.66717 10.0969 9.26388 9.50018 10 9.5Z" fill="white" fill-opacity="0.6"/>
              </svg>
            </div>
          </div>
          <div class="space-y-3">
            <a-button class="!h-10 !bg-black !border-black !text-white !rounded-lg !px-6 !font-medium">Remove Image</a-button>
            <p class="text-gray-600 text-sm">We support PNGs, JPEGs and GIFs under 2MB</p>
          </div>
        </div>
      </div>

      <!-- Company Profile Form -->
      <div class="bg-white rounded-xl p-10">
        <!-- Section Title -->
        <div class="mb-10">
          <h2 class="text-xl font-semibold text-gray-900 mb-2">Business Information</h2>
          <p class="text-gray-600">Update your company profile and business details</p>
        </div>

        <!-- Business Information Section -->
        <div class="space-y-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-5">
            <InputField
              v-model="formState.business_name"
              label="Business Name"
              placeholder="Enter business name"
            />
            <InputField
              v-model="formState.regis_no"
              label="Registration Number"
              placeholder="Enter registration number"
            />
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <InputField
              v-model="formState.phone"
              label="Phone Number"
              placeholder="Enter phone number"
            />
            <InputField
              v-model="formState.website"
              label="Website"
              placeholder="Enter website URL"
            />
          </div>
        </div>

        <!-- Location Section -->
        <div class="mt-12 pt-8  pb-5">
          <div class="mb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-1">Location</h3>
            <p class="text-gray-600 text-sm">Specify your business location</p>
          </div>
          <ProvinceSelect
            v-model="locationData"
            provinceLabel="Province"
            cityLabel="Town/City"
            layout="row"
          />
        </div>

        <!-- Address Section -->
        <div class="mt-10">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <InputField
              v-model="formState.postal_code"
              label="Postal Code"
              placeholder="Enter postal code"
            />
            <InputField
              v-model="formState.address"
              label="Address"
              placeholder="Enter full address"
            />
          </div>
        </div>

        <!-- Save Button -->
        <div class="mt-12 pt-8 border-t border-gray-100">
          <div class="flex justify-end">
            <ButtonBase
              :label="isSaving ? 'Saving...' : 'Save Changes'"
              variant="primary"
              @click="saveProfile"
              :disabled="isSaving"
              :loading="isSaving"
            />
          </div>
        </div>
      </div>

      <!-- Account Security Section -->
      <AccountSecurity />
    </div>

  </div>
</template>

<script setup>
import { inject, onMounted, reactive, ref, computed } from 'vue'
import { useCompanyStore } from '@/stores/company.js'
import PageHeader from '@/components/PageHeader.vue'
import InputField from '@/components/InputField.vue'
import ProvinceSelect, { southAfricanProvinces } from '@/components/ProvinceSelect.vue'
import ButtonBase from '@/components/ButtonBase.vue'
import AccountSecurity from '@/views/Profile/AccountSecurity.vue'
import notificationService from '@/services/notificationService'

const companyStore = useCompanyStore()
const isLoading = ref(false)
const isSaving = ref(false)

// Form state with company profile fields
let formState = reactive({
  business_name: '',
  regis_no: '',
  phone: '',
  website: '',
  postal_code: '',
  address: ''
})

// Location data for ProvinceSelect component
const locationData = ref({ province: '', city: '' })

// Computed property for filtering cities based on selected province
const filteredCities = computed(() => {
  if (!locationData.value.province) return []
  const selected = southAfricanProvinces.find(p => p.name === locationData.value.province)
  return selected ? selected.cities : []
})

// Fetch company profile data
const fetchProfile = async () => {
  try {
    isLoading.value = true

    await companyStore.fetchCompany()

    // Populate form with company data if available
    const company = companyStore.company

    if (company) {
      formState.business_name = company.business_name || ''
      formState.regis_no = company.regis_no || ''
      formState.phone = company.phone || ''
      formState.website = company.website || ''
      formState.postal_code = company.postal_code || ''
      formState.address = company.address || ''

      // Set location data for ProvinceSelect component
      locationData.value = {
        province: company.province || '',
        city: company.town_city || ''
      }

    }
  } catch (error) {
    console.error('💥 Error fetching profile:', error)
    notificationService.error('Failed to load profile data')
  } finally {
    isLoading.value = false
  }
}

// Save profile changes
const saveProfile = async () => {
  try {
    isSaving.value = true

    // Combine form data with location data
    const profileData = {
      ...formState,
      province: locationData.value.province,
      town_city: locationData.value.city
    }

    // Use company store to update profile
    await companyStore.updateProfile(profileData)

    notificationService.success('Profile updated successfully!')
  } catch (error) {
    console.error('Error saving profile:', error)
    notificationService.error('Failed to save profile changes')
  } finally {
    isSaving.value = false
  }
}

// Load profile data when component mounts
onMounted(() => {
  fetchProfile()
})

</script>

