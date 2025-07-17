<template>
  <Modal :show="show" :close="() => $emit('update:show', false)"
    title="Edit Template"
    variant="edit"
    :loading="loading"
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
      <div class="w-full">
        <label class="block text-sm font-medium text-gray-700 mb-1">Template Content</label>
        <textarea v-model="form.template" class="w-full border border-gray-300 rounded-md p-2 min-h-[150px]" placeholder="Enter template content"></textarea>
      </div>
    </div>
  </Modal>
</template>
<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'
import Modal from '@/components/Modal.vue'
import InputField from '@/components/InputField.vue'
import SelectField from '@/components/SelectField.vue'
import TagInput from '@/components/TagInput.vue'
import { useTemplateStore } from '@/stores/templates'
import { message } from 'ant-design-vue'
const store = useTemplateStore()
const props = defineProps({ show: { type: Boolean, default: false }, template: { type: Object, required: true } })
const emits = defineEmits(['update:show', 'template-updated'])
const form = ref({ id: '', title: '', category: 'UNCATEGORIZED', template_type: '', params_list: [], template: '' })
watch(() => props.template, (newVal) => { if (newVal) { form.value = { ...newVal, params_list: newVal.params_list || [] } } }, { immediate: true, deep: true })
const categoryOptions = [ { value: 'UNCATEGORIZED', label: 'Uncategorized' }, { value: 'POLICY', label: 'Policy' }, { value: 'MARKETING', label: 'Marketing' }, { value: 'NOTIFICATION', label: 'Notification' } ]
const templateTypeOptions = store.template_types
const paramOptions = store.allParams
const handleSave = async () => {
  try {
    await store.updateTemplate(form.value.id, form.value)
    message.success('Template updated successfully')
    emits('template-updated')
    emits('update:show', false)
  } catch (error) {
    message.error('Failed to update template')
    console.error(error)
  }
}
</script>
