<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="Add Policy"
    @save="handleSubmit"
  >
    <div class="w-full flex flex-col gap-4">
      <InputField
        v-model="formData.otherNames"
        label="Other Name(s)"
        placeholder="Enter other names"
        class="w-full"
      />

      <InputField
        v-model="formData.surname"
        label="Surname"
        placeholder="Enter surname"
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
        class="w-full"
      />
    </div>
  </Modal>
</template>

<script setup>
import { ref, reactive, defineProps, defineEmits, inject } from 'vue'
import Modal from '@/components/Modal.vue'
import InputField from '@/components/InputField.vue'
import SelectField from '@/components/SelectField.vue'
import { usePolicyStore } from '@/stores/policy.js'

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['update:show', 'policy-added'])
const policyStore = usePolicyStore()
const messageApi = inject('messageApi')

const formData = reactive({
  otherNames: '',
  surname: '',
  gender: '',
  dateOfBirth: '',
  idType: '',
  idNumber: ''
})

const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' }
]

const idTypeOptions = [
  { label: 'National ID', value: 'national_id' },
  { label: 'Passport', value: 'passport' },
  { label: 'Driver\'s License', value: 'drivers_license' }
]

const loading = ref(false)

const handleSubmit = async () => {
  loading.value = true
  try {
    await policyStore.createPolicy(formData)
    emit('policy-added')
    resetForm()
    messageApi.success('Policy created successfully')
  } catch (error) {
    messageApi.error('Failed to add policy')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  formData.otherNames = ''
  formData.surname = ''
  formData.gender = ''
  formData.dateOfBirth = ''
  formData.idType = ''
  formData.idNumber = ''
}
</script>