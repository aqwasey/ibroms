<template>
  <ViewModal
    :show="show"
    @update:show="$emit('update:show', $event)"
    title="View Underwriter"
  >
    <ViewField label="Title" :value="underwriter.name" />
    <ViewField label="Sector" :value="underwriter.sector" />
    <ViewField label="Province" :value="underwriter.province" />
    <ViewField label="Town/City" :value="underwriter.town_city" />
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
  underwriter: {
    type: Object,
    required: true
  }
})

defineEmits(['update:show'])
</script>
