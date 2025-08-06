<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="View Rule"
    variant="view"
    :showActions="false"
  >
    <ViewLayout
      :title="rule.title"
      :meta-items="metaItems"
    >
      <!-- Basic Information Card -->
      <InfoCard title="Rule Information" :icon="CARD_ICONS.DOCUMENT">
        <InfoGrid>
          <InfoItem label="Title" :value="rule.title" />
          <InfoItem label="Limit Type" :value="rule.limit_type" />
          <InfoItem 
            v-if="rule.description"
            label="Description" 
            :value="rule.description" 
            :full-width="true"
            :is-description="true"
          />
        </InfoGrid>
      </InfoCard>

      <!-- Services Information Card -->
      <InfoCard title="Services" :icon="CARD_ICONS.SETTINGS" v-if="rule.service_list && rule.service_list.length > 0">
        <InfoGrid>
          <InfoItem 
            label="Service List" 
            :value="rule.service_list" 
            :full-width="true"
          />
        </InfoGrid>
      </InfoCard>

      <!-- System Information Card -->
      <InfoCard title="System Information" :icon="CARD_ICONS.TIME" v-if="rule.created_on">
        <InfoGrid>
          <InfoItem label="Created On" :value="rule.created_on" :formatter="formatDate" />
          <InfoItem 
            v-if="rule.updated_on" 
            label="Last Updated" 
            :value="rule.updated_on" 
            :formatter="formatDate" 
          />
        </InfoGrid>
      </InfoCard>
    </ViewLayout>
  </Modal>
</template>
<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import Modal from '@/components/Modal.vue'
import { 
  ViewLayout, 
  InfoCard, 
  InfoGrid, 
  InfoItem,
  CARD_ICONS,
  formatDate
} from '@/components/view'

const props = defineProps({ 
  show: { type: Boolean, default: false }, 
  rule: { type: Object, required: true } 
})

defineEmits(['update:show'])

// Meta items for header
const metaItems = computed(() => {
  const items = []
  
  if (props.rule.limit_type) {
    items.push({
      text: props.rule.limit_type,
      class: 'meta-tag'
    })
  }
  
  if (props.rule.service_list && props.rule.service_list.length > 0) {
    items.push({
      text: `${props.rule.service_list.length} Service${props.rule.service_list.length !== 1 ? 's' : ''}`,
      class: 'meta-tag'
    })
  }
  
  return items
})
</script>