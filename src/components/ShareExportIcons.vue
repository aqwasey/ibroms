<template>
  <div class="icon-container">
    <button class="icon-button" @click="$emit('share')" title="Share">
      <img src="../assets/icons/share.svg" alt="Share" />
    </button>
    <button class="icon-button" @click="$emit('export')" title="Export">
      <img src="../assets/icons/export.svg" alt="Export" />
    </button>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue';

defineEmits(['share', 'export']);
</script>

<style scoped>
.icon-container {
  display: flex;
  gap: 8px;
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.icon-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.icon-button img {
  width: 20px;
  height: 20px;
}
</style>
