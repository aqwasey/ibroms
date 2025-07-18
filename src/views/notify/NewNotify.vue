<template>
  <Modal :show="show" :close="() => $emit('update:show', false)" title="Add Notification" variant="edit" :loading="loading" showActions @confirm="handleSave" confirmButtonText="Create">
    <div class="w-full flex flex-col gap-4">
      <InputField v-model="form.title" label="Title" placeholder="Enter notification title" class="w-full" />
      <InputField v-model="form.description" label="Description" placeholder="Enter notification description" class="w-full" />
      <TagInput
        v-model="form.message_templates"
        label="Message Templates"
        placeholder="Select message templates"
        :options="messageTemplateOptions"
        optionLabel="name"
        optionValue="name"
        class="w-full"
      />
      <div class="flex gap-4">
        <div class="w-1/2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Begin Date</label>
          <input
            type="datetime-local"
            v-model="form.begin"
            class="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div class="w-1/2">
          <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            type="datetime-local"
            v-model="form.end"
            class="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
      </div>
      <SelectField
        v-model="form.schedule"
        label="Schedule"
        placeholder="Select schedule type"
        :options="scheduleOptions"
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
import { useNotifyStore } from '@/stores/notify'
import { message } from 'ant-design-vue'

const store = useNotifyStore()
const props = defineProps({ show: { type: Boolean, default: false } })
const emit = defineEmits(['update:show', 'notify-created'])
const loading = ref(false)

// Form data with default values
const form = ref({
  title: '',
  description: '',
  message_templates: [],
  begin: new Date().toISOString().slice(0, 16), // Format: YYYY-MM-DDTHH:MM
  end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16), // One week from now
  schedule: 'once'
})

// Get options from store
const messageTemplateOptions = store.messageTemplateOptions
const scheduleOptions = store.scheduleOptions

const handleSave = async () => {
  try {
    loading.value = true
    await store.createNotification(form.value)
    message.success('Notification added successfully')
    resetForm()
    emit('notify-created')
    emit('update:show', false)
  } catch (error) {
    message.error('Failed to add notification')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.value = {
    title: '',
    description: '',
    message_templates: [],
    begin: new Date().toISOString().slice(0, 16),
    end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    schedule: 'once'
  }
}
</script>