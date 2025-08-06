<template>
  <Modal :show="show" :close="() => $emit('update:show', false)" title="Add Rule" variant="edit" :loading="loading" showActions @confirm="handleSave" confirmButtonText="Create">
    <div class="w-full flex flex-col gap-4">
      <InputField v-model="form.title" label="Title" placeholder="Enter rule title" class="w-full" />
      <InputField v-model="form.description" label="Description" placeholder="Enter rule description" class="w-full" />
      <TagInput
        v-model="form.service_list"
        label="Service List"
        placeholder="Select services"
        :options="serviceOptions"
        optionLabel="name"
        optionValue="name"
        class="w-full"
      />
      <SelectField
        v-model="form.limit_type"
        label="Limit Type"
        placeholder="Select limit type"
        :options="limitTypeOptions"
        class="w-full"
      />
    </div>
  </Modal>
</template>
<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import Modal from '@/components/Modal.vue'
import InputField from '@/components/InputField.vue'
import SelectField from '@/components/SelectField.vue'
import TagInput from '@/components/TagInput.vue'
import { useRulesStore } from '@/stores/rules'
import notificationService from '@/services/notificationService'

const store = useRulesStore()
const props = defineProps({ show: { type: Boolean, default: false } })
const emit = defineEmits(['update:show', 'rule-created'])
const loading = ref(false)

// Form data with default values
const form = ref({
  title: '',
  description: '',
  service_list: [],
  limit_type: 'RESTRICTED'
})

// Options for select fields
const limitTypeOptions = [
  { label: 'Restricted', value: 'RESTRICTED' },
  { label: 'Unlimited', value: 'UNLIMITED' }
]

// Get service options from store
const serviceOptions = store.serviceOptions || []

const handleSave = async () => {
  try {
    loading.value = true
    await store.createRule(form.value)
    // Success notification is handled by the store
    resetForm()
    emit('rule-created')
    emit('update:show', false)
  } catch (error) {
    // Error notification is handled by the store
    console.error(error)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.value = {
    title: '',
    description: '',
    service_list: [],
    limit_type: 'RESTRICTED'
  }
}
</script>