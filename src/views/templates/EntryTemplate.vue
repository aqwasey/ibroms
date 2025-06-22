<template>
  <a-modal
    :open="visible"
    @update:open="emit('update:visible', $event)"
    title="New Template"
    @cancel="emit('close')"
    @ok="submit"
  >
    <a-form layout="vertical">
      <a-form-item label="Title">
        <a-input v-model:value="form.title" />
      </a-form-item>

      <a-form-item label="Category">
        <a-input v-model:value="form.category" />
      </a-form-item>

      <a-form-item label="Type">
        <a-select v-model:value="form.template_type" placeholder="Select a type">
          <a-select-option
            v-for="item in store.template_types"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="Params List">
        <a-select
          v-model:value="form.params_list"
          mode="tags"
          placeholder="Add parameters"
          allowClear
        >
          <a-select-option
            v-for="param in store.allparams"
            :key="param.key"
            :value="param.label"
          >
            {{ param.label }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item :label="templateLabel">
        <a-textarea
          v-model:value="form.template"
          :rows="form.template_type === 'EMAIL' ? 6 : 4"
          :maxlength="templateMaxLength || undefined"
          :showCount="false"
        />

        <!-- Live feedback below text area -->
        <div class="mt-1 text-sm" v-if="form.template_type === 'SMS'">
          <span
            :class="[
              remainingChars < 0 ? 'text-red-500 font-semibold' : 'text-gray-500'
            ]"
          >
            {{ remainingChars < 0
              ? `Maximum length exceeded (${templateMaxLength} characters)`
              : `${remainingChars} characters remaining` }}
          </span>
        </div>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTemplateStore } from '@/stores/templates'

const props = defineProps({ visible: Boolean })
const emit = defineEmits(['close', 'update:visible'])

const store = useTemplateStore()

const form = ref({
  title: '',
  category: 'UNCATEGORIZED',
  template_type: '',
  params_list: [],
  template: ''
})

// Combine all parameters from groups
const allParams = computed(() => {
  return store.parameters?.flatMap(group => group.params) || []
})

// Set max length for SMS type
const templateMaxLength = computed(() =>
  form.value.template_type === 'SMS' ? 160 : null
)

// Display label for template field
const templateLabel = computed(() =>
  form.value.template_type === 'SMS'
    ? 'Template Content (Max 160 characters)'
    : 'Template Content'
)

// Track remaining characters
const remainingChars = computed(() =>
  templateMaxLength.value !== null
    ? templateMaxLength.value - form.value.template.length
    : null
)

const submit = async () => {
  if (remainingChars.value < 0) {
    // Prevent save if content too long
    return
  }

  await store.createTemplate(form.value)
  emit('update:visible', false)
  emit('close')
}
</script>

<style scoped>
.text-red-500 {
  color: #ef4444;
}
.text-gray-500 {
  color: #6b7280;
}
.font-semibold {
  font-weight: 600;
}
.mt-1 {
  margin-top: 0.25rem;
}
</style>
