<template>
  <ViewModal :show="show" @update:show="$emit('update:show', $event)" title="View Notification">
    <ViewField label="Title" :value="notify.title" />
    <ViewField label="Description" :value="notify.description" />
    <ViewField label="Message Templates" :value="notify.message_templates ? notify.message_templates.join(', ') : 'None'" />
    <ViewField label="Begin Date" :value="formatDate(notify.begin)" />
    <ViewField label="End Date" :value="formatDate(notify.end)" />
    <ViewField label="Schedule" :value="notify.schedule" />
  </ViewModal>
</template>
<script setup>
import { defineProps, defineEmits } from 'vue'
import ViewModal from '@/components/ViewModal.vue'
import ViewField from '@/components/ViewField.vue'

const props = defineProps({ 
  show: { type: Boolean, default: false }, 
  notify: { type: Object, required: true } 
})

defineEmits(['update:show'])

// Format date for better readability
const formatDate = (dateString) => {
  if (!dateString) return 'Not set';
  try {
    const date = new Date(dateString);
    return date.toLocaleString();
  } catch (e) {
    return dateString;
  }
}
</script>