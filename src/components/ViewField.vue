<template>
  <div class="view-field-wrapper">
    <div class="view-field-label" :style="{ color: colors.TEXT_PRIMARY }">{{ label }}</div>
    <div class="view-field-value" 
      :style="{ 
        borderColor: colors.BORDER_LIGHT,
        backgroundColor: colors.WHITE,
        boxShadow: 'var(--shadow-xs)'
      }">
      <div class="view-field-content">
        <div class="view-field-text" :style="{ color: colors.TEXT_PRIMARY }">
          <slot>{{ value }}</slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { COLORS } from '@/constants/colors';

const colors = COLORS;

defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number, Boolean],
    default: ''
  }
});
</script>

<style scoped>
.view-field-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.view-field-label {
  font-family: var(--text-sm-medium-font-family, sans-serif);
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  margin-top: -1px;
  white-space: nowrap;
}

.view-field-value {
  align-items: center;
  align-self: stretch;
  border: 1px solid;
  border-radius: 8px;
  display: flex;
  padding: 10px 14px;
  position: relative;
  width: 100%;
}

.view-field-content {
  align-items: center;
  display: flex;
  flex: 1;
  gap: 8px;
  position: relative;
}

.view-field-text {
  font-size: 15px;
  line-height: 22px;
  width: 100%;
}
</style>
