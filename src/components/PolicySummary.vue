<template>
  <div class="space-y-6">
    <!-- Policy Overview -->
    <div class="p-4 rounded-lg border" :style="{ backgroundColor: COLORS.GRAY_50, borderColor: COLORS.BORDER }">
      <h4 class="font-medium mb-4" :style="{ color: COLORS.TEXT_PRIMARY }">Policy Overview</h4>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="text-sm font-medium" :style="{ color: COLORS.TEXT_SECONDARY }">Group Scheme</label>
          <p class="text-base font-medium" :style="{ color: COLORS.TEXT_PRIMARY }">
            {{ selectedGroupScheme?.name || 'N/A' }}
          </p>
        </div>

        <div>
          <label class="text-sm font-medium" :style="{ color: COLORS.TEXT_SECONDARY }">Product</label>
          <p class="text-base font-medium" :style="{ color: COLORS.TEXT_PRIMARY }">
            {{ selectedProduct?.title || 'N/A' }}
          </p>
        </div>

        <div>
          <label class="text-sm font-medium" :style="{ color: COLORS.TEXT_SECONDARY }">Cover Amount</label>
          <p class="text-lg font-semibold" :style="{ color: COLORS.SUCCESS }">
            {{ formatCurrency(formData.cover_amount) }}
          </p>
        </div>

        <div>
          <label class="text-sm font-medium" :style="{ color: COLORS.TEXT_SECONDARY }">Premium</label>
          <p class="text-lg font-semibold" :style="{ color: COLORS.PRIMARY }">
            {{ formatCurrency(formData.premium) }}
          </p>
        </div>

        <div>
          <label class="text-sm font-medium" :style="{ color: COLORS.TEXT_SECONDARY }">Waiting Period</label>
          <p class="text-base font-medium" :style="{ color: COLORS.TEXT_PRIMARY }">
            {{ formData.waiting_period }} months
          </p>
        </div>
      </div>
    </div>

    <!-- Main Member -->
    <div class="p-4 rounded-lg border" :style="{ backgroundColor: COLORS.GRAY_50, borderColor: COLORS.BORDER }">
      <h4 class="font-medium mb-4" :style="{ color: COLORS.TEXT_PRIMARY }">Main Member</h4>

      <div v-if="selectedMainMember" class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="text-sm font-medium" :style="{ color: COLORS.TEXT_SECONDARY }">Name</label>
          <p class="text-base font-medium" :style="{ color: COLORS.TEXT_PRIMARY }">
            {{ `${selectedMainMember.othername || ''} ${selectedMainMember.surname || ''}`.trim() }}
          </p>
        </div>

        <div>
          <label class="text-sm font-medium" :style="{ color: COLORS.TEXT_SECONDARY }">ID Number</label>
          <p class="text-base font-medium" :style="{ color: COLORS.TEXT_PRIMARY }">
            {{ selectedMainMember.idno }}
          </p>
        </div>

        <div>
          <label class="text-sm font-medium" :style="{ color: COLORS.TEXT_SECONDARY }">Phone</label>
          <p class="text-base font-medium" :style="{ color: COLORS.TEXT_PRIMARY }">
            {{ selectedMainMember.phone || 'N/A' }}
          </p>
        </div>
      </div>

      <div v-else class="text-center py-4" :style="{ color: COLORS.TEXT_SECONDARY }">
        No main member selected
      </div>
    </div>

    <!-- Beneficiary -->
    <div class="p-4 rounded-lg border" :style="{ backgroundColor: COLORS.GRAY_50, borderColor: COLORS.BORDER }">
      <h4 class="font-medium mb-4" :style="{ color: COLORS.TEXT_PRIMARY }">Beneficiary</h4>

      <div v-if="selectedBeneficiary" class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="text-sm font-medium" :style="{ color: COLORS.TEXT_SECONDARY }">Name</label>
          <p class="text-base font-medium" :style="{ color: COLORS.TEXT_PRIMARY }">
            {{ `${selectedBeneficiary.othername || ''} ${selectedBeneficiary.surname || ''}`.trim() }}
          </p>
        </div>

        <div>
          <label class="text-sm font-medium" :style="{ color: COLORS.TEXT_SECONDARY }">ID Number</label>
          <p class="text-base font-medium" :style="{ color: COLORS.TEXT_PRIMARY }">
            {{ selectedBeneficiary.idno }}
          </p>
        </div>

        <div>
          <label class="text-sm font-medium" :style="{ color: COLORS.TEXT_SECONDARY }">Phone</label>
          <p class="text-base font-medium" :style="{ color: COLORS.TEXT_PRIMARY }">
            {{ selectedBeneficiary.phone || 'N/A' }}
          </p>
        </div>
      </div>

      <div v-else class="text-center py-4" :style="{ color: COLORS.TEXT_SECONDARY }">
        No beneficiary selected
      </div>
    </div>

    <!-- Additional Members -->
    <div v-if="selectedAdditionalMembers.length > 0" class="p-4 rounded-lg border" :style="{ backgroundColor: COLORS.GRAY_50, borderColor: COLORS.BORDER }">
      <h4 class="font-medium mb-4" :style="{ color: COLORS.TEXT_PRIMARY }">
        Additional Members ({{ selectedAdditionalMembers.length }})
      </h4>

      <div class="space-y-3">
        <div
          v-for="(member) in selectedAdditionalMembers"
          :key="member.id"
          class="p-3 rounded border"
          :style="{ backgroundColor: 'white', borderColor: COLORS.BORDER }"
        >
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label class="text-xs font-medium" :style="{ color: COLORS.TEXT_SECONDARY }">Name</label>
              <p class="text-sm font-medium" :style="{ color: COLORS.TEXT_PRIMARY }">
                {{ `${member.othername || ''} ${member.surname || ''}`.trim() }}
              </p>
            </div>

            <div>
              <label class="text-xs font-medium" :style="{ color: COLORS.TEXT_SECONDARY }">ID Number</label>
              <p class="text-sm font-medium" :style="{ color: COLORS.TEXT_PRIMARY }">
                {{ member.idno }}
              </p>
            </div>

            <div>
              <label class="text-xs font-medium" :style="{ color: COLORS.TEXT_SECONDARY }">Phone</label>
              <p class="text-sm font-medium" :style="{ color: COLORS.TEXT_PRIMARY }">
                {{ member.phone || 'N/A' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary Totals -->
    <div class="p-4 rounded-lg border-2" :style="{ backgroundColor: COLORS.PRIMARY_LIGHT, borderColor: COLORS.PRIMARY }">
      <h4 class="font-semibold mb-3" :style="{ color: COLORS.PRIMARY_DARK }">Policy Summary</h4>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="text-center">
          <label class="text-sm font-medium" :style="{ color: COLORS.PRIMARY_DARK }">Total Members</label>
          <p class="text-2xl font-bold" :style="{ color: COLORS.PRIMARY_DARK }">
            {{ totalMembers }}
          </p>
        </div>

        <div class="text-center">
          <label class="text-sm font-medium" :style="{ color: COLORS.PRIMARY_DARK }">Monthly Premium</label>
          <p class="text-2xl font-bold" :style="{ color: COLORS.PRIMARY_DARK }">
            {{ formatCurrency(formData.premium) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { COLORS } from '@/constants/colors.js'

const props = defineProps({
  formData: {
    type: Object,
    required: true
  },
  selectedProduct: {
    type: Object,
    default: null
  },
  selectedGroupScheme: {
    type: Object,
    default: null
  },
  selectedMainMember: {
    type: Object,
    default: null
  },
  selectedBeneficiary: {
    type: Object,
    default: null
  },
  selectedAdditionalMembers: {
    type: Array,
    default: () => []
  }
})

const totalMembers = computed(() => {
  let count = 0
  if (props.selectedMainMember) count++
  if (props.selectedBeneficiary) count++
  count += props.selectedAdditionalMembers.length
  return count
})

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount || 0)
}
</script>
