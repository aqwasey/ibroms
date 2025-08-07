<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="Add Package"
    variant="create"
    :loading="packagesStore.saving"
    showActions
    @confirm="handleSave"
    confirmButtonText="Create Package"
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
import { ref, computed, onMounted, inject } from 'vue'
import Modal from '@/components/Modal.vue'
import InputField from '@/components/InputField.vue'
import SelectField from '@/components/SelectField.vue'
import TextAreaField from '@/components/TextAreaField.vue'
import { usePackagesStore } from '@/stores/packages'
import { useUnderwritersStore } from '@/stores/underwriters'

const packagesStore = usePackagesStore()
const underwritersStore = useUnderwritersStore()
const messageApi = inject('messageApi')

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['update:show', 'package-created'])

// Fetch underwriters on mount
onMounted(async () => {
  try {
    await underwritersStore.fetchAllUnderwriters()
  } catch (error) {
    console.error('Error fetching underwriters:', error)
  }
})

const form = ref({
  title: '',
  target: '',
  description: '',
  price: 0,
  waiting_period: 0,
  cover_amount: 0,
  underwriter_id: ''
})

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
    
    await packagesStore.createPackage(packageData)
    messageApi.success('Package created successfully!')
    resetForm()
    emits('package-created')
    emits('update:show', false)
  } catch (error) {
    messageApi.error(error?.message || 'Failed to create package')
    console.error('Error creating package:', error)
  }
}

const resetForm = () => {
  form.value = {
    title: '',
    target: '',
    description: '',
    price: 0,
    waiting_period: 0,
    cover_amount: 0,
    underwriter_id: ''
  }
}
</script>