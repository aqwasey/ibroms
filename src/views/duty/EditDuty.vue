<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="Edit Duty"
    variant="edit"
    :loading="dutyStore.saving || loading"
    showActions
    @confirm="handleSave"
    confirmButtonText="Save Changes"
    size="lg"
  >
    <div class="w-full flex flex-col gap-4">
      <InputField
        v-model="form.title"
        label="Title"
        placeholder="Enter duty title"
        required
      />
      
      <TextAreaField 
        v-model="form.description"
        label="Description"
        placeholder="Enter duty description"
        rows="3"
        class="w-full"
      />
      
      <TextAreaField 
        v-model="form.notes"
        label="Notes"
        placeholder="Enter any additional notes"
        rows="3"
        class="w-full"
      />
    </div>
  </Modal>
</template>

<script setup>
import { ref, watch, inject } from 'vue'
import Modal from '@/components/Modal.vue'
import InputField from '@/components/InputField.vue'
import TextAreaField from '@/components/TextAreaField.vue'
import { useDutyStore } from '@/stores/duty'

const dutyStore = useDutyStore()
const messageApi = inject('messageApi')

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  duty: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['update:show', 'duty-updated'])

const form = ref({
  id: '',
  title: '',
  description: '',
  notes: ''
})

// Watch for changes in the duty prop to update form
watch(() => props.duty, (newVal) => {
  if (newVal) {
    form.value = {
      id: newVal.id || '',
      title: newVal.title || '',
      description: newVal.description || '',
      notes: newVal.notes || ''
    }
  }
}, { immediate: true, deep: true })

const handleSave = async () => {
  try {
    // Basic validation
    if (!form.value.title.trim()) {
      messageApi.error('Title is required')
      return
    }
    
    const dutyData = {
      title: form.value.title.trim(),
      description: form.value.description.trim(),
      notes: form.value.notes.trim()
    }
    
    await dutyStore.updateDuty(form.value.id, dutyData)
    messageApi.success('Duty updated successfully!')
    emits('duty-updated')
    emits('update:show', false)
  } catch (error) {
    messageApi.error(error?.message || 'Failed to update duty')
    console.error('Error updating duty:', error)
  }
}
</script>
