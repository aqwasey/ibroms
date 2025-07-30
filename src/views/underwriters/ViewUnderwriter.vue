<template>
  <ViewModal
    :show="show"
    @update:show="$emit('update:show', $event)"
    title="View Underwriter"
  >
    <div class="underwriter-details">
      <!-- Basic Information -->
      <div class="section">
        <h3 class="section-title">Basic Information</h3>
        <ViewField label="Name" :value="underwriter.name" />
        <ViewField label="Description" :value="underwriter.description || 'N/A'" />
        
        <ViewField label="Sector" :value="underwriter.sector" />
        
        <!-- Location Info -->
        <div class="location-info">
          <ViewField label="Province" :value="underwriter.province || 'N/A'" />
          <ViewField label="Town/City" :value="underwriter.town_city || 'N/A'" />
        </div>
      </div>
      
      <!-- Contact Information -->
      <div class="section">
        <h3 class="section-title">Contact Information</h3>
        <ViewField 
          label="Website" 
          :value="underwriter.website || 'N/A'" 
          :isLink="!!underwriter.website" 
          :link="underwriter.website" 
        />
      </div>
      
      <!-- Meta Information -->
      <div class="section" v-if="underwriter.created_on || underwriter.updated_on">
        <h3 class="section-title">System Information</h3>
        <ViewField 
          v-if="underwriter.created_on" 
          label="Created" 
          :value="formatDate(underwriter.created_on)" 
        />
        <ViewField 
          v-if="underwriter.updated_on" 
          label="Last Updated" 
          :value="formatDate(underwriter.updated_on)" 
        />
      </div>
    </div>
  </ViewModal>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import ViewModal from '@/components/ViewModal.vue'
import ViewField from '@/components/ViewField.vue'

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

// Format date string to a more readable format
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateString; // Return the original string if there's an error
  }
}
</script>
