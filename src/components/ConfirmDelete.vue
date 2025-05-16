<template>
  <Modal
    :show="show"
    :loading="loading"
    :title="'Delete ' + title"
    :close="handleClose">
    <div>
      <p class="text-i-gray-500 text-base mb-5">{{ text }}</p>

      <div class="flex justify-end gap-3 mt-5">
        <button @click="handleClose" class="btn-light">
          Cancel
        </button>
        <button @click="deleteItem" class="btn-primary">Delete</button>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import Modal from '@/components/Modal.vue'
import { defineEmits } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  text: {
    type: String,
    default: ''
  },
  itemId: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['update:show', 'delete-item'])

const handleClose = () => {
  emit('update:show', false)
}

const deleteItem = () => {
  emit('delete-item', props.itemId)
  // handleClose()
}
</script>
