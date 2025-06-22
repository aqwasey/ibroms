<template>
  <p>
    <span class="font-semibold text-base text-gray-500">
      Make changes to an underwriter profile by completing the form.
    </span><br />
    <span class="text-gray-400 font-light">
      Note: Fields marked with * are required.
    </span>
  </p>
  <a-form layout="vertical" class="space-y-2">

    <!-- Error alert -->
    <div class="pb-4">
      <a-alert v-if="formError" type="error" :message="errorMsg" show-icon closable @close="formError = false"
        class="mb-10 py-3" />
    </div>

    <a-form-item label="Name">
      <a-input v-model:value="form.name" id="nameInput" @input="onNameInput" :maxlength="30" />
    </a-form-item>

    <a-form-item label="Sector">
      <a-select v-model:value="form.sector" placeholder="Select sector">
        <a-select-option v-for="sector in store.sectors" :key="sector" :value="sector">{{ sector }}</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item label="Province">
      <a-select v-model:value="form.province" placeholder="Select province">
        <a-select-option v-for="province in store.provinces" :key="province" :value="province">{{ province }}</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item label="Town/City">
      <a-input v-model:value="form.town_city" id="townCityInput" @input="onTownInput" :maxlength="30" />
    </a-form-item>

    <a-form-item label="Logo">
      <a-input v-model:value="form.logo" placeholder="Image URL" />
    </a-form-item>

    <a-form-item label="Website">
      <a-input v-model:value="form.website" placeholder="https://example.com" />
    </a-form-item>

    <a-form-item label="Description">
      <a-textarea v-model:value="form.description" :rows="2" />
    </a-form-item>

    <div class="flex justify-end gap-2">
      <a-button @click="close">Cancel</a-button>
      <a-button type="primary" :loading="saving" @click="submit">Save Changes</a-button>
    </div>
  </a-form>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useUnderwritersStore } from '@/stores/underwriters'

const props = defineProps({ modelValue: Object })
const emit = defineEmits(['close'])
const store = useUnderwritersStore()
const saving = store.saving
const formError = ref(false)
const errorMsg = ref('')

const form = ref({
  name: '',
  sector: '',
  province: '',
  id: null,
  town_city: '',
  logo: '',
  description: '',
  website: ''
})

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

watch(() => props.modelValue, val => {
  if (val) form.value = { ...val }
}, { immediate: true })

const close = () => emit('close')

const submit = async () => {
  try {
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

    formError.value = false
    await store.updateUnderwriter(form.value.id, form.value)
    close()
  } catch (err) {
    console.error('Failed to update underwriter', err)
  }
}
</script>
