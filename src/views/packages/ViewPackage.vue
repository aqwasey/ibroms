<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="Package Details"
    variant="view"
    :showActions="false"
    :loading="loading"
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
            v-if="package.base_price" 
            label="Base Price" 
            :value="package.base_price" 
            :formatter="formatCurrency" 
          />
          <InfoItem 
            v-if="package.resell_price" 
            label="Resell Price" 
            :value="package.resell_price" 
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

      <!-- Status Information Card -->
      <InfoCard title="Status Information" :icon="CARD_ICONS.STATUS">
        <InfoGrid>
          <InfoItem 
            label="Status" 
            :value="package.is_active ? 'Active' : 'Inactive'" 
            :class="package.is_active ? 'text-green-600' : 'text-red-600'"
          />
         
        </InfoGrid>
      </InfoCard>

      <!-- Age Items Card -->
      <InfoCard title="Age Items" :icon="CARD_ICONS.USERS" v-if="package.age_items && package.age_items.length > 0">
        <div class="space-y-4">
          <div 
            v-for="(ageItem, index) in package.age_items" 
            :key="index"
            class="p-4 bg-gray-50 rounded-lg border"
          >
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <InfoItem 
                v-if="ageItem.title" 
                label="Title" 
                :value="ageItem.title" 
              />
              <InfoItem 
                v-if="ageItem.start_age !== undefined" 
                label="Start Age" 
                :value="`${ageItem.start_age} years`" 
              />
              <InfoItem 
                v-if="ageItem.end_age !== undefined" 
                label="End Age" 
                :value="`${ageItem.end_age} years`" 
              />
              <InfoItem 
                v-if="ageItem.premium" 
                label="Premium" 
                :value="ageItem.premium" 
                :formatter="formatCurrency" 
              />
              <InfoItem 
                v-if="ageItem.payout" 
                label="Payout" 
                :value="ageItem.payout" 
                :formatter="formatCurrency" 
              />
              <InfoItem 
                v-if="ageItem.correlate !== undefined" 
                label="Correlate" 
                :value="ageItem.correlate" 
              />
            </div>
          </div>
        </div>
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
import { computed, watch } from 'vue'
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
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:show'])

// Fetch underwriters when modal is shown
watch(() => props.show, async (newShow) => {
  if (newShow && underwritersStore.underwriters.length === 0) {
    try {
      await underwritersStore.fetchAllUnderwriters()
    } catch (error) {
      console.error('Error fetching underwriters:', error)
      // Silently handle the error - don't show notification since this is a background operation
    }
  }
})

// Meta items for header
const metaItems = computed(() => {
  const items = []
  
  // Show base price if available
  if (props.package.base_price) {
    items.push({
      text: formatCurrency(props.package.base_price),
      class: 'meta-tag'
    })
  }
  
  // Show status
  items.push({
    text: props.package.is_active ? 'Active' : 'Inactive',
    class: `meta-tag ${props.package.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`
  })
  
  // Show waiting period
  if (props.package.waiting_period !== undefined) {
    items.push({
      text: `${props.package.waiting_period} days waiting`,
      class: 'meta-tag'
    })
  }
  
  // Show age items count
  if (props.package.age_items && props.package.age_items.length > 0) {
    items.push({
      text: `${props.package.age_items.length} age item${props.package.age_items.length !== 1 ? 's' : ''}`,
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
