<template>
  <a-modal :open="visible" title="Edit Template" @cancel="emit('close')" @ok="submit">
    <a-form layout="vertical">
      <a-form-item label="Title"><a-input v-model:value="form.title" /></a-form-item>
      <a-form-item label="Category"><a-input v-model:value="form.category" /></a-form-item>
      <a-form-item label="Type"><a-input v-model:value="form.template_type" /></a-form-item>
      <a-form-item label="Params List">
        <a-select v-model:value="form.params_list" mode="tags" />
      </a-form-item>
      <a-form-item label="Template Content">
        <a-textarea v-model:value="form.template" rows="4" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useTemplateStore } from '@/stores/templates'
const props = defineProps({ template: Object, visible: Boolean })
const emit = defineEmits(['close'])
const store = useTemplateStore()

const form = ref({})

watch(() => props.template, (t) => {
  if (t) form.value = { ...t }
}, { immediate: true })

const submit = async () => {
  await store.updateTemplateById(props.template.id, form.value)
  emit('close')
}
</script>
