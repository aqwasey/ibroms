<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-5" style="background-color: #00000066;">
    <div 
      class="modal-container bg-white rounded-lg shadow-lg w-full overflow-hidden" 
      :class="{
        'max-w-md': variant === 'default',
        'max-w-lg': variant === 'edit' || variant === 'view',
        'max-w-sm': variant === 'delete'
      }"
    >
      <a-spin :spinning="loading" tip="Please wait...">
        <!-- Modal Header -->
        <div class="flex items-center justify-between px-6 py-4" :style="{ borderColor: colors.BORDER }">
          <h2 v-if="title" class="text-lg font-medium flex-1" :style="{ color: colors.TEXT_PRIMARY }">{{ title }}</h2>
          <button 
            @click="close"
            class="close-button p-2 rounded-full flex items-center justify-center"
            :style="{
              backgroundColor: 'transparent',
              color: colors.TEXT_SECONDARY,
              border: 'none',
            }">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Modal Content -->
        <div class="px-6 py-4">
          <slot />
        </div>

        <!-- Modal Actions (for delete variant or when actions are provided) -->
        <div v-if="variant === 'delete' || showActions" class="flex justify-end items-center px-6 py-4 gap-3 border-t" :style="{ borderColor: colors.BORDER }">
          <ButtonBase 
            v-if="showCancelButton" 
            label="Cancel"
            variant="secondary"
            @click="close"
          />
          <ButtonBase 
            v-if="showConfirmButton"
            :label="confirmButtonText" 
            :variant="confirmButtonVariant"
            :disabled="confirmButtonDisabled"
            @click="$emit('confirm')" 
          />
        </div>
      </a-spin>
    </div>
  </div>
</template>

<script setup>
import { COLORS } from '@/constants/colors'
import ButtonBase from '@/components/ButtonBase.vue'

const colors = COLORS

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  close: {
    type: Function,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'edit', 'view', 'delete'].includes(value)
  },
  showActions: {
    type: Boolean,
    default: false
  },
  showCancelButton: {
    type: Boolean,
    default: true
  },
  showConfirmButton: {
    type: Boolean,
    default: true
  },
  confirmButtonText: {
    type: String,
    default: 'Save Changes'
  },
  confirmButtonVariant: {
    type: String,
    default: 'primary'
  },
  confirmButtonDisabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['confirm'])

</script>

<style scoped>
.modal-container {
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.close-button:hover {
  background-color: rgba(0, 0, 0, 0.05) !important;
}

/* When the modal has a scrollable content, ensure proper layout */
:deep(.ant-spin-container) {
  display: flex;
  flex-direction: column;
}

/* Modal content should be scrollable if too tall */
:deep(.ant-spin-container > div:nth-child(2)) {
  overflow-y: auto;
  max-height: calc(80vh - 120px); /* Account for header and actions */
}
</style>
