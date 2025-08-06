<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="Delete Underwriter"
    variant="delete"
    :loading="loading"
    showActions
    @confirm="handleConfirm"
    confirmButtonText="Delete"
  >
    <p class="supporting-text">
      <span class="span">Are you sure you want to delete </span>
      <span class="text-wrapper-2">{{ underwriterName }}</span>
      <span class="span">? It will be deleted permanently</span>
    </p>
  </Modal>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue'
import { useUnderwritersStore } from '@/stores/underwriters'
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
  underwriterName: {
    type: String,
    default: 'this underwriter'
  }
})

const emit = defineEmits(['update:show', 'underwriter-deleted'])

const store = useUnderwritersStore()
const loading = ref(false)

const handleConfirm = async () => {
  try {
    loading.value = true

    // Delete the underwriter
    await store.deleteUnderwriter(props.itemId)

    // Success notification is handled by the store
    emit('underwriter-deleted', props.itemId)
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
