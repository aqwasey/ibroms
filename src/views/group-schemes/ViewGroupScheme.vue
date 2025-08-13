<template>
  <ViewModal
    :show="show"
    @update:show="$emit('update:show', $event)"
    title="View Group Scheme"
  >
    <ViewField label="Group Scheme Name" :value="groupScheme.name" />
    <ViewField label="Group Scheme Code" :value="groupScheme.code" />
    <ViewField label="Category" :value="groupScheme.category" />
    <ViewField label="Underwriter" :value="groupScheme.underwriter" />
    <ViewField label="Premium" :value="groupScheme.premium" />
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
  groupScheme: {
    type: Object,
    required: true
  }
})

defineEmits(['update:show'])
</script>
