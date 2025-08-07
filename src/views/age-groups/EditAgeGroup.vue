<template>
  <Modal 
    :show="show" 
    :close="() => $emit('update:show', false)"
    title="Edit Age Group"
    variant="edit"
    :loading="store.saving"
    showActions
    @confirm="handleSubmit"
    confirmButtonText="Save Changes"
  >
    <div class="w-full flex flex-col gap-4">
      <InputField 
        v-model="form.title" 
        label="Title" 
        placeholder="Enter age group title" 
        required
        class="w-full" 
      />
      
      <div class="grid grid-cols-2 gap-4">
        <InputField 
          v-model="form.age_begin" 
          label="Age Begin" 
          placeholder="Enter starting age" 
          type="number"
          required
          class="w-full" 
        />
        <InputField 
          v-model="form.age_end" 
          label="Age End" 
          placeholder="Enter ending age" 
          type="number"
          required
          class="w-full" 
        />
      </div>
      
      <InputField 
        v-model="form.correlate" 
        label="Correlate" 
        placeholder="Enter correlate value" 
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
          class="w-full" 
        />
        <InputField 
          v-model="form.payout" 
          label="Payout" 
          placeholder="Enter payout amount" 
          type="number"
          step="0.01"
          required
          class="w-full" 
        />
      </div>
      
      <SelectField 
        v-model="form.package_id" 
        label="Package" 
        placeholder="Select package" 
        :options="packageOptions"
        required
        class="w-full" 
      />
    </div>
  </Modal>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import Modal from '@/components/Modal.vue'
import InputField from '@/components/InputField.vue'
import SelectField from '@/components/SelectField.vue'
import { useAgeGroupsStore } from '@/stores/ageGroups'
import { usePackagesStore } from '@/stores/packages'
import notificationService from '@/services/notificationService'

const store = useAgeGroupsStore()
const packagesStore = usePackagesStore()

const props = defineProps({ 
  show: { type: Boolean, default: false }, 
  ageGroup: { type: Object, required: true } 
})
const emits = defineEmits(['update:show', 'age-group-updated'])

const form = ref({
  id: '',
  title: '',
  age_begin: '',
  age_end: '',
  correlate: '',
  price: '',
  payout: '',
  package_id: ''
})

// Watch for ageGroup changes and populate form
watch(() => props.ageGroup, (newVal) => {
  if (newVal) {
    form.value = {
      id: newVal.id,
      title: newVal.title || '',
      age_begin: newVal.age_begin?.toString() || '',
      age_end: newVal.age_end?.toString() || '',
      correlate: newVal.correlate || '',
      price: newVal.price?.toString() || '',
      payout: newVal.payout?.toString() || '',
      package_id: newVal.package_id || ''
    }
  }
}, { immediate: true, deep: true })

// Fetch packages for dropdown
onMounted(() => {
  packagesStore.fetchAllPackages()
})

// Package options for dropdown
const packageOptions = computed(() => {
  return packagesStore.packages.map(pkg => ({
    value: pkg.id,
    label: pkg.title
  }))
})

const handleSubmit = async () => {
  try {
    // Convert numeric fields to proper types
    const ageGroupData = {
      ...form.value,
      age_begin: parseInt(form.value.age_begin),
      age_end: parseInt(form.value.age_end),
      price: parseFloat(form.value.price),
      payout: parseFloat(form.value.payout)
    }
    
    await store.updateAgeGroup(form.value.id, ageGroupData)
    notificationService.success('Age group updated successfully')
    emits('age-group-updated')
    emits('update:show', false)
  } catch (error) {
    const errorMessage = error?.response?.data?.info || error?.message || 'Failed to update age group'
    notificationService.error(errorMessage)
    console.error('Error updating age group:', error)
  }
}
</script>
