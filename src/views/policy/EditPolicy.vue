<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="Edit Policy"
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
import { ref, reactive, defineProps, defineEmits, onMounted, watchEffect, inject } from 'vue'
import Modal from '@/components/Modal.vue'
import InputField from '@/components/InputField.vue'
import SelectField from '@/components/SelectField.vue'
import { usePolicyStore } from '@/stores/policy.js'

const props = defineProps({
  show: Boolean,
  policyId: String
})

const emit = defineEmits(['update:show', 'policy-updated'])
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

watchEffect(async () => {
  if (props.show && props.policyId) {
    await fetchPolicyData()
  }
})

const fetchPolicyData = async () => {
  loading.value = true
  try {
    const policy = await policyStore.fetchPolicyById(props.policyId)
    formData.otherNames = policy.otherNames
    formData.surname = policy.surname
    formData.gender = policy.gender
    formData.dateOfBirth = policy.dateOfBirth
    formData.idType = policy.idType
    formData.idNumber = policy.idNumber
  } catch (error) {
    messageApi.error('Failed to fetch policy data')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  loading.value = true
  try {
    await policyStore.updatePolicy(props.policyId, formData)
    emit('policy-updated')
    messageApi.success('Policy updated successfully')
  } catch (error) {
    messageApi.error('Failed to update policy')
  } finally {
    loading.value = false
  }
}
</script>
