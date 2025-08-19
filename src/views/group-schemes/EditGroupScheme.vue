<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="Edit Group Scheme"
    variant="edit"
    :loading="groupSchemesStore.saving"
    showActions
    @confirm="handleSave"
    confirmButtonText="Save Changes"
    size="xl"
  >
    <div class="w-full flex flex-col gap-4">
      <!-- Name and Code in one row -->
      <div class="grid grid-cols-2 gap-4">
        <InputField
          v-model="form.name"
          label="Name"
          placeholder="Enter scheme name"
          required
        />

        <InputField
          v-model="form.code"
          label="Code"
          placeholder="Enter scheme code"
          required
        />
      </div>

      <TextAreaField
        v-model="form.description"
        label="Description"
        placeholder="Enter scheme description"
        rows="3"
        class="w-full"
      />

      <!-- Category and Province in one row -->
      <div class="grid grid-cols-2 gap-4">
        <SelectField
          v-model="form.category"
          label="Category"
          placeholder="Select category"
          :options="categoryOptions"
          required
        />

        <SelectField
          v-model="form.province"
          label="Province"
          placeholder="Select province"
          :options="provinceOptions"
          required
        />
      </div>

      <!-- Manager and Phone in one row -->
      <div class="grid grid-cols-2 gap-4">
        <InputField
          v-model="form.manager"
          label="Manager"
          placeholder="Enter manager name"
          validation-type="text"
          :validation-options="{ allowNumbers: false, allowSpecialChars: false, capitalizeWords: true, maxLength: 50 }"
        />

        <InputField
          v-model="form.phone"
          label="Phone"
          placeholder="Enter phone number"
          validation-type="phone"
          :validation-options="{ maxLength: 15, allowCountryCode: true }"
        />
      </div>

      <TextAreaField
        v-model="form.address"
        label="Address"
        placeholder="Enter address"
        rows="2"
        class="w-full"
      />
    </div>
  </Modal>
</template>

<script setup>
import { ref, watch, inject } from 'vue'
import Modal from '@/components/Modal.vue'
import InputField from '@/components/InputField.vue'
import SelectField from '@/components/SelectField.vue'
import TextAreaField from '@/components/TextAreaField.vue'
import { useGroupSchemesStore } from '@/stores/group-schemes.js'

const groupSchemesStore = useGroupSchemesStore()
const messageApi = inject('messageApi')

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  groupScheme: {
    type: Object,
    required: true
  }
})

const emits = defineEmits(['update:show', 'group-scheme-updated'])

const form = ref({
  id: '',
  name: '',
  description: '',
  province: '',
  manager: '',
  category: '',
  phone: '',
  code: '',
  address: ''
})

// Watch for changes in the group scheme prop to update form
watch(() => props.groupScheme, (newVal) => {
  if (newVal) {
    form.value = {
      id: newVal.id || '',
      name: newVal.name || '',
      description: newVal.description || '',
      province: newVal.province || '',
      manager: newVal.manager || '',
      category: newVal.category || '',
      phone: newVal.phone || '',
      code: newVal.code || '',
      address: newVal.address || '',
      bin: newVal.bin || '' // Add bin field if it exists in API
    }
  }
}, { immediate: true, deep: true })

const categoryOptions = [
  { value: 'Health', label: 'Health' },
  { value: 'Life', label: 'Life' },
  { value: 'Auto', label: 'Auto' },
  { value: 'Property', label: 'Property' },
  { value: 'Travel', label: 'Travel' },
  { value: 'Funeral', label: 'Funeral' },
  { value: 'Legal', label: 'Legal' },
  { value: 'Medical', label: 'Medical' }
]

const provinceOptions = [
  { value: 'Western Cape', label: 'Western Cape' },
  { value: 'Eastern Cape', label: 'Eastern Cape' },
  { value: 'Northern Cape', label: 'Northern Cape' },
  { value: 'Free State', label: 'Free State' },
  { value: 'KwaZulu-Natal', label: 'KwaZulu-Natal' },
  { value: 'North West', label: 'North West' },
  { value: 'Gauteng', label: 'Gauteng' },
  { value: 'Mpumalanga', label: 'Mpumalanga' },
  { value: 'Limpopo', label: 'Limpopo' }
]

const handleSave = async () => {
  try {
    await groupSchemesStore.updateGroupScheme(form.value.id, form.value)
    messageApi.success('Group Scheme updated successfully!')
    emits('group-scheme-updated')
    emits('update:show', false)
  } catch (error) {
    messageApi.error(error?.message || 'Failed to update group scheme')
    console.error('Error updating group scheme:', error)
  }
}
</script>
