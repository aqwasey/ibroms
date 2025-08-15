<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="Notification Details"
    variant="view"
    :showActions="false"
    :loading="loading"
  >
    <ViewLayout
      :title="notify.title"
      :meta-items="metaItems"
    >
      <!-- Notification Information Card -->
      <InfoCard title="Notification Information" :icon="CARD_ICONS.DOCUMENT">
        <InfoGrid>
          <InfoItem label="Title" :value="notify.title" />
          <InfoItem label="Description" :value="notify.description" />
          <InfoItem label="Schedule" :value="notify.schedule" />
          <InfoItem 
            v-if="notify.message_templates && notify.message_templates.length > 0" 
            label="Message Templates" 
            :value="notify.message_templates.join(', ')" 
            :full-width="true"
          />
        </InfoGrid>
      </InfoCard>

      <!-- Schedule Information Card -->
      <InfoCard title="Schedule Information" :icon="CARD_ICONS.TIME">
        <InfoGrid>
          <InfoItem 
            v-if="notify.begin" 
            label="Begin Date" 
            :value="notify.begin" 
            :formatter="formatDate" 
          />
          <InfoItem 
            v-if="notify.end" 
            label="End Date" 
            :value="notify.end" 
            :formatter="formatDate" 
          />
        </InfoGrid>
      </InfoCard>

      <!-- System Information Card -->
      <InfoCard title="System Information" :icon="CARD_ICONS.STATUS" v-if="notify.created_on || notify.updated_on">
        <InfoGrid>
          <InfoItem 
            v-if="notify.created_on" 
            label="Created On" 
            :value="notify.created_on" 
            :formatter="formatDate" 
          />
          <InfoItem 
            v-if="notify.updated_on" 
            label="Last Updated" 
            :value="notify.updated_on" 
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
  show: { type: Boolean, default: false }, 
  notify: { type: Object, required: true },
  loading: { type: Boolean, default: false }
})

defineEmits(['update:show'])

// Meta items for header
const metaItems = computed(() => {
  const items = []
  
  // Show schedule
  if (props.notify.schedule) {
    items.push({
      text: props.notify.schedule,
      class: 'meta-tag'
    })
  }
  
  // Show template count
  if (props.notify.message_templates && props.notify.message_templates.length > 0) {
    items.push({
      text: `${props.notify.message_templates.length} template${props.notify.message_templates.length !== 1 ? 's' : ''}`,
      class: 'meta-tag'
    })
  }
  
  return items
})
</script>