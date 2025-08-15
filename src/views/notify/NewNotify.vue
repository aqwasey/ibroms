<template>
  <Modal :show="show" :close="() => $emit('update:show', false)"
    title="Add Notification"
    variant="add"
    :loading="store.saving || store.loading"
    showActions
    @confirm="handleSave"
    confirmButtonText="Add Notification"
    size="large"
  >
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
          <DateTimeInput v-model="form.begin" label="Begin Date" class="w-full" />
        </div>
        <div class="w-1/2">
          <DateTimeInput v-model="form.end" label="End Date" class="w-full" />
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
import { ref, defineProps, defineEmits, inject, watch, computed } from 'vue'
import Modal from '@/components/Modal.vue'
import InputField from '@/components/InputField.vue'
import SelectField from '@/components/SelectField.vue'
import TagInput from '@/components/TagInput.vue'
import DateTimeInput from '@/components/DateTimeInput.vue'
import { useNotifyStore } from '@/stores/notify'

const store = useNotifyStore()
const messageApi = inject('messageApi')
const props = defineProps({ show: { type: Boolean, default: false } })
const emit = defineEmits(['update:show', 'notify-created'])

// Fetch message templates when modal is shown (with loading state)
watch(() => props.show, async (newShow) => {
  if (newShow && store.messageTemplates.length === 0) {
    try {
      // Use store loading state for template fetching
      store.loading = true
      await store.fetchMessageTemplates()
    } catch (error) {
      console.error('Error fetching message templates:', error)
      messageApi.error('Failed to load message templates')
    } finally {
      store.loading = false
    }
  }
})

// Form data with default values
const form = ref({
  title: '',
  description: '',
  message_templates: [],
  begin: new Date().toISOString().slice(0, 16), // Format: YYYY-MM-DDTHH:MM
  end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16), // One week from now
  schedule: 'once'
})

// Get options from store (computed properties)
const messageTemplateOptions = computed(() => store.messageTemplateOptions)
const scheduleOptions = store.scheduleOptions

const handleSave = async () => {
  try {
    await store.createNotification(form.value)
    messageApi.success('Notification added successfully')
    resetForm()
    emit('notify-created')
    emit('update:show', false)
  } catch (error) {
    messageApi.error(error?.message || 'Failed to add notification')
    console.error(error)
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