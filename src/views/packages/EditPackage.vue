<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="Edit Package"
    variant="edit"
    :loading="packagesStore.saving"
    showActions
    @confirm="handleSave"
    confirmButtonText="Save Changes"
  >
    <div class="w-full flex flex-col gap-4">
      <InputField
        v-model="form.title"
        label="Title"
        placeholder="Enter package title"
        class="w-full"
        required
      />

      <InputField
        v-model="form.target"
        label="Target"
        placeholder="Enter package target"
        class="w-full"
      />

      <TextAreaField 
        v-model="form.description"
        label="Description"
        placeholder="Enter package description"
        rows="3"
        class="w-full"
      />

      <div class="grid grid-cols-2 gap-4">
        <InputField
          v-model="form.price"
          label="Price"
          placeholder="Enter price"
          type="number"
          step="0.01"
          required
        />
        
        <InputField
          v-model="form.cover_amount"
          label="Cover Amount"
          placeholder="Enter cover amount"
          type="number"
          step="0.01"
        />
      </div>

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
        class="w-full"
        required
      />
    </div>
  </Modal>
</template>

<script setup>
import { ref, computed, onMounted, watch, inject } from 'vue'
import Modal from '@/components/Modal.vue'
import InputField from '@/components/InputField.vue'
import SelectField from '@/components/SelectField.vue'
import TextAreaField from '@/components/TextAreaField.vue'
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
  }
})

const emits = defineEmits(['update:show', 'package-updated'])

// Fetch underwriters on mount
onMounted(async () => {
  try {
    await underwritersStore.fetchAllUnderwriters()
  } catch (error) {
    console.error('Error fetching underwriters:', error)
  }
})

const form = ref({
  id: '',
  title: '',
  target: '',
  description: '',
  price: 0,
  waiting_period: 0,
  cover_amount: 0,
  underwriter_id: ''
})

// Watch for changes in the package prop to update form
watch(() => props.package, (newVal) => {
  if (newVal) {
    form.value = {
      id: newVal.id || '',
      title: newVal.title || '',
      target: newVal.target || '',
      description: newVal.description || '',
      price: newVal.price || 0,
      waiting_period: newVal.waiting_period || 0,
      cover_amount: newVal.cover_amount || 0,
      underwriter_id: newVal.underwriter_id || ''
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
    // Convert string numbers to actual numbers
    const packageData = {
      ...form.value,
      price: parseFloat(form.value.price) || 0,
      waiting_period: parseInt(form.value.waiting_period) || 0,
      cover_amount: parseFloat(form.value.cover_amount) || 0
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
</script>
