<template>
  <ViewModal
    :show="show"
    @update:show="$emit('update:show', $event)"
    title="View Package"
  >
    <ViewField label="Title" :value="package.title" />
    <ViewField label="Age Begin" :value="package.ageBegin" />
    <ViewField label="Age End" :value="package.ageEnd" />
    <ViewField label="Relationship" :value="package.relationship" />
    <ViewField label="Price" :value="package.price" />
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
  package: {
    type: Object,
    required: true
  }
})

defineEmits(['update:show'])
</script>
