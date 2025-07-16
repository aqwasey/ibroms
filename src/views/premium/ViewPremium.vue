<template>
  <ViewModal :show="show" @update:show="$emit('update:show', $event)" title="View Premium">
    <ViewField label="Policy NO" :value="premium.policyNo" />
    <ViewField label="Payment Option" :value="premium.paymentOption" />
    <ViewField label="Reason" :value="premium.reason" />
    <ViewField label="Amount" :value="premium.amount" />
  </ViewModal>
</template>
<script setup>
import { defineProps, defineEmits } from 'vue'
import ViewModal from '@/components/ViewModal.vue'
import ViewField from '@/components/ViewField.vue'
const props = defineProps({ show: { type: Boolean, default: false }, premium: { type: Object, required: true } })
defineEmits(['update:show'])
</script>
