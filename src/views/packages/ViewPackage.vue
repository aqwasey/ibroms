<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="Package Details"
    variant="view"
    :showActions="false"
  >
    <ViewLayout
      :title="package.title"
      :meta-items="metaItems"
    >
      <!-- Package Information Card -->
      <InfoCard title="Package Information" :icon="CARD_ICONS.DOCUMENT">
        <InfoGrid>
          <InfoItem label="Title" :value="package.title" />
          <InfoItem label="Target" :value="package.target" />
          <InfoItem 
            v-if="package.description" 
            label="Description" 
            :value="package.description" 
            :full-width="true"
          />
        </InfoGrid>
      </InfoCard>

      <!-- Financial Information Card -->
      <InfoCard title="Financial Information" :icon="CARD_ICONS.MONEY">
        <InfoGrid>
          <InfoItem 
            label="Price" 
            :value="package.price" 
            :formatter="formatCurrency" 
          />
          <InfoItem 
            v-if="package.cover_amount" 
            label="Cover Amount" 
            :value="package.cover_amount" 
            :formatter="formatCurrency" 
          />
          <InfoItem 
            v-if="package.waiting_period !== undefined" 
            label="Waiting Period" 
            :value="`${package.waiting_period} days`" 
          />
        </InfoGrid>
      </InfoCard>

      <!-- Underwriter Information Card -->
      <InfoCard title="Underwriter" :icon="CARD_ICONS.CONTACT" v-if="underwriterInfo">
        <InfoGrid>
          <InfoItem label="Name" :value="underwriterInfo.name" />
          <InfoItem 
            v-if="underwriterInfo.sector" 
            label="Sector" 
            :value="underwriterInfo.sector" 
          />
        </InfoGrid>
      </InfoCard>

      <!-- System Information Card -->
      <InfoCard title="System Information" :icon="CARD_ICONS.TIME" v-if="package.created_on || package.updated_on">
        <InfoGrid>
          <InfoItem 
            v-if="package.created_on" 
            label="Created On" 
            :value="package.created_on" 
            :formatter="formatDate" 
          />
          <InfoItem 
            v-if="package.updated_on" 
            label="Last Updated" 
            :value="package.updated_on" 
            :formatter="formatDate" 
          />
        </InfoGrid>
      </InfoCard>
    </ViewLayout>
  </Modal>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import Modal from '@/components/Modal.vue'
import { 
  ViewLayout, 
  InfoCard, 
  InfoGrid, 
  InfoItem,
  CARD_ICONS,
  formatDate
} from '@/components/view'
import { useUnderwritersStore } from '@/stores/underwriters'

const underwritersStore = useUnderwritersStore()

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  package: {
    type: Object,
    required: true
  }
})

defineEmits(['update:show'])

// Fetch underwriters on mount to get underwriter info
onMounted(async () => {
  try {
    if (underwritersStore.underwriters.length === 0) {
      await underwritersStore.fetchAllUnderwriters()
    }
  } catch (error) {
    console.error('Error fetching underwriters:', error)
  }
})

// Meta items for header
const metaItems = computed(() => {
  const items = []
  
  if (props.package.price) {
    items.push({
      text: formatCurrency(props.package.price),
      class: 'meta-tag'
    })
  }
  
  if (props.package.waiting_period !== undefined) {
    items.push({
      text: `${props.package.waiting_period} days waiting`,
      class: 'meta-tag'
    })
  }
  
  return items
})

// Get underwriter information
const underwriterInfo = computed(() => {
  if (!props.package.underwriter_id) return null
  
  return underwritersStore.underwriters.find(
    underwriter => underwriter.id === props.package.underwriter_id
  )
})

// Format currency
const formatCurrency = (amount) => {
  if (!amount) return 'N/A'
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR'
  }).format(amount)
}
</script>
