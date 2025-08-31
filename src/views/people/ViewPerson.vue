<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="Person Details"
    variant="view"
    :showActions="false"
    :loading="loading"
  >
    <ViewLayout
      :title="personFullName"
      :meta-items="metaItems"
    >
      <!-- Personal Information Card -->
      <InfoCard title="Personal Information" :icon="CARD_ICONS.INFO">
        <InfoGrid>
          <InfoItem label="Other Name(s)" :value="person?.otherNames || 'N/A'" />
          <InfoItem label="Surname" :value="person?.surname || 'N/A'" />
          <InfoItem label="Gender" :value="person?.gender || 'N/A'" />
          <InfoItem label="Date of Birth" :value="person?.dateOfBirth || 'N/A'" :formatter="formatDate" />
        </InfoGrid>
      </InfoCard>

      <!-- Identification Card -->
      <InfoCard title="Identification" :icon="CARD_ICONS.DOCUMENT">
        <InfoGrid>
          <InfoItem label="ID Type" :value="person?.idType || 'N/A'" />
          <InfoItem label="ID Number" :value="person?.idNumber || 'N/A'" />
        </InfoGrid>
      </InfoCard>

      <!-- Contact Information Card -->
      <InfoCard title="Contact Information" :icon="CARD_ICONS.CONTACT" v-if="person?.email || person?.mobile || person?.whatsapp">
        <InfoGrid>
          <InfoItem v-if="person?.email" label="Email" :value="person.email" />
          <InfoItem v-if="person?.mobile" label="Mobile" :value="person.mobile" />
          <InfoItem v-if="person?.whatsapp" label="WhatsApp" :value="person.whatsapp" />
        </InfoGrid>
      </InfoCard>

      <!-- Address Information Card -->
      <InfoCard title="Address Information" :icon="CARD_ICONS.LOCATION" v-if="person?.address || person?.city || person?.province">
        <InfoGrid>
          <InfoItem v-if="person?.province" label="Province" :value="person.province" />
          <InfoItem v-if="person?.city" label="City" :value="person.city" />
          <InfoItem 
            v-if="person?.address" 
            label="Address" 
            :value="person.address" 
            :full-width="true"
          />
        </InfoGrid>
      </InfoCard>

      <!-- Status Information Card -->
      <InfoCard title="Status Information" :icon="CARD_ICONS.STATUS">
        <InfoGrid>
          <InfoItem 
            label="Status" 
            :value="person?.alive ? 'Active' : 'Inactive'" 
            :class="person?.alive ? 'text-green-600' : 'text-red-600'"
          />
        </InfoGrid>
      </InfoCard>

      <!-- System Information Card -->
      <InfoCard title="System Information" :icon="CARD_ICONS.TIME" v-if="person?.created_on || person?.updated_on">
        <InfoGrid>
          <InfoItem 
            v-if="person?.created_on" 
            label="Created On" 
            :value="person.created_on" 
            :formatter="formatDate" 
          />
          <InfoItem 
            v-if="person?.updated_on" 
            label="Last Updated" 
            :value="person.updated_on" 
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
  person: {
    type: Object,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:show'])

// Computed person full name
const personFullName = computed(() => {
  const otherNames = props.person?.otherNames || ''
  const surname = props.person?.surname || ''
  return `${otherNames} ${surname}`.trim() || 'Unknown Person'
})

// Meta items for header
const metaItems = computed(() => {
  const items = []
  
  // Show gender if available
  if (props.person?.gender) {
    items.push({
      text: props.person.gender,
      class: 'meta-tag'
    })
  }
  
  // Show status
  items.push({
    text: props.person?.alive ? 'Active' : 'Inactive',
    class: `meta-tag ${props.person?.alive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`
  })
  
  // Show ID type if available
  if (props.person?.idType) {
    items.push({
      text: props.person.idType,
      class: 'meta-tag'
    })
  }
  
  return items
})
</script>
