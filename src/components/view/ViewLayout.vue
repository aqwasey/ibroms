<template>
  <div class="view-container">
    <!-- Header Section (Optional) -->
    <ViewHeader 
      v-if="showHeader"
      :title="title"
      :meta-items="metaItems"
      :header-class="headerClass"
    />

    <!-- Content Sections -->
    <div class="view-content">
      <slot />
    </div>
  </div>
</template>

<script setup>
import ViewHeader from './ViewHeader.vue'

defineProps({
  title: {
    type: String,
    default: ''
  },
  metaItems: {
    type: Array,
    default: () => []
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  headerClass: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.view-container {
  padding: 0.5rem;
}

/* Content Section */
.view-content {
  display: grid;
  gap: 1.5rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .view-container {
    padding: 0.25rem;
  }
  
  .view-content {
    gap: 1rem;
  }
}

/* Custom Scrollbar */
.view-container::-webkit-scrollbar {
  width: 8px;
}

.view-container::-webkit-scrollbar-track {
  background: #F7F8FA;
  border-radius: 4px;
}

.view-container::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #CF7F08 0%, #A66500 100%);
  border-radius: 4px;
}

.view-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #A66500 0%, #CF7F08 100%);
}
</style>
