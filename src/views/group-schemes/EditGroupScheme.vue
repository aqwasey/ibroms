<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="Edit Group Scheme"
    variant="edit"
    :loading="loading"
    showActions
    @confirm="handleSubmit"
    confirmButtonText="Save Changes"
  >
    <div class="w-full flex flex-col gap-4">
      <InputField
        v-model="form.name"
        label="Group Scheme Name"
        placeholder="Enter group scheme name"
        class="w-full"
      />

      <InputField
        v-model="form.code"
        label="Group Scheme Code"
        placeholder="Enter group scheme code"
        class="w-full"
      />

      <SelectField
        v-model="form.category"
        label="Category"
        placeholder="Select category"
        :options="categoryOptions"
        class="w-full"
      />

      <SelectField
        v-model="form.underwriter"
        label="Underwriter"
        placeholder="Select underwriter"
        :options="underwriterOptions"
        class="w-full"
      />

      <InputField
        v-model="form.premium"
        label="Premium"
        placeholder="Enter premium amount"
        class="w-full"
      />
    </div>
  </Modal>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'
import Modal from '@/components/Modal.vue'
import InputField from '@/components/InputField.vue'
import SelectField from '@/components/SelectField.vue'
import { useGroupSchemesStore } from '@/stores/group-schemes.js'
import { message } from 'ant-design-vue'

const store = useGroupSchemesStore()

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
  code: '',
  category: '',
  underwriter: '',
  premium: ''
})

// Watch for changes in the group scheme prop to update form
watch(() => props.groupScheme, (newVal) => {
  if (newVal) {
    form.value = { ...newVal }
  }
}, { immediate: true, deep: true })

const categoryOptions = [
  { value: 'Health', label: 'Health' },
  { value: 'Life', label: 'Life' },
  { value: 'Auto', label: 'Auto' },
  { value: 'Property', label: 'Property' },
  { value: 'Travel', label: 'Travel' }
]

const underwriterOptions = [
  { value: 'Global Insurance', label: 'Global Insurance' },
  { value: 'Secure Life Ltd', label: 'Secure Life Ltd' },
  { value: 'Motor Protect Inc', label: 'Motor Protect Inc' },
  { value: 'Home Shield Co', label: 'Home Shield Co' },
  { value: 'Journey Safe Corp', label: 'Journey Safe Corp' }
]

const handleSave = async () => {
  try {
    await store.updateGroupScheme(form.value.id, form.value)
    message.success('Group Scheme updated successfully')
    emits('group-scheme-updated')
    emits('update:show', false)
  } catch (error) {
    message.error('Failed to update group scheme')
    console.error(error)
  }
}
</script>
