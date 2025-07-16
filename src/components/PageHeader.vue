<template>
  <div class="page-header">
    <div class="header-left">
      <TitleLabel :title="title" :subtitle="subtitle" />
    </div>

    <div class="actions">
      <ShareExportIcons 
        v-if="showShareExport" 
        @share="$emit('share', $event)" 
        @export="$emit('export', $event)" 
      />
      
      <SearchInput
        v-if="showSearch"
        :placeholder="searchPlaceholder"
        @search="$emit('search', $event)"
      />

      <ButtonBase
        v-if="showButton"
        :label="buttonText"
        :variant="buttonVariant === 'primary' ? 'add' : buttonVariant"
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
import ShareExportIcons from './ShareExportIcons.vue';

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
  
  // Share/Export icons props
  showShareExport: {
    type: Boolean,
    default: true
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

defineEmits(['search', 'buttonClick', 'share', 'export']);
</script>

<style scoped>
.page-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 16px 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.actions {
  align-items: center; /* Changed from flex-start to center for vertical alignment */
  display: inline-flex;
  flex: 0 0 auto;
  gap: 15px;
  height: 36px; /* Set fixed height for consistent alignment */
}
</style>
