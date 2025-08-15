<template>
  <Modal :show="show" :close="() => $emit('update:show', false)" title="Delete Notification" variant="delete" :loading="store.saving" showActions @confirm="handleConfirm" confirmButtonText="Delete">
    <p class="supporting-text">
      <span class="span">Are you sure you want to delete </span>
      <span class="text-wrapper-2">{{ notifyName }}</span>
      <span class="span">? It will be deleted permanently</span>
    </p>
  </Modal>
</template>
<script setup>
import { defineProps, defineEmits, ref, inject } from 'vue'
import { useNotifyStore } from '@/stores/notify'
import Modal from '@/components/Modal.vue'
const props = defineProps({ show: { type: Boolean, default: false }, itemId: { type: [String, Number], default: '' }, notifyName: { type: String, default: 'this notification' } })
const emit = defineEmits(['update:show', 'notify-deleted'])
const store = useNotifyStore()
const messageApi = inject('messageApi')

const handleConfirm = async () => {
  try {
    await store.deleteNotification(props.itemId)
    messageApi.success('Notification deleted successfully')
    emit('notify-deleted', props.itemId)
    emit('update:show', false)
  } catch (error) {
    console.error(error)
    messageApi.error(error?.message || 'Error deleting notification')
  }
}
</script>
<style scoped>
.supporting-text { align-self: stretch; color: var(--gray-500); font-family: "Inter-Regular", Helvetica; font-size: 16px; font-weight: 400; letter-spacing: 0; line-height: 24px; position: relative; }
.span { color: #667084; font-family: "Inter-Regular", Helvetica; font-size: 16px; font-weight: 400; letter-spacing: 0; line-height: 24px; }
.text-wrapper-2 { font-family: "Inter-Bold", Helvetica; font-weight: 700; }
</style>
