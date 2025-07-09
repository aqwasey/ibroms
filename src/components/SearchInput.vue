<template>
  <div class="input-dropdown">
    <div class="search-wrapper" :style="{ borderColor: colors.BORDER }">
      <div class="search-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
      <input 
        type="search" 
        :placeholder="placeholder" 
        class="search-input" 
        v-model="searchValue"
        @input="onInput"
        :style="{ color: colors.TEXT_PRIMARY }"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { COLORS } from '@/constants/colors';

const colors = COLORS;
const searchValue = ref('');

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Search'
  }
});

const emit = defineEmits(['update:modelValue', 'search']);

const onInput = () => {
  emit('update:modelValue', searchValue.value);
  emit('search', searchValue.value);
};
</script>

<style scoped>
.input-dropdown {
  position: relative;
  width: 360px;
  height: 44px;
}

.search-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  border: 1px solid;
  border-radius: 8px;
  background-color: white;
  padding: 0 12px;
}

.search-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: v-bind('colors.TEXT_SECONDARY');
}

.icon {
  width: 20px;
  height: 20px;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  padding: 10px;
  font-size: 16px;
  width: calc(100% - 40px);
}

.search-input::placeholder {
  color: v-bind('colors.TEXT_SECONDARY');
}
</style>
