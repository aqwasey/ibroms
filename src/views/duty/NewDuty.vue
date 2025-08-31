<template>
  <Modal
    :show="props.show"
    :close="() => $emit('update:show', false)"
    title="Add Duty"
    variant="create"
    :loading="dutyStore.saving"
    showActions
    @confirm="handleSave"
    confirmButtonText="Create Duty"
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
import { ref, inject } from 'vue'
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
  }
})

const emits = defineEmits(['update:show', 'duty-created'])

const form = ref({
  title: '',
  description: '',
  notes: ''
})

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
    
    await dutyStore.createDuty(dutyData)
    messageApi.success('Duty created successfully!')
    resetForm()
    emits('duty-created')
    emits('update:show', false)
  } catch (error) {
    messageApi.error(error?.message || 'Failed to create duty')
    console.error('Error creating duty:', error)
  }
}

const resetForm = () => {
  form.value = {
    title: '',
    description: '',
    notes: ''
  }
}
</script>
