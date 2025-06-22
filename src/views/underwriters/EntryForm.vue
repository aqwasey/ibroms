<template>
  <p>
    <span class="font-semibold text-base text-gray-500">
      Register a new underwriter by completing the form below.<br />
    </span>
    <span class="text-gray-400 font-light">
      Note: Fields marked with * are required.
    </span>
  </p>

  <a-form layout="vertical" class="space-y-2">

    <!-- Error alert -->
     <div class="pb-4">
      <a-alert
        v-if="formError"
        type="error"
        :message="errorMsg"
        show-icon
        closable
        @close="formError = false"
        class="mb-10 py-3"
      />
     </div>

    <a-form-item label="Name *">
      <a-input
        v-model:value="form.name"
        @input="onNameInput"
        id="nameInput"
        :maxlength="30"
        placeholder="Enter underwriter name or title"
        required
      />
    </a-form-item>

    <a-form-item label="Sector *">
      <a-select v-model:value="form.sector" placeholder="Select sector" required>
        <a-select-option
          v-for="sector in store.sectors"
          :key="sector"
          :value="sector"
        >
          {{ sector }}
        </a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item label="Province *">
      <a-select v-model:value="form.province" placeholder="Select province" required>
        <a-select-option
          v-for="province in store.provinces"
          :key="province"
          :value="province"
        >
          {{ province }}
        </a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item label="Town/City *">
      <a-input
        v-model:value="form.town_city"
        ref="townCityInput"
        @input="onTownInput"
        id="townCityInput"
        :maxlength="30"
        placeholder="Enter town or city"
        required
      />
    </a-form-item>

    <a-form-item label="Description (optional)">
      <a-textarea
        v-model:value="form.description"
        :maxlength="120"
        ref="descriptionInput"
        placeholder="Enter description (optional)"
        :rows="2"
      />
    </a-form-item>

    <a-form-item label="Logo (optional)">
      <a-input
        v-model:value="form.logo"
        ref="logoInput"
        :maxlength="120"
        placeholder="URL of the logo image (optional)"
      />
    </a-form-item>

    <a-form-item>
      <a-checkbox v-model:checked="agree" required>
        I confirm all provided information is accurate and complete.
      </a-checkbox>
    </a-form-item>

    <div class="flex justify-end gap-2">
      <a-button @click="close">Cancel</a-button>
      <a-button
        type="primary"
        :loading="saving"
        :disabled="!agree"
        @click="handleSubmit"
      >
        Create Underwriter
      </a-button>
    </div>
  </a-form>
</template>

<script setup>
import { ref } from 'vue'
import { useUnderwritersStore } from '@/stores/underwriters'

const emit = defineEmits(['close'])
const store = useUnderwritersStore()
const saving = store.saving
const agree = ref(false)
const formError = ref(false)
const errorMsg = ref('')

const form = ref({
  name: '',
  sector: '',
  province: '',
  town_city: '',
  description: '',
  logo: ''
})

const resetForm = () => {
  form.value = {
    name: '',
    sector: '',
    province: '',
    town_city: '',
    description: '',
    logo: ''
  }
  agree.value = false
  formError.value = false
  errorMsg.value = ''
}

const onNameInput = () => {
  const inputEl = document.getElementById('nameInput')
  const rawValue = inputEl.value
  const cleanedValue = rawValue.replace(/[^a-zA-Z ]/g, '').toUpperCase()
  inputEl.value = cleanedValue
  form.value.name = cleanedValue
}

const onTownInput = () => {
  const inputEl = document.getElementById('townCityInput')
  const rawValue = inputEl.value
  const cleanedValue = rawValue.replace(/[^a-zA-Z ]/g, '')
  inputEl.value = cleanedValue
  form.value.town_city = cleanedValue
}

const close = () => {
  resetForm()
  emit('close')
}

const handleSubmit = async () => {
  const { name, sector, province, town_city } = form.value

  // Basic required field validation
  if (!name || name.length < 3) {
    errorMsg.value = 'Underwriter name or title is required or too short.'
    formError.value = true
    return
  }

  if (!store.sectors.includes(sector)) {
    errorMsg.value = 'Please select a valid industry sector.'
    formError.value = true
    return
  }

  if (!store.provinces.includes(province)) {
    errorMsg.value = 'Province name is required.'
    formError.value = true
    return
  }

  if (!town_city || town_city.length < 5) {
    errorMsg.value = 'Town or City name is required or too short.'
    formError.value = true
    return
  }

  if (!agree.value) {
    errorMsg.value = 'You must agree to the terms before submitting.'
    formError.value = true
    return
  }

  formError.value = false

  try {
    await store.createUnderwriter(form.value)
    close()
  } catch (err) {
    console.error('Failed to create a new underwriter', err)
  }
}
</script>
