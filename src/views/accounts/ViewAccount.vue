<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="Bank Account Details"
    variant="view"
    :showActions="false"
  >
    <ViewLayout
      :title="account.bank_name"
      :meta-items="metaItems"
    >
      <!-- Account Information Card -->
      <InfoCard title="Account Information" :icon="CARD_ICONS.BANK">
        <InfoGrid>
          <InfoItem label="Bank Name" :value="account.bank_name" />
          <InfoItem label="Account Type" :value="account.account_type" />
          <InfoItem label="Account Number" :full-width="true">
            <AccountNumber :account-number="account.account_no" />
          </InfoItem>
        </InfoGrid>
      </InfoCard>

      <!-- Contact & Purpose Information Card -->
      <InfoCard title="Contact & Purpose" :icon="CARD_ICONS.CONTACT">
        <InfoGrid>
          <InfoItem label="Email" :value="account.email" />
          <InfoItem label="Purpose" :value="account.purpose" />
          <InfoItem 
            v-if="account.reference" 
            label="Reference" 
            :value="account.reference" 
          />
        </InfoGrid>
      </InfoCard>

      <!-- System Information Card -->
      <InfoCard title="System Information" :icon="CARD_ICONS.TIME" v-if="account.created_on || account.updated_on">
        <InfoGrid>
          <InfoItem 
            v-if="account.created_on" 
            label="Created On" 
            :value="account.created_on" 
            :formatter="formatDate" 
          />
          <InfoItem 
            v-if="account.updated_on" 
            label="Last Updated" 
            :value="account.updated_on" 
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
  AccountNumber,
  CARD_ICONS,
  formatDate
} from '@/components/view'

const props = defineProps({
  account: {
    type: Object,
    required: true
  },
  show: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close', 'update:show'])

// Meta items for header
const metaItems = computed(() => {
  const items = []
  
  if (props.account.account_type) {
    items.push({
      text: props.account.account_type,
      class: 'meta-tag'
    })
  }
  
  if (props.account.purpose) {
    items.push({
      text: props.account.purpose,
      class: 'meta-tag'
    })
  }
  
  return items
})

// All formatting functions are now handled by the reusable view components
</script>
