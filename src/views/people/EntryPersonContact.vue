<template>
  <p>
    <span class="font-semibold text-base text-gray-500">
      Register a new person by completing the form below.<br />
    </span>
    <span class="text-gray-400 font-light">
      Note: Fields marked with * are required.
    </span>
  </p>
  <a-form layout="vertical" @submit.prevent>
    <a-form-item label="Othername *">
      <a-input v-model:value="form.othername" :maxlength="20" required />
    </a-form-item>
    
    <a-form-item label="Surname *">
      <a-input v-model:value="form.surname" :maxlength="30" required />
    </a-form-item>

    <a-form-item label="Gender *">
      <a-select v-model:value="form.gender" placeholder="Select gender">
        <a-select-option value="Male">Male</a-select-option>
        <a-select-option value="Female">Female</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item label="ID Type *">
      <a-select v-model:value="form.id_type" required>
        <a-select-option v-for="type in store.idtypes" :key="type" :value="type">{{ type }}</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item label="ID Number *">
      <a-input v-model:value="form.idno" required />
    </a-form-item>

    <a-form-item label="Birthdate *">
      <a-date-picker v-model:value="form.birthdate" style="width: 100%" />
    </a-form-item>

    <a-form-item>
      <a-checkbox v-model:checked="agree" required>
        I confirm all provided information is accurate and complete.
      </a-checkbox>
    </a-form-item>

    <div class="flex justify-end gap-2">
      <a-button @click="$emit('close')">Cancel</a-button>
      <a-button type="primary" @click="submitForm">Create Person</a-button>
    </div>
  </a-form>
</template>

<script setup>
import { ref } from 'vue'
const emit = defineEmits(['close'])
import { usePersonStore } from '@/stores/people'
const store = usePersonStore()
const saving = store.saving
const agree = ref(false)
const formError = ref(false)
const errorMsg = ref('')

const form = ref({
  othername: '',
  surname: '',
  gender: '',
  id_type: '',
  idno: '',
  birthdate: ''
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

const resetForm = () => {
  form.value = {
    othername: '',
    surname: '',
    gender: '',
    id_type: '',
    idno: '',
    birthdate: ''
  }
  agree.value = false
  formError.value = false
  errorMsg.value = ''
}

const close = () => {
  resetForm()
  emit('close')
}

const submitForm = () => {
  console.log('Submitted', form.value)
  emit('close')
}
</script>