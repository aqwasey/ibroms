<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="Group Scheme Details"
    variant="view"
    :showActions="false"
  >
    <ViewLayout
      :title="groupScheme.name"
      :meta-items="metaItems"
    >
      <!-- Group Scheme Information Card -->
      <InfoCard title="Group Scheme Information" :icon="CARD_ICONS.DOCUMENT">
        <InfoGrid>
          <InfoItem label="Name" :value="groupScheme.name" />
          <InfoItem label="Code" :value="groupScheme.code" />
          <InfoItem label="Category" :value="groupScheme.category" />
          <InfoItem label="Province" :value="groupScheme.province" />
          <InfoItem 
            v-if="groupScheme.description" 
            label="Description" 
            :value="groupScheme.description" 
            :full-width="true"
          />
        </InfoGrid>
      </InfoCard>

      <!-- Contact Information Card -->
      <InfoCard title="Contact Information" :icon="CARD_ICONS.CONTACT">
        <InfoGrid>
          <InfoItem 
            v-if="groupScheme.manager" 
            label="Manager" 
            :value="groupScheme.manager" 
          />
          <InfoItem 
            v-if="groupScheme.phone" 
            label="Phone" 
            :value="groupScheme.phone" 
          />
          <InfoItem 
            v-if="groupScheme.address" 
            label="Address" 
            :value="groupScheme.address" 
            :full-width="true"
          />
        </InfoGrid>
      </InfoCard>

      <!-- Additional Information Card -->
      <InfoCard v-if="groupScheme.bin" title="Additional Information" :icon="CARD_ICONS.TIME">
        <InfoGrid>
          <InfoItem label="BIN" :value="groupScheme.bin" />
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
  groupScheme: {
    type: Object,
    required: true
  }
})

defineEmits(['update:show'])

// Meta items for header
const metaItems = computed(() => {
  const items = []
  
  // Show category
  if (props.groupScheme.category) {
    items.push({
      text: props.groupScheme.category,
      class: 'meta-tag'
    })
  }
  
  // Show province
  if (props.groupScheme.province) {
    items.push({
      text: props.groupScheme.province,
      class: 'meta-tag'
    })
  }
  
  // Show manager if available
  if (props.groupScheme.manager) {
    items.push({
      text: `Manager: ${props.groupScheme.manager}`,
      class: 'meta-tag'
    })
  }
  
  return items
})

// Format currency (if needed in future)
const formatCurrency = (amount) => {
  if (!amount) return 'N/A'
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR'
  }).format(amount)
}
</script>
