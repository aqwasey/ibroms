<template>
  <div class="view-header" :class="headerClass">
    <div class="header-info">
      <h2 class="header-title">{{ title }}</h2>
      <div class="header-meta" v-if="metaItems.length > 0">
        <component
          v-for="(item, index) in metaItems"
          :key="index"
          :is="item.component || 'span'"
          :class="item.class"
          v-bind="item.props || {}"
        >
          {{ item.text }}
        </component>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  metaItems: {
    type: Array,
    default: () => []
  },
  headerClass: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
/* Header Section */
.view-header {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #CF7F08 0%, #A66500 100%);
  border-radius: 1rem;
  color: white;
}

.header-info {
  text-align: center;
}

.header-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-meta {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

/* Status Indicators */
:deep(.status-indicator) {
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

:deep(.status-indicator.active) {
  background-color: rgba(39, 174, 96, 0.2);
  color: #dcfce7;
  border: 1px solid rgba(39, 174, 96, 0.3);
}

:deep(.status-indicator.inactive) {
  background-color: rgba(234, 84, 85, 0.2);
  color: #fecaca;
  border: 1px solid rgba(234, 84, 85, 0.3);
}

:deep(.meta-tag) {
  padding: 0.5rem 1rem;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* Responsive Design */
@media (max-width: 768px) {
  .view-header {
    padding: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .header-title {
    font-size: 1.5rem;
  }
  
  .header-meta {
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }
}
</style>
