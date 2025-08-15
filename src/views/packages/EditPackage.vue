<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="Edit Package"
    variant="edit"
    :loading="packagesStore.saving || loading"
    showActions
    @confirm="handleSave"
    confirmButtonText="Save Changes"
    size="xxl"
  >
    <div class="w-full flex flex-col gap-4">
      <!-- Title and Target in one row -->
      <div class="grid grid-cols-2 gap-4">
        <InputField
          v-model="form.title"
          label="Title"
          placeholder="Enter package title"
          required
        />

        <InputField
          v-model="form.target"
          label="Target"
          placeholder="Enter package target"
        />
      </div>

      <TextAreaField 
        v-model="form.description"
        label="Description"
        placeholder="Enter package description"
        rows="3"
        class="w-full"
      />

      <div class="grid grid-cols-2 gap-4">
        <InputField
          v-model="form.base_price"
          label="Base Price"
          placeholder="Enter base price"
          type="number"
          step="0.01"
          required
        />
        
        <InputField
          v-model="form.resell_price"
          label="Resell Price"
          placeholder="Enter resell price"
          type="number"
          step="0.01"
          required
        />
      </div>
      
      <!-- Cover Amount, Waiting Period, and Underwriter in one row -->
      <div class="grid grid-cols-3 gap-4">
        <InputField
          v-model="form.cover_amount"
          label="Cover Amount"
          placeholder="Enter cover amount"
          type="number"
          step="0.01"
        />

        <InputField
          v-model="form.waiting_period"
          label="Waiting Period (days)"
          placeholder="Enter waiting period"
          type="number"
          min="0"
        />

        <SelectField
          v-model="form.underwriter_id"
          label="Underwriter"
          placeholder="Select underwriter"
          :options="underwriterOptions"
          required
        />
      </div>
      
      <!-- Age Items Section -->
      <AgeItemsManager v-model="form.age_items" />
    </div>
  </Modal>
</template>

<script setup>
import { ref, computed, watch, inject } from 'vue'
import Modal from '@/components/Modal.vue'
import InputField from '@/components/InputField.vue'
import SelectField from '@/components/SelectField.vue'
import TextAreaField from '@/components/TextAreaField.vue'
import AgeItemsManager from '@/components/AgeItemsManager.vue'
import { usePackagesStore } from '@/stores/packages.js'
import { useUnderwritersStore } from '@/stores/underwriters'

const packagesStore = usePackagesStore()
const underwritersStore = useUnderwritersStore()
const messageApi = inject('messageApi')

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

const emits = defineEmits(['update:show', 'package-updated'])

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

const form = ref({
  id: '',
  title: '',
  target: '',
  description: '',
  base_price: 0,
  resell_price: 0,
  waiting_period: 0,
  cover_amount: 0,
  underwriter_id: '',
  age_items: []
})

// Watch for changes in the package prop to update form
watch(() => props.package, (newVal) => {
  if (newVal) {
    form.value = {
      id: newVal.id || '',
      title: newVal.title || '',
      target: newVal.target || '',
      description: newVal.description || '',
      base_price: newVal.base_price || 0,
      resell_price: newVal.resell_price || 0,
      waiting_period: newVal.waiting_period || 0,
      cover_amount: newVal.cover_amount || 0,
      underwriter_id: newVal.underwriter_id || '',
      age_items: newVal.age_items ? [...newVal.age_items] : []
    }
  }
}, { immediate: true, deep: true })

// Computed underwriter options
const underwriterOptions = computed(() => {
  return underwritersStore.underwriters.map(underwriter => ({
    value: underwriter.id,
    label: underwriter.name
  }))
})

const handleSave = async () => {
  try {
    // Validate age items
    if (form.value.age_items.length === 0) {
      messageApi.error('Please add at least one age item')
      return
    }
    
    // Convert string numbers to actual numbers
    const packageData = {
      ...form.value,
      base_price: parseFloat(form.value.base_price) || 0,
      resell_price: parseFloat(form.value.resell_price) || 0,
      waiting_period: parseInt(form.value.waiting_period) || 0,
      cover_amount: parseFloat(form.value.cover_amount) || 0,
      age_items: form.value.age_items.map(item => ({
        ...item,
        start_age: parseInt(item.start_age) || 0,
        end_age: parseInt(item.end_age) || 0,
        premium: parseFloat(item.premium) || 0,
        payout: parseFloat(item.payout) || 0
      }))
    }
    
    await packagesStore.updatePackage(form.value.id, packageData)
    messageApi.success('Package updated successfully!')
    emits('package-updated')
    emits('update:show', false)
  } catch (error) {
    messageApi.error(error?.message || 'Failed to update package')
    console.error('Error updating package:', error)
  }
}

// Age items are now managed by the AgeItemsManager component
</script>
