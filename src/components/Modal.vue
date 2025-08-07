<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-5" style="background-color: #00000066;">
    <div
      class="modal-container bg-white rounded-lg shadow-lg w-full"
      :class="{
        'max-w-md': variant === 'default',
        'max-w-lg': variant === 'edit' || variant === 'view' || variant === 'create',
        'max-w-sm': variant === 'delete'
      }"
    >
      <a-spin :spinning="loading" tip="Please wait..." class="modal-spinner">
        <div class="modal-header flex items-center justify-between px-6 py-4 border-b" :style="{ borderColor: colors.BORDER }">
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

        <div class="modal-content px-6 py-4 overflow-y-auto">
          <slot />
        </div>

        <div v-if="(variant === 'delete' && showActions !== false) || showActions" class="modal-actions flex justify-end items-center px-6 py-4 gap-3 border-t" :style="{ borderColor: colors.BORDER }">
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
    validator: (value) => ['default', 'edit', 'view', 'delete', 'create'].includes(value)
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
  max-height: 90vh;
}

.close-button:hover {
  background-color: rgba(0, 0, 0, 0.05) !important;
}

/* Make sure the spinner container takes full height */
:deep(.modal-spinner) {
  height: 100%;
}

/* Ensure the spin container takes full height and is a flex container */
:deep(.modal-spinner .ant-spin-container) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Header is fixed at top */
.modal-header {
  flex-shrink: 0;
}

/* Content area is scrollable */
.modal-content {
  flex: 1;
  overflow-y: auto;
  max-height: calc(90vh - 140px); /* Adjust based on header/footer height */
}

/* Footer actions are fixed at bottom */
.modal-actions {
  flex-shrink: 0;
}
</style>
