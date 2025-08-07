<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="Template Details"
    variant="view"
    :showActions="false"
  >
    <ViewLayout
      :title="template.title"
      :meta-items="metaItems"
    >
      <!-- Basic Information Card -->
      <InfoCard title="Template Information" :icon="CARD_ICONS.DOCUMENT">
        <InfoGrid>
          <InfoItem label="Title" :value="template.title" />
          <InfoItem label="Category" :value="template.category" />
          <InfoItem label="Template Type" :value="template.template_type?.toUpperCase()" />
          <InfoItem label="Status" :value="template.active ? 'Active' : 'Inactive'" />
          <InfoItem 
            v-if="template.template" 
            label="Template Content" 
            :value="template.template" 
            :full-width="true"
            :is-description="true"
          />
        </InfoGrid>
      </InfoCard>

      <!-- Parameters Card -->
      <InfoCard title="Parameters" :icon="CARD_ICONS.SETTINGS" v-if="template.params_list && template.params_list.length > 0">
        <InfoGrid>
          <InfoItem 
            label="Available Parameters" 
            :value="template.params_list" 
            :full-width="true"
          />
        </InfoGrid>
      </InfoCard>

      <!-- System Information Card -->
      <InfoCard title="System Information" :icon="CARD_ICONS.TIME" v-if="template.updated_on">
        <InfoGrid>
          <InfoItem 
            label="Last Updated" 
            :value="template.updated_on" 
            :formatter="formatDate" 
          />
        </InfoGrid>
      </InfoCard>
    </ViewLayout>
  </Modal>
</template>
<script setup>
import { computed } from 'vue'
import Modal from '@/components/Modal.vue'
import { ViewLayout, InfoCard, InfoGrid, InfoItem, CARD_ICONS } from '@/components/view'

const props = defineProps({ 
  show: { type: Boolean, default: false }, 
  template: { type: Object, required: true } 
})

defineEmits(['update:show'])

// Meta items for the header
const metaItems = computed(() => [
  { label: 'Category', value: props.template.category },
  { label: 'Type', value: props.template.template_type?.toUpperCase() }
])

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return 'Invalid Date'
  }
}
</script>
