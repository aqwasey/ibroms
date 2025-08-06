<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="View Underwriter"
    variant="view"
    :showActions="false"
  >
    <ViewLayout
      :title="underwriter.name"
      :meta-items="metaItems"
    >
      <!-- Basic Information Card -->
      <InfoCard title="Basic Information" :icon="CARD_ICONS.INFO">
        <InfoGrid>
          <InfoItem label="Underwriter Name" :value="underwriter.name" />
          <InfoItem label="Sector" :value="underwriter.sector" />
          <InfoItem 
            v-if="underwriter.description"
            label="Description" 
            :value="underwriter.description" 
            :full-width="true"
            :is-description="true"
          />
        </InfoGrid>
      </InfoCard>

      <!-- Location Information Card -->
      <InfoCard title="Location Information" :icon="CARD_ICONS.LOCATION">
        <InfoGrid>
          <InfoItem label="Province" :value="underwriter.province" />
          <InfoItem label="Town/City" :value="underwriter.town_city" />
        </InfoGrid>
      </InfoCard>

      <!-- Contact Information Card -->
      <InfoCard title="Contact Information" :icon="CARD_ICONS.CONTACT">
        <InfoGrid>
          <InfoItem label="Website" v-if="underwriter.website">
            <WebsiteLink :url="underwriter.website" />
          </InfoItem>
          <InfoItem label="Logo" v-if="underwriter.logo">
            <LogoDisplay :logo-url="underwriter.logo" :alt-text="underwriter.name + ' logo'" />
          </InfoItem>
        </InfoGrid>
      </InfoCard>

      <!-- System Information Card -->
      <InfoCard title="System Information" :icon="CARD_ICONS.TIME">
        <InfoGrid>
          <InfoItem label="Created On" :value="underwriter.created_on" :formatter="formatDate" />
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
  WebsiteLink, 
  LogoDisplay,
  CARD_ICONS,
  formatDate
} from '@/components/view'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  underwriter: {
    type: Object,
    required: true
  }
})

defineEmits(['update:show'])

// Meta items for header
const metaItems = computed(() => [
  {
    text: props.underwriter.active ? 'Active' : 'Inactive',
    class: ['status-indicator', props.underwriter.active ? 'active' : 'inactive']
  },
  {
    text: props.underwriter.sector,
    class: 'meta-tag'
  }
])
</script>

<style scoped>
/* All styles are now handled by the reusable view components */
</style>
