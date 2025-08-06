<template>
  <Modal :show="show" :close="() => $emit('update:show', false)" title="Delete Rule" variant="delete" :loading="loading" showActions @confirm="handleConfirm" confirmButtonText="Delete">
    <p class="supporting-text">
      <span class="span">Are you sure you want to delete </span>
      <span class="text-wrapper-2">{{ ruleName }}</span>
      <span class="span">? It will be deleted permanently</span>
    </p>
  </Modal>
</template>
<script setup>
import { defineProps, defineEmits, ref } from 'vue'
import { useRulesStore } from '@/stores/rules'
import Modal from '@/components/Modal.vue'
const props = defineProps({ show: { type: Boolean, default: false }, itemId: { type: [String, Number], default: '' }, ruleName: { type: String, default: 'this rule' } })
const emit = defineEmits(['update:show', 'rule-deleted'])
const store = useRulesStore()
const loading = ref(false)
const handleConfirm = async () => {
  try {
    loading.value = true
    await store.deleteRule(props.itemId)
    // Success notification is handled by the store
    emit('rule-deleted', props.itemId)
    emit('update:show', false)
  } catch (error) {
    // Error notification is handled by the store
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>
<style scoped>
.supporting-text { align-self: stretch; color: var(--gray-500); font-family: "Inter-Regular", Helvetica; font-size: 16px; font-weight: 400; letter-spacing: 0; line-height: 24px; position: relative; }
.span { color: #667084; font-family: "Inter-Regular", Helvetica; font-size: 16px; font-weight: 400; letter-spacing: 0; line-height: 24px; }
.text-wrapper-2 { font-family: "Inter-Bold", Helvetica; font-weight: 700; }
</style>
