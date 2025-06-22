<template>
  <a-modal :open="visible" title="Create Rule" @cancel="emit('close')" @ok="submit">
    <a-form layout="vertical">
      <a-form-item label="Title">
        <a-input v-model:value="form.title" />
      </a-form-item>

      <a-form-item label="Description">
        <a-textarea v-model:value="form.description" />
      </a-form-item>

      <a-form-item label="Service List">
        <a-select v-model:value="form.service_list" mode="tags" placeholder="Add services" />
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
import { ref } from 'vue'
import { useRulesStore } from '@/stores/rules'

const emit = defineEmits(['close'])
const store = useRulesStore()
const props = defineProps({
  visible: {
    type: Boolean,
    default: true
  }
})
const form = ref({
  title: '',
  description: '',
  service_list: [],
  limit_type: 'RESTRICTED'
})

const submit = async () => {
  await store.createRule(form.value)
  emit('close')
}
</script>
