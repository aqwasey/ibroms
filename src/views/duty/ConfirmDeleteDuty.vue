<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="Delete Duty"
    variant="delete"
    :loading="dutyStore.saving"
    showActions
    @confirm="handleConfirm"
    confirmButtonText="Delete"
  >
    <p class="supporting-text">
      <span class="span">Are you sure you want to delete </span>
      <span class="text-wrapper-2">{{ dutyTitle }}</span>
      <span class="span">? It will be deleted permanently</span>
    </p>
  </Modal>
</template>

<script setup>
import { defineProps, defineEmits, inject } from 'vue'
import { useDutyStore } from '@/stores/duty'
import Modal from '@/components/Modal.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  itemId: {
    type: [String, Number],
    default: ''
  },
  dutyTitle: {
    type: String,
    default: 'this duty'
  }
})

const emit = defineEmits(['update:show', 'duty-deleted'])

const dutyStore = useDutyStore()
const messageApi = inject('messageApi')

const handleConfirm = async () => {
  try {
    // Delete the duty
    await dutyStore.deleteDuty(props.itemId)

    messageApi.success('Duty deleted successfully!')
    emit('duty-deleted', props.itemId)
    emit('update:show', false)
  } catch (error) {
    console.error('Error deleting duty:', error)
    messageApi.error(error?.message || 'Failed to delete duty')
  }
}
</script>

<style scoped>
.supporting-text {
  align-self: stretch;
  color: var(--gray-500);
  font-family: "Inter-Regular", Helvetica;
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 24px;
  position: relative;
}

.span {
  color: #667084;
  font-family: "Inter-Regular", Helvetica;
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 24px;
}

.text-wrapper-2 {
  font-family: "Inter-Bold", Helvetica;
  font-weight: 700;
}
</style>
