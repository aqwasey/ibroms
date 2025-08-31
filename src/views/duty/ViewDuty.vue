<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="Duty Details"
    variant="view"
    :showActions="false"
    :loading="loading"
  >
    <ViewLayout
      :title="duty.title"
      :meta-items="metaItems"
    >
      <!-- Duty Information Card -->
      <InfoCard title="Duty Information" :icon="CARD_ICONS.DOCUMENT">
        <InfoGrid>
          <InfoItem label="Title" :value="duty.title" />
          <InfoItem 
            v-if="duty.description" 
            label="Description" 
            :value="duty.description" 
            :full-width="true"
          />
          <InfoItem 
            v-if="duty.notes" 
            label="Notes" 
            :value="duty.notes" 
            :full-width="true"
          />
        </InfoGrid>
      </InfoCard>

      <!-- System Information Card -->
      <InfoCard title="System Information" :icon="CARD_ICONS.TIME" v-if="duty.created_on || duty.updated_on">
        <InfoGrid>
          <InfoItem 
            v-if="duty.created_on" 
            label="Created On" 
            :value="duty.created_on" 
            :formatter="formatDate" 
          />
          <InfoItem 
            v-if="duty.updated_on" 
            label="Last Updated" 
            :value="duty.updated_on" 
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
import { 
  ViewLayout, 
  InfoCard, 
  InfoGrid, 
  InfoItem,
  CARD_ICONS,
  formatDate
} from '@/components/view'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  duty: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:show'])

// Meta items for header
const metaItems = computed(() => {
  const items = []
  
  // Show creation date if available
  if (props.duty.created_on) {
    items.push({
      text: `Created ${formatDate(props.duty.created_on)}`,
      class: 'meta-tag'
    })
  }
  
  // Show last updated if available
  if (props.duty.updated_on) {
    items.push({
      text: `Updated ${formatDate(props.duty.updated_on)}`,
      class: 'meta-tag'
    })
  }
  
  return items
})
</script>
