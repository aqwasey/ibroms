<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="Edit Person"
    variant="edit"
    :loading="loading"
    showActions
    @confirm="handleSubmit"
    confirmButtonText="Save Changes"
  >
    <div class="w-full flex flex-col gap-4">
      <InputField
        v-model="formData.otherNames"
        label="Other Name(s)"
        placeholder="Enter other names"
        validation-type="text"
        :validation-options="{ maxLength: 100 }"
        class="w-full"
      />

      <InputField
        v-model="formData.surname"
        label="Surname"
        placeholder="Enter surname"
        validation-type="text"
        :validation-options="{ maxLength: 50 }"
        class="w-full"
      />

      <SelectField
        v-model="formData.gender"
        label="Gender"
        placeholder="Select gender"
        :options="genderOptions"
        class="w-full"
      />

      <InputField
        v-model="formData.dateOfBirth"
        label="Date of Birth"
        placeholder="DD/MM/YYYY"
        type="date"
        class="w-full"
      />

      <SelectField
        v-model="formData.idType"
        label="ID Type"
        placeholder="Select ID type"
        :options="idTypeOptions"
        class="w-full"
      />

      <InputField
        v-model="formData.idNumber"
        label="ID Number"
        placeholder="Enter ID number"
        validation-type="text"
        :validation-options="{ maxLength: 20 }"
        class="w-full"
      />
    </div>
  </Modal>
</template>

<script setup>
import { ref, reactive, defineProps, defineEmits, inject, watch } from 'vue'
import Modal from '@/components/Modal.vue'
import InputField from '@/components/InputField.vue'
import SelectField from '@/components/SelectField.vue'
import { usePeopleStore } from '@/stores/people.js'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  person: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:show', 'person-updated'])

// Store and services
const store = usePeopleStore()
const messageApi = inject('messageApi')

// Form data and state
const loading = ref(false)
const formData = reactive({
  id: '',
  otherNames: '',
  surname: '',
  gender: '',
  dateOfBirth: '',
  idType: '',
  idNumber: ''
})

// Options for select fields
const genderOptions = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' }
]

const idTypeOptions = [
  { value: 'Passport', label: 'Passport' },
  { value: 'National ID', label: 'National ID' },
  { value: 'Driver\'s License', label: 'Driver\'s License' },
  { value: 'Other', label: 'Other' }
]

// Watch for changes to props.person and update form data
watch(() => props.person, (newPerson) => {
  if (newPerson) {
    Object.keys(formData).forEach(key => {
      if (newPerson[key] !== undefined) {
        formData[key] = newPerson[key]
      }
    })
  }
}, { immediate: true, deep: true })

// Form submission
const handleSubmit = async () => {
  try {
    loading.value = true

    // Update Person
    await store.updatePerson(formData)

    messageApi.success('Person updated successfully')
    emit('person-updated')
    emit('update:show', false)
  } catch (error) {
    console.error(error)
    messageApi.error(error?.response?.data?.info ?? 'Error updating Person')
  } finally {
    loading.value = false
  }
}
</script>
