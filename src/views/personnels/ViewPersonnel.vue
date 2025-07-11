<template>
  <ViewModal
    :show="show"
    @update:show="$emit('update:show', $event)"
    title="Personnel View"
  >
    <ViewField label="Other Name(s)" :value="person.otherNames" />
    <ViewField label="Surname" :value="person.surname" />
    <ViewField label="Gender" :value="person.gender" />
    <ViewField label="Date of Birth" :value="person.dateOfBirth" />
    <ViewField label="ID Type" :value="person.idType" />
    <ViewField label="ID Number" :value="person.idNumber" />
  </ViewModal>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import ViewModal from '@/components/ViewModal.vue'
import ViewField from '@/components/ViewField.vue'

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

defineEmits(['update:show'])
</script>
