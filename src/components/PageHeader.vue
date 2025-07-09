<template>
  <div class="page-header">
    <TitleLabel :title="title" :subtitle="subtitle" />
    
    <div class="actions">
      <SearchInput 
        v-if="showSearch" 
        :placeholder="searchPlaceholder" 
        @search="$emit('search', $event)"
      />
      
      <ButtonBase
        v-if="showButton"
        :text="buttonText"
        :variant="buttonVariant"
        :icon="buttonIcon"
        :iconComponent="buttonIconComponent"
        @click="$emit('buttonClick', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { Plus } from 'lucide-vue-next';
import TitleLabel from './TitleLabel.vue';
import SearchInput from './SearchInput.vue';
import ButtonBase from './ButtonBase.vue';

defineProps({
  // Title section props
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  
  // Search props
  showSearch: {
    type: Boolean,
    default: true
  },
  searchPlaceholder: {
    type: String,
    default: 'Search'
  },
  
  // Button props
  showButton: {
    type: Boolean,
    default: true
  },
  buttonText: {
    type: String,
    default: 'New'
  },
  buttonVariant: {
    type: String,
    default: 'primary'
  },
  buttonIcon: {
    type: String,
    default: 'leading'
  },
  buttonIconComponent: {
    type: Object,
    default: () => Plus
  }
});

defineEmits(['search', 'buttonClick']);
</script>

<style scoped>
.page-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 16px 0;
}

.actions {
  align-items: flex-start;
  display: inline-flex;
  flex: 0 0 auto;
  gap: 15px;
}
</style>
