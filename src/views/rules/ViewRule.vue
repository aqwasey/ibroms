<template>
  <ViewModal :show="show" @update:show="$emit('update:show', $event)" title="View Rule">
    <ViewField label="Title" :value="rule.title" />
    <ViewField label="Description" :value="rule.description" />
    <ViewField label="Service List" :value="rule.service_list ? rule.service_list.join(', ') : 'None'" />
    <ViewField label="Limit Type" :value="rule.limit_type" />
  </ViewModal>
</template>
<script setup>
import { defineProps, defineEmits } from 'vue'
import ViewModal from '@/components/ViewModal.vue'
import ViewField from '@/components/ViewField.vue'

const props = defineProps({ 
  show: { type: Boolean, default: false }, 
  rule: { type: Object, required: true } 
})

defineEmits(['update:show'])
</script>