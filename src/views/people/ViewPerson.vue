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
          <InfoItem label="Other Name(s)" :value="personData?.othername || 'N/A'" />
          <InfoItem label="Surname" :value="personData?.surname || 'N/A'" />
          <InfoItem label="Gender" :value="personData?.gender || 'N/A'" />
          <InfoItem label="Date of Birth" :value="personData?.birthdate || 'N/A'" :formatter="formatDate" />
          <InfoItem label="Status" :value="personData?.is_alive ? 'Alive' : 'Deceased'" :class="personData?.is_alive ? 'text-green-600' : 'text-red-600'" />
        </InfoGrid>
      </InfoCard>

      <!-- Identification Card -->
      <InfoCard title="Identification" :icon="CARD_ICONS.DOCUMENT">
        <InfoGrid>
          <InfoItem label="ID Type" :value="personData?.id_type || 'N/A'" />
          <InfoItem label="ID Number" :value="personData?.idno || 'N/A'" />
        </InfoGrid>
      </InfoCard>

      <!-- Contact Information Card -->
      <InfoCard title="Contact Information" :icon="CARD_ICONS.CONTACT" v-if="contactsData && contactsData.length > 0">
        <InfoGrid>
          <InfoItem 
            v-for="contact in contactsData" 
            :key="contact.id"
            :label="formatContactType(contact.item)" 
            :value="contact.value" 
            :description="contact.remarks || undefined"
          />
        </InfoGrid>
      </InfoCard>

      <!-- Documents Card -->
      <InfoCard title="Documents" :icon="CARD_ICONS.DOCUMENT" v-if="documentsData && documentsData.length > 0">
        <InfoGrid>
          <InfoItem 
            v-for="doc in documentsData" 
            :key="doc.id"
            :label="doc.type || 'Document'" 
            :value="doc.filename || doc.path || 'N/A'" 
            :description="doc.notes || undefined"
            :full-width="true"
          />
        </InfoGrid>
      </InfoCard>

      <!-- System Information Card -->
      <InfoCard title="System Information" :icon="CARD_ICONS.TIME" v-if="personData?.created_at || personData?.updated_at">
        <InfoGrid>
          <InfoItem 
            v-if="personData?.created_at" 
            label="Created On" 
            :value="personData.created_at" 
            :formatter="formatDate" 
          />
          <InfoItem 
            v-if="personData?.updated_at" 
            label="Last Updated" 
            :value="personData.updated_at" 
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

// Extract nested data from the person object
const personData = computed(() => {
  // Handle nested structure from API response
  if (props.person?.data?.person) {
    return props.person.data.person
  }
  // Handle direct person object
  if (props.person?.person) {
    return props.person.person
  }
  // Handle flat structure
  return props.person || {}
})

const contactsData = computed(() => {
  // Handle nested structure from API response
  if (props.person?.data?.contacts) {
    return props.person.data.contacts
  }
  // Handle direct contacts array
  if (props.person?.contacts) {
    return props.person.contacts
  }
  return []
})

const documentsData = computed(() => {
  // Handle nested structure from API response
  if (props.person?.data?.docs) {
    return props.person.data.docs
  }
  // Handle direct documents array
  if (props.person?.docs || props.person?.documents) {
    return props.person.docs || props.person.documents
  }
  return []
})

// Computed person full name
const personFullName = computed(() => {
  const otherNames = personData.value?.othername || ''
  const surname = personData.value?.surname || ''
  return `${otherNames} ${surname}`.trim() || 'Unknown Person'
})

// Meta items for header
const metaItems = computed(() => {
  const items = []
  
  // Show gender if available
  if (personData.value?.gender) {
    items.push({
      text: personData.value.gender,
      class: 'meta-tag'
    })
  }
  
  // Show status
  items.push({
    text: personData.value?.is_alive ? 'Alive' : 'Deceased',
    class: `meta-tag ${personData.value?.is_alive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`
  })
  
  // Show ID type if available
  if (personData.value?.id_type) {
    items.push({
      text: personData.value.id_type.replace('_', ' '),
      class: 'meta-tag'
    })
  }
  
  return items
})

// Format contact type for display
const formatContactType = (type) => {
  const typeMap = {
    'email': 'Email',
    'mobile': 'Mobile',
    'whatsapp': 'WhatsApp', 
    'phone': 'Phone',
    'landline': 'Landline'
  }
  return typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1)
}
</script>
