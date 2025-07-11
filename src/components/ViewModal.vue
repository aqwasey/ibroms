<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    :title="title"
    variant="view"
    :showActions="false"
  >
    <div class="flex flex-col gap-4 w-full">
      <slot></slot>
    </div>
  </Modal>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import Modal from '@/components/Modal.vue'

defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'View Details'
  }
})

defineEmits(['update:show'])
</script>
