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
      <a-input
        v-model:value="form.othername"
        :maxlength="25" @input="onOthernameInput"
        id="othernameInput" required />
    </a-form-item>
    
    <a-form-item label="Surname *">
      <a-input
        v-model:value="form.surname"
        :maxlength="25"
        @input="onSurnameInput"
        id="surnameInput"
        required
      />
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
      <a-date-picker v-model:value="form.birthdate" format="YYYY-MM-DD" placeholder="Select birthdate" style="width: 100%" />
    </a-form-item>

    <a-form-item>
      <a-checkbox v-model:checked="agree" required>
        I confirm all provided information is accurate and complete.
      </a-checkbox>
    </a-form-item>

    <div class="flex justify-end gap-2">
      <a-button @click="$emit('close')">Cancel</a-button>
      <a-button
        type="primary" @click="submitForm"
        :loading="saving" :disabled="!agree">Create Person</a-button>
    </div>
  </a-form>
</template>

<script setup>
import { ref } from 'vue'
import { usePersonStore } from '@/stores/people'
import dayjs from 'dayjs'
const emit = defineEmits(['close'])
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

const onOthernameInput = () => {
  const inputEl = document.getElementById('othernameInput')
  const rawValue = inputEl.value
  const cleanedValue = rawValue.replace(/[^a-zA-Z ]/g, '').toUpperCase()
  inputEl.value = cleanedValue
  form.value.othername = cleanedValue
}

const onSurnameInput = () => {
  const inputEl = document.getElementById('surnameInput')
  const rawValue = inputEl.value
  const cleanedValue = rawValue.replace(/[^a-zA-Z ]/g, '').toUpperCase()
  inputEl.value = cleanedValue
  form.value.surname = cleanedValue
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

const submitForm = async() => {
  const { othername, surname, gender, id_type, idno, birthdate } = form.value

  // Basic required field validation
  if (!othername || othername.length < 3) {
    errorMsg.value = 'Othername is required or too short.'
    formError.value = true
    return
  }

  if (!surname || surname.length < 3) {
    errorMsg.value = 'Surname is required or too short.'
    formError.value = true
    return
  }

  if (!store.idtypes.includes(id_type)) {
    errorMsg.value = 'ID Type is required.'
    formError.value = true
    return
  }

  if (!idno || idno.length < 5) {
    errorMsg.value = 'ID Number is required or too short.'
    formError.value = true
    return
  }

  if (!birthdate) {
    errorMsg.value = 'Birthdate is required.'
    formError.value = true
    return
  }

  if (!gender) {
    errorMsg.value = 'Gender is required.'
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
    const payload = {
      ...form.value,
      birthdate: form.value.birthdate
        ? dayjs(form.value.birthdate).format('YYYY-MM-DD')
        : ''
    }
    await store.createPerson(payload)
    close()
  } catch (err) {
    console.error('Failed to create new person', err)
  }

}
</script>