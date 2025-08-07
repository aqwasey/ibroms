<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="Age Group Details"
    variant="view"
    :showActions="false"
  >
    <ViewLayout
      :title="ageGroup.title"
      :meta-items="metaItems"
    >
      <!-- Basic Information Card -->
      <InfoCard title="Age Group Information" :icon="CARD_ICONS.DOCUMENT">
        <InfoGrid>
          <InfoItem label="Title" :value="ageGroup.title" />
          <InfoItem label="Age Begin" :value="ageGroup.age_begin" />
          <InfoItem label="Age End" :value="ageGroup.age_end" />
          <InfoItem label="Correlate" :value="ageGroup.correlate" />
        </InfoGrid>
      </InfoCard>

      <!-- Financial Information Card -->
      <InfoCard title="Financial Information" :icon="CARD_ICONS.MONEY">
        <InfoGrid>
          <InfoItem
            label="Price"
            :value="ageGroup.price"
            :formatter="formatCurrency"
          />
          <InfoItem
            label="Payout"
            :value="ageGroup.payout"
            :formatter="formatCurrency"
          />
        </InfoGrid>
      </InfoCard>

      <!-- Package Information Card -->
      <InfoCard title="Package Information" :icon="CARD_ICONS.PACKAGE" v-if="packageInfo">
        <InfoGrid>
          <InfoItem label="Package" :value="packageInfo.title" />
        </InfoGrid>
      </InfoCard>

      <!-- System Information Card -->
      <InfoCard title="System Information" :icon="CARD_ICONS.TIME" v-if="ageGroup.updated_on">
        <InfoGrid>
          <InfoItem
            label="Last Updated"
            :value="ageGroup.updated_on"
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
import { ViewLayout, InfoCard, InfoGrid, InfoItem, CARD_ICONS } from '@/components/view'
import { usePackagesStore } from '@/stores/packages'

const packagesStore = usePackagesStore()

const props = defineProps({
  show: { type: Boolean, default: false },
  ageGroup: { type: Object, required: true }
})

defineEmits(['update:show'])

// Fetch packages to get package info
onMounted(() => {
  packagesStore.fetchAllPackages()
})

// Meta items for the header
const metaItems = computed(() => [
  { label: 'Age Range', value: `${props.ageGroup.age_begin} - ${props.ageGroup.age_end}` },
  { label: 'Price', value: formatCurrency(props.ageGroup.price) }
])

// Get package information
const packageInfo = computed(() => {
  if (!props.ageGroup.package_id) return null
  return packagesStore.packages.find(pkg => pkg.id === props.ageGroup.package_id)
})

// Format currency helper
const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return 'N/A'
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2
  }).format(amount)
}

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
