<template>
  <Modal :show="show" :close="() => $emit('update:show', false)" title="Delete Template" variant="delete" :loading="store.saving" showActions @confirm="handleConfirm" confirmButtonText="Delete">
    <p class="supporting-text">
      <span class="span">Are you sure you want to delete </span>
      <span class="text-wrapper-2">{{ templateName }}</span>
      <span class="span">? It will be deleted permanently</span>
    </p>
  </Modal>
</template>
<script setup>
import { defineProps, defineEmits, ref } from 'vue'
import { useTemplateStore } from '@/stores/templates'
import notificationService from '@/services/notificationService'
import Modal from '@/components/Modal.vue'
const props = defineProps({ show: { type: Boolean, default: false }, itemId: { type: [String, Number], default: '' }, templateName: { type: String, default: 'this template' } })
const emit = defineEmits(['update:show', 'template-deleted'])
const store = useTemplateStore()
const handleConfirm = async () => {
  try {
    await store.deleteTemplate(props.itemId)
    notificationService.success('Template deleted successfully')
    emit('template-deleted', props.itemId)
    emit('update:show', false)
  } catch (error) {
    console.error('Error deleting template:', error)
    const errorMessage = error?.response?.data?.info || error?.message || 'Error deleting template'
    notificationService.error(errorMessage)
  }
}
</script>
<style scoped>
.supporting-text { align-self: stretch; color: var(--gray-500); font-family: "Inter-Regular", Helvetica; font-size: 16px; font-weight: 400; letter-spacing: 0; line-height: 24px; position: relative; }
.span { color: #667084; font-family: "Inter-Regular", Helvetica; font-size: 16px; font-weight: 400; letter-spacing: 0; line-height: 24px; }
.text-wrapper-2 { font-family: "Inter-Bold", Helvetica; font-weight: 700; }
</style>