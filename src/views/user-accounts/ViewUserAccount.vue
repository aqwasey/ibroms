<template>
  <ViewModal
    :show="show"
    @update:show="$emit('update:show', $event)"
    title="User Account View"
  >
    <ViewField label="Full Name" :value="user.fullName" />
    <ViewField label="Email" :value="user.email" />
    <ViewField label="Service Provider" :value="user.serviceProvider" />
    <ViewField label="Access Level" :value="user.accessLevel" />
    <ViewField label="Permissions" :value="user.permissions" />
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
  user: {
    type: Object,
    default: () => ({})
  }
})

defineEmits(['update:show'])
</script>


