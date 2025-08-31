<template>
  <div class="p-4 rounded-lg border" :style="{ backgroundColor: COLORS.GRAY_50, borderColor: COLORS.BORDER }">
    <h4 class="font-medium mb-4" :style="{ color: COLORS.TEXT_PRIMARY }">{{ title }}</h4>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- Basic Information -->
      <div>
        <label class="text-sm font-medium" :style="{ color: COLORS.TEXT_SECONDARY }">Full Name</label>
        <p class="text-base font-medium" :style="{ color: COLORS.TEXT_PRIMARY }">
          {{ `${person.othername || ''} ${person.surname || ''}`.trim() || 'N/A' }}
        </p>
      </div>
      
      <div>
        <label class="text-sm font-medium" :style="{ color: COLORS.TEXT_SECONDARY }">ID Number</label>
        <p class="text-base font-medium" :style="{ color: COLORS.TEXT_PRIMARY }">
          {{ person.idno || 'N/A' }}
        </p>
      </div>
      
      <div>
        <label class="text-sm font-medium" :style="{ color: COLORS.TEXT_SECONDARY }">Date of Birth</label>
        <p class="text-base font-medium" :style="{ color: COLORS.TEXT_PRIMARY }">
          {{ formatDate(person.dob) || 'N/A' }}
        </p>
      </div>
      
      <div>
        <label class="text-sm font-medium" :style="{ color: COLORS.TEXT_SECONDARY }">Gender</label>
        <p class="text-base font-medium" :style="{ color: COLORS.TEXT_PRIMARY }">
          {{ person.gender || 'N/A' }}
        </p>
      </div>
      
      <div>
        <label class="text-sm font-medium" :style="{ color: COLORS.TEXT_SECONDARY }">Phone</label>
        <p class="text-base font-medium" :style="{ color: COLORS.TEXT_PRIMARY }">
          {{ person.phone || 'N/A' }}
        </p>
      </div>
      
      <div>
        <label class="text-sm font-medium" :style="{ color: COLORS.TEXT_SECONDARY }">Status</label>
        <p class="text-base font-medium" :style="{ color: person.is_alive ? COLORS.SUCCESS : COLORS.ERROR }">
          {{ person.is_alive ? 'Alive' : 'Deceased' }}
        </p>
      </div>
    </div>
    
    <!-- Address if available -->
    <div v-if="person.address" class="mt-4 pt-4 border-t" :style="{ borderColor: COLORS.BORDER }">
      <label class="text-sm font-medium" :style="{ color: COLORS.TEXT_SECONDARY }">Address</label>
      <p class="text-base" :style="{ color: COLORS.TEXT_PRIMARY }">
        {{ person.address }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { COLORS } from '@/constants/colors.js'

defineProps({
  person: {
    type: Object,
    required: true
  },
  title: {
    type: String,
    default: 'Person Details'
  }
})

const formatDate = (dateString) => {
  if (!dateString) return null
  try {
    return new Date(dateString).toLocaleDateString()
  } catch {
    return dateString
  }
}
</script>
