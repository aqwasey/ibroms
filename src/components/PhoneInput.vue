<template>
  <div class="input-field-container">
    <label v-if="label" :for="uniqueId" class="input-label">{{ label }}</label>
    <div class="phone-input-container">
      <div class="country-code">
        <div class="flag">🇿🇦</div>
        <div class="code">+27</div>
      </div>
      <input
        :id="uniqueId"
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="phone-input"
      />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

// Generate a simple unique ID without external dependencies
const uniqueId = `phone-input-${Math.random().toString(36).substring(2, 10)}`;

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Enter phone number',
  },
  type: {
    type: String,
    default: 'tel',
  }
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
.input-field-container {
  margin-bottom: 16px;
}

.input-label {
  display: block;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: #344054;
  margin-bottom: 6px;
}

.phone-input-container {
  display: flex;
  width: 100%;
}

.country-code {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #F9FAFB;
  border: 1px solid #D0D5DD;
  border-right: none;
  border-radius: 8px 0 0 8px;
  padding: 0 10px;
  font-size: 14px;
  font-weight: 500;
  color: #344054;
  height: 44px;
  min-width: 80px;
}

.flag {
  font-size: 16px;
  margin-right: 6px;
}

.code {
  font-weight: 500;
}

.phone-input {
  flex-grow: 1;
  height: 44px;
  padding: 10px 14px;
  background-color: white;
  border: 1px solid #D0D5DD;
  box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
  border-radius: 0 8px 8px 0;
  font-size: 16px;
  color: #344054;
  width: 100%;
}

.phone-input:focus {
  outline: none;
  border-color: #CF7F07;
  box-shadow: 0px 0px 0px 4px rgba(207, 127, 7, 0.1);
}
</style>
