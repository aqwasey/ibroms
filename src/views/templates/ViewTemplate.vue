<template>
  <ViewModal :show="show" @update:show="$emit('update:show', $event)" title="View Template">
    <ViewField label="Title" :value="template.title" />
    <ViewField label="Category" :value="template.category" />
    <ViewField label="Template Type" :value="template.template_type" />
    <ViewField label="Parameters" :value="template.params_list ? template.params_list.join(', ') : 'None'" />
    <ViewField label="Template Content" :value="template.template" />
  </ViewModal>
</template>
<script setup>
import { defineProps, defineEmits } from 'vue'
import ViewModal from '@/components/ViewModal.vue'
import ViewField from '@/components/ViewField.vue'
const props = defineProps({ show: { type: Boolean, default: false }, template: { type: Object, required: true } })
defineEmits(['update:show'])
</script>