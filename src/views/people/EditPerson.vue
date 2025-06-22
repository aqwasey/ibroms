<script setup>
import { ref, watch, onMounted } from 'vue' // Keep onMounted, but we'll change its content
import { usePersonStore } from '@/stores/people'
import dayjs from 'dayjs' // Good to use dayjs directly for formatting
import { message } from 'ant-design-vue' // Import message for success/error notifications

const props = defineProps({
  modelValue: {
    type: Object,
    required: true // modelValue should always be provided for EditForm
  }
})

const emit = defineEmits(['close'])
const store = usePersonStore()
const saving = ref(false) // Local loading state for the form submission within this component
const formError = ref(false)
const errorMsg = ref('')

const form = ref({ // Initialize with default types, but the watch will override
  othername: '',
  surname: '',
  gender: '',
  id_type: '',
  idno: '',
  birthdate: '',
  id: null,
  alive: true, // Assuming this is also part of your person object
  created_on: '',
  updated_on: ''
})

// Correct way to initialize and update the form data based on props.modelValue
watch(() => props.modelValue, val => {
  if (val) {
    // Ensure deep copy to prevent direct mutation of prop
    const clonedVal = JSON.parse(JSON.stringify(val)); // Deep clone the object
    const birthdateFormatted = clonedVal.birthdate
      ? dayjs(clonedVal.birthdate).format('YYYY-MM-DD')
      : null // Use null if no birthdate, better for date-picker

    form.value = {
      ...clonedVal, // Copy all properties from modelValue
      birthdate: birthdateFormatted
    }
  } else {
    // If modelValue becomes null (e.g., when modal closes), reset the form
    resetForm();
  }
}, { immediate: true, deep: true }) // immediate to load on first render, deep to react to nested changes

const onOthernameInput = (event) => { // Use event directly for target value
  const rawValue = event.target.value
  const cleanedValue = rawValue.replace(/[^a-zA-Z ]/g, '').toUpperCase()
  form.value.othername = cleanedValue
}

const onSurnameInput = (event) => { // Use event directly for target value
  const rawValue = event.target.value
  const cleanedValue = rawValue.replace(/[^a-zA-Z ]/g, '').toUpperCase()
  form.value.surname = cleanedValue
}

const resetForm = () => {
  form.value = {
    othername: '',
    surname: '',
    gender: '',
    id_type: '',
    idno: '',
    birthdate: null, // Reset to null for date-picker
    id: null,
    alive: true,
    created_on: '',
    updated_on: ''
  }
  formError.value = false
  errorMsg.value = ''
}

const close = () => {
  resetForm() // Reset form when closing
  emit('close')
}

const submitForm = async () => {
  const { othername, surname, gender, id_type, idno, birthdate } = form.value

  if (!othername || othername.length < 3) {
    errorMsg.value = 'Othername is required and must be at least 3 characters.'
    formError.value = true
    return
  }

  if (!surname || surname.length < 3) {
    errorMsg.value = 'Surname is required and must be at least 3 characters.'
    formError.value = true
    return
  }

  if (!gender) {
    errorMsg.value = 'Gender is required.'
    formError.value = true
    return
  }

  if (!id_type || !store.idtypes.includes(id_type)) {
    errorMsg.value = 'ID Type is required and must be a valid type.'
    formError.value = true
    return
  }

  if (!idno || idno.length < 5) {
    errorMsg.value = 'ID Number is required and must be at least 5 characters.'
    formError.value = true
    return
  }

  if (!birthdate) {
    errorMsg.value = 'Birthdate is required.'
    formError.value = true
    return
  }

  formError.value = false // Clear previous errors
  saving.value = true // Set loading state

  try {
    const payload = {
      ...form.value,
      // Ensure birthdate is sent in the correct format for your API
      birthdate: form.value.birthdate
        ? dayjs(form.value.birthdate).format('YYYY-MM-DD')
        : null // Send null or empty string if not selected
    }

    // await store.updatePerson(payload.id, payload) // Pass ID and updated payload
    await store.updatePerson(payload) // Update the store with the new person data
    message.success('Person profile updated successfully!') // Use Ant Design message
    close() // Close modal and reset form
  } catch (err) {
    console.error('Failed to update person', err)
    message.error('Failed to update person: ' + (err.response?.data?.detail || err.message)) // More descriptive error
  } finally {
    saving.value = false // Reset loading state
  }
}
</script>

<template>
  <p>
    <span class="font-semibold text-base text-gray-500">
      Make changes to a person profile by completing the form below.<br />
    </span>
    <span class="text-gray-400 font-light">
      Note: Fields marked with * are required.
    </span>
  </p>
  <a-form layout="vertical" @submit.prevent="submitForm"> <a-alert v-if="formError" :message="errorMsg" type="error" show-icon class="mb-4" />

    <a-form-item label="Othername *">
      <a-input v-model:value="form.othername" :maxlength="25" @input="onOthernameInput" required />
    </a-form-item>

    <a-form-item label="Surname *">
      <a-input v-model:value="form.surname" :maxlength="25" @input="onSurnameInput" required />
    </a-form-item>

    <a-form-item label="Gender *">
      <a-select v-model:value="form.gender" placeholder="Select gender" required> <a-select-option value="Male">Male</a-select-option>
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
      <a-date-picker v-model:value="form.birthdate" format="YYYY-MM-DD" value-format="YYYY-MM-DD" placeholder="Select birthdate"
        style="width: 100%" required /> </a-form-item>

    <div class="flex justify-end gap-2">
      <a-button @click="close">Cancel</a-button>
      <a-button type="primary" html-type="submit" :loading="saving">Save Changes</a-button> </div>
  </a-form>
</template>
