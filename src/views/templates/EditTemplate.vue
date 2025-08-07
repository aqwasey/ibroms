<template>
  <Modal :show="show" :close="() => $emit('update:show', false)"
    title="Edit Template"
    variant="edit"
    :loading="store.saving"
    showActions
    @confirm="handleSubmit"
    confirmButtonText="Save Changes"
  >
    <div class="w-full flex flex-col gap-4">
      <InputField v-model="form.title" label="Title" placeholder="Enter template title" class="w-full" />
      <SelectField v-model="form.category" label="Category" placeholder="Select category" :options="categoryOptions" class="w-full" />
      <SelectField v-model="form.template_type" label="Template Type" placeholder="Select template type" :options="templateTypeOptions" class="w-full" />
      <TagInput
        v-model="form.params_list"
        label="Parameters"
        placeholder="Select parameters"
        :options="paramOptions"
        optionLabel="name"
        optionValue="name"
        class="w-full"
      />
      <TextAreaField 
        v-model="form.template" 
        label="Template Content" 
        placeholder="Enter template content" 
        :rows="6"
        required
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
import TextAreaField from '@/components/TextAreaField.vue'
import { useTemplateStore } from '@/stores/templates'
import notificationService from '@/services/notificationService'
const store = useTemplateStore()
const props = defineProps({ show: { type: Boolean, default: false }, template: { type: Object, required: true } })
const emits = defineEmits(['update:show', 'template-updated'])
const form = ref({ id: '', title: '', category: 'UNCATEGORIZED', template_type: '', params_list: [], template: '' })
watch(() => props.template, (newVal) => { if (newVal) { form.value = { ...newVal, params_list: newVal.params_list || [] } } }, { immediate: true, deep: true })
const categoryOptions = [ { value: 'UNCATEGORIZED', label: 'Uncategorized' }, { value: 'POLICY', label: 'Policy' }, { value: 'MARKETING', label: 'Marketing' }, { value: 'NOTIFICATION', label: 'Notification' } ]
const templateTypeOptions = store.template_types
const paramOptions = store.allParams
const handleSubmit = async () => {
  try {
    await store.updateTemplate(form.value.id, form.value)
    notificationService.success('Template updated successfully')
    emits('template-updated')
    emits('update:show', false)
  } catch (error) {
    const errorMessage = error?.response?.data?.info || error?.message || 'Failed to update template'
    notificationService.error(errorMessage)
    console.error('Error updating template:', error)
  }
}
</script>
