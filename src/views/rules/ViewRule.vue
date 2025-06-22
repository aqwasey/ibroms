<template>
  <a-modal
    :open="visible"
    title="View Rule"
    @cancel="emit('close')"
    :footer="null">
    <a-descriptions bordered column="1">
      <a-descriptions-item label="Title">{{ rule.title }}</a-descriptions-item>
      <a-descriptions-item label="Description">{{ rule.description }}</a-descriptions-item>
      <a-descriptions-item label="Service List">{{ rule.service_list.join(', ') }}</a-descriptions-item>
      <a-descriptions-item label="Limit Type">{{ rule.limit_type }}</a-descriptions-item>
    </a-descriptions>
  </a-modal>
</template>

<script setup>
const props = defineProps({
  rule: Object,
  visible: Boolean,
})
const emit = defineEmits(['close'])
</script>

