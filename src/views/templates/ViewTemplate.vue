<template>
  <a-modal :open="true" :footer="null" title="View Template" @cancel="emit('close')">
    <a-descriptions bordered column="1">
      <a-descriptions-item label="Title">{{ template.title }}</a-descriptions-item>
      <a-descriptions-item label="Category">{{ template.category }}</a-descriptions-item>
      <a-descriptions-item label="Type">{{ template.template_type }}</a-descriptions-item>
      <a-descriptions-item label="Params">{{ template.params_list?.join(', ') }}</a-descriptions-item>
      <a-descriptions-item label="Template">{{ template.template }}</a-descriptions-item>
    </a-descriptions>
  </a-modal>
</template>

<script setup>
const props = defineProps({ template: Object })
const emit = defineEmits(['close'])
</script>
