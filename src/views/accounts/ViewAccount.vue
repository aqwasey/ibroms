<template>
  <ViewModal
    :show="show"
    @update:show="$emit('update:show', $event)"
    title="View Account"
  >
    <template v-if="account">
      <ViewField label="Bank Name" :value="account.bank_name" />
      <ViewField label="Account No" :value="account.account_no" />
      <ViewField label="Account Type" :value="account.account_type" />
      <ViewField label="Email" :value="account.email" />
      <ViewField label="Purpose" :value="account.purpose" />
    </template>
  </ViewModal>
</template>

<script setup>
import ViewModal from '@/components/ViewModal.vue'
import ViewField from '@/components/ViewField.vue'

const props = defineProps({
  account: {
    type: Object,
    required: true
  },
  show: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close', 'update:show'])
</script>


