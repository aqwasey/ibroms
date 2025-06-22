<template>
  <a-modal :open="visible" title="Edit Rule" @cancel="emit('close')" @ok="submit">
    <a-form layout="vertical">
      <a-form-item label="Title">
        <a-input v-model:value="form.title" />
      </a-form-item>

      <a-form-item label="Description">
        <a-textarea v-model:value="form.description" />
      </a-form-item>

      <a-form-item label="Service List">
        <a-select v-model:value="form.service_list" mode="tags" />
      </a-form-item>

      <a-form-item label="Limit Type">
        <a-select v-model:value="form.limit_type">
          <a-select-option value="RESTRICTED">RESTRICTED</a-select-option>
          <a-select-option value="UNLIMITED">UNLIMITED</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { hydrateOnVisible, ref, watch } from 'vue'
import { useRulesStore } from '@/stores/rules'

const props = defineProps({
  rule: Object,
  visible: Boolean
 })
const emit = defineEmits(['close'])
const store = useRulesStore()

const form = ref({
  title: '',
  description: '',
  service_list: [],
  limit_type: 'RESTRICTED'
})

watch(() => props.rule, (val) => {
  if (val) form.value = { ...val }
}, { immediate: true })

const submit = async () => {
  await store.updateRuleById(props.rule.id, form.value)
  emit('close')
}
</script>
