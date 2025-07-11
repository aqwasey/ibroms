<template>
  <ViewModal
    :show="show"
    @update:show="$emit('update:show', $event)"
    title="View Product"
  >
    <ViewField label="Product Name" :value="product.name" />
    <ViewField label="Product Code" :value="product.code" />
    <ViewField label="Category" :value="product.category" />
    <ViewField label="Underwriter" :value="product.underwriter" />
    <ViewField label="Premium" :value="product.premium" />
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
  product: {
    type: Object,
    required: true
  }
})

defineEmits(['update:show'])
</script>
