<template>
  <ViewModal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="View Policy"
  >
    <div class="w-full flex flex-col gap-4">
      <ViewField
        label="Other Name(s)"
        :value="policyData.otherNames"
      />

      <ViewField
        label="Surname"
        :value="policyData.surname"
      />

      <ViewField
        label="Gender"
        :value="policyData.gender"
      />

      <ViewField
        label="Date of Birth"
        :value="policyData.dateOfBirth"
      />

      <ViewField
        label="ID Type"
        :value="policyData.idType"
      />

      <ViewField
        label="ID Number"
        :value="policyData.idNumber"
      />
    </div>
  </ViewModal>
</template>

<script setup>
import { ref, reactive, defineProps, defineEmits, watchEffect, inject } from 'vue'
import ViewModal from '@/components/ViewModal.vue'
import ViewField from '@/components/ViewField.vue'
import { usePolicyStore } from '@/stores/policy.js'

const props = defineProps({
  show: Boolean,
  policyId: String
})

const emit = defineEmits(['update:show'])
const policyStore = usePolicyStore()
const messageApi = inject('messageApi')

const loading = ref(false)
const policyData = reactive({
  otherNames: '',
  surname: '',
  gender: '',
  dateOfBirth: '',
  idType: '',
  idNumber: ''
})

watchEffect(async () => {
  if (props.show && props.policyId) {
    await fetchPolicyData()
  }
})

const fetchPolicyData = async () => {
  loading.value = true
  try {
    const policy = await policyStore.fetchPolicyById(props.policyId)
    policyData.otherNames = policy.otherNames
    policyData.surname = policy.surname
    policyData.gender = policy.gender
    policyData.dateOfBirth = policy.dateOfBirth
    policyData.idType = policy.idType
    policyData.idNumber = policy.idNumber
  } catch (error) {
    messageApi.error('Failed to fetch policy data')
  } finally {
    loading.value = false
  }
}
</script>
