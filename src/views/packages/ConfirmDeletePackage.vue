<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="Delete Package"
    variant="delete"
    :loading="packagesStore.saving"
    showActions
    @confirm="handleConfirm"
    confirmButtonText="Delete"
  >
    <p class="supporting-text">
      <span class="span">Are you sure you want to delete </span>
      <span class="text-wrapper-2">{{ packageName }}</span>
      <span class="span">? It will be deleted permanently</span>
    </p>
  </Modal>
</template>

<script setup>
import { defineProps, defineEmits, ref, inject } from 'vue'
import { usePackagesStore } from '@/stores/packages.js'
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
  packageName: {
    type: String,
    default: 'this package'
  }
})

const emit = defineEmits(['update:show', 'package-deleted'])

const packagesStore = usePackagesStore()
const messageApi = inject('messageApi')

const handleConfirm = async () => {
  try {
    // Delete the package
    await packagesStore.deletePackage(props.itemId)

    messageApi.success('Package deleted successfully!')
    emit('package-deleted', props.itemId)
    emit('update:show', false)
  } catch (error) {
    console.error('Error deleting package:', error)
    messageApi.error(error?.message || 'Failed to delete package')
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
