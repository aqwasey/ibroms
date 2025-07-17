<template>
  <Modal :show="show" :close="() => $emit('update:show', false)" title="Add Template" @save="handleSave">
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
import { ref, defineProps, defineEmits } from 'vue'
import Modal from '@/components/Modal.vue'
import InputField from '@/components/InputField.vue'
import SelectField from '@/components/SelectField.vue'
import TagInput from '@/components/TagInput.vue'
import { useTemplateStore } from '@/stores/templates'
import { message } from 'ant-design-vue'
const store = useTemplateStore()
const props = defineProps({ show: { type: Boolean, default: false } })
const emits = defineEmits(['update:show', 'template-created'])
const form = ref({ title: '', category: 'UNCATEGORIZED', template_type: '', params_list: [], template: '' })
const categoryOptions = [ { value: 'UNCATEGORIZED', label: 'Uncategorized' }, { value: 'POLICY', label: 'Policy' }, { value: 'MARKETING', label: 'Marketing' }, { value: 'NOTIFICATION', label: 'Notification' } ]
const templateTypeOptions = store.template_types
const paramOptions = store.allParams
const handleSave = async () => {
  try {
    await store.createTemplate(form.value)
    message.success('Template added successfully')
    resetForm()
    emits('template-created')
    emits('update:show', false)
  } catch (error) {
    message.error('Failed to add template')
    console.error(error)
  }
}
const resetForm = () => { form.value = { title: '', category: 'UNCATEGORIZED', template_type: '', params_list: [], template: '' } }
</script>