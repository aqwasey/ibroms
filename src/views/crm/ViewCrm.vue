<template>
  <ViewModal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="View CRM"
    variant="view"
  >
    <div class="grid grid-cols-1 gap-4">
      <ViewField label="Other Name(s)" :value="crm?.otherNames" />
      <ViewField label="Surname" :value="crm?.surname" />
      <ViewField label="Gender" :value="crm?.gender" />
      <ViewField label="Date of Birth" :value="crm?.dateOfBirth" />
      <ViewField label="ID Type" :value="crm?.idType" />
      <ViewField label="ID Number" :value="crm?.idNumber" />
    </div>
  </ViewModal>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import ViewModal from '@/components/ViewModal.vue'
import ViewField from '@/components/ViewField.vue'

defineProps({
  show: {
    type: Boolean,
    default: false
  },
  crm: {
    type: Object,
    default: () => ({})
  }
})

defineEmits(['update:show'])
</script>
