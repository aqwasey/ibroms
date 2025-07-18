<template>
  <Modal :show="show" :close="() => $emit('update:show', false)"
    title="Edit Notification"
    variant="edit"
    :loading="loading"
    showActions
    @confirm="handleSubmit"
    confirmButtonText="Save Changes"
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
import { ref, defineProps, defineEmits, watch } from 'vue'
import Modal from '@/components/Modal.vue'
import InputField from '@/components/InputField.vue'
import SelectField from '@/components/SelectField.vue'
import TagInput from '@/components/TagInput.vue'
import { useNotifyStore } from '@/stores/notify'
import { message } from 'ant-design-vue'

const store = useNotifyStore()
const props = defineProps({ show: { type: Boolean, default: false }, notify: { type: Object, required: true } })
const emit = defineEmits(['update:show', 'notify-updated'])
const loading = ref(false)

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

// Get options from store
const messageTemplateOptions = store.messageTemplateOptions
const scheduleOptions = store.scheduleOptions

const handleSubmit = async () => {
  try {
    loading.value = true
    await store.updateNotification(form.value.id, form.value)
    message.success('Notification updated successfully')
    emit('notify-updated')
    emit('update:show', false)
  } catch (error) {
    message.error('Failed to update notification')
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>