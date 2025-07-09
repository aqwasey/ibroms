<template>
  <Modal
    :show="show"
    :loading="loading"
    :title="'Delete ' + title"
    :close="handleClose"
    variant="delete"
    :showActions="false"
  >
    <div class="text-and-supporting">
      <p class="supporting-text">
        <span class="span">Are you sure you want to delete </span>
        <span class="text-wrapper-2">{{ title }}</span>
        <span class="span">? {{ text }}</span>
      </p>
    </div>
    <div class="modal-actions">
      <ButtonBase 
        @click="handleClose" 
        label="Cancel" 
        variant="secondary" 
      />
      <ButtonBase 
        @click="deleteItem" 
        label="Delete" 
        variant="primary" 
        :style="{ backgroundColor: colors.DANGER, borderColor: colors.DANGER }" 
      />
    </div>
  </Modal>
</template>

<script setup>
import Modal from '@/components/Modal.vue'
import ButtonBase from '@/components/ButtonBase.vue'
import { defineEmits } from 'vue'
import { COLORS as colors } from '@/constants/colors'

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
    default: 'It will be deleted permanently'
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

<style scoped>
.modal-content {
  align-items: center;
  align-self: stretch;
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  gap: 20px;
  position: relative;
  width: 100%;
}

.text-and-supporting {
  align-items: flex-start;
  align-self: stretch;
  display: flex;
  flex: 0 0 auto;
  gap: 8px;
  justify-content: center;
  position: relative;
  width: 100%;
}

.supporting-text {
  align-self: stretch;
  color: var(--gray-500);
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 24px;
  position: relative;
}

.span {
  color: #667084;
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 24px;
}

.text-wrapper-2 {
  font-weight: 700;
}

.modal-actions {
  align-items: flex-start;
  align-self: stretch;
  display: flex;
  flex: 0 0 auto;
  gap: 12px;
  justify-content: flex-end;
  position: relative;
  width: 100%;
  margin-top: 16px;
}
</style>
