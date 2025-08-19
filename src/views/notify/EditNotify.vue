<template>
  <Modal :show="show" :close="() => $emit('update:show', false)"
    title="Edit Notification"
    variant="edit"
    :loading="store.saving || loading || store.loading"
    showActions
    @confirm="handleSubmit"
    confirmButtonText="Save Changes"
    size="xl"
  >
    <div class="w-full flex flex-col gap-4">
      <InputField 
        v-model="form.title" 
        label="Title" 
        placeholder="Enter notification title" 
        validation-type="text"
        :validation-options="{ maxLength: 100, minLength: 3, capitalizeWords: true }"
        class="w-full" 
      />
      <InputField 
        v-model="form.description" 
        label="Description" 
        placeholder="Enter notification description" 
        validation-type="text"
        :validation-options="{ maxLength: 500, minLength: 10 }"
        class="w-full" 
      />
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
import { ref, defineProps, defineEmits, watch, inject, computed } from 'vue'
import Modal from '@/components/Modal.vue'
import InputField from '@/components/InputField.vue'
import SelectField from '@/components/SelectField.vue'
import TagInput from '@/components/TagInput.vue'
import DateTimeInput from '@/components/DateTimeInput.vue'
import { useNotifyStore } from '@/stores/notify'

const store = useNotifyStore()
const messageApi = inject('messageApi')
const props = defineProps({ 
  show: { type: Boolean, default: false }, 
  notify: { type: Object, required: true },
  loading: { type: Boolean, default: false }
})
const emit = defineEmits(['update:show', 'notify-updated'])

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

// Form data with defaults
const form = ref({
  id: '',
  title: '',
  description: '',
  message_templates: [],
  begin: '',
  end: '',
  schedule: 'once'
})

// Update form when notify changes
watch(() => props.notify, (newVal) => {
  if (newVal) {
    form.value = {
      ...newVal,
      message_templates: newVal.message_templates || [],
      begin: newVal.begin ? new Date(newVal.begin).toISOString().slice(0, 16) : '',
      end: newVal.end ? new Date(newVal.end).toISOString().slice(0, 16) : ''
    }
  }
}, { immediate: true, deep: true })

// Get options from store (computed properties)
const messageTemplateOptions = computed(() => store.messageTemplateOptions)
const scheduleOptions = store.scheduleOptions

const handleSubmit = async () => {
  try {
    await store.updateNotification(form.value.id, form.value)
    messageApi.success('Notification updated successfully')
    emit('notify-updated')
    emit('update:show', false)
  } catch (error) {
    messageApi.error(error?.message || 'Failed to update notification')
    console.error(error)
  }
}
</script>