<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="Add Group Scheme"
    @save="handleSave"
  >
    <div class="w-full flex flex-col gap-4">
      <InputField 
        v-model="form.name"
        label="Group Scheme Name"
        placeholder="Enter group scheme name"
        class="w-full"
      />
      
      <InputField 
        v-model="form.code"
        label="Group Scheme Code"
        placeholder="Enter group scheme code"
        class="w-full"
      />
      
      <SelectField 
        v-model="form.category"
        label="Category"
        placeholder="Select category"
        :options="categoryOptions"
        class="w-full"
      />
      
      <SelectField 
        v-model="form.underwriter"
        label="Underwriter"
        placeholder="Select underwriter"
        :options="underwriterOptions"
        class="w-full"
      />
      
      <InputField 
        v-model="form.premium"
        label="Premium"
        placeholder="Enter premium amount"
        class="w-full"
      />
    </div>
  </Modal>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import Modal from '@/components/Modal.vue'
import InputField from '@/components/InputField.vue'
import SelectField from '@/components/SelectField.vue'
import { useGroupSchemesStore } from '@/stores/group-schemes'
import { message } from 'ant-design-vue'

const store = useGroupSchemesStore()

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['update:show', 'group-scheme-created'])

const form = ref({
  name: '',
  code: '',
  category: '',
  underwriter: '',
  premium: ''
})

const categoryOptions = [
  { value: 'Health', label: 'Health' },
  { value: 'Life', label: 'Life' },
  { value: 'Auto', label: 'Auto' },
  { value: 'Property', label: 'Property' },
  { value: 'Travel', label: 'Travel' }
]

const underwriterOptions = [
  { value: 'Global Insurance', label: 'Global Insurance' },
  { value: 'Secure Life Ltd', label: 'Secure Life Ltd' },
  { value: 'Motor Protect Inc', label: 'Motor Protect Inc' },
  { value: 'Home Shield Co', label: 'Home Shield Co' },
  { value: 'Journey Safe Corp', label: 'Journey Safe Corp' }
]

const handleSave = async () => {
  try {
    await store.createGroupScheme(form.value)
    message.success('Group Scheme added successfully')
    resetForm()
    emits('group-scheme-created')
    emits('update:show', false)
  } catch (error) {
    message.error('Failed to add group scheme')
    console.error(error)
  }
}

const resetForm = () => {
  form.value = {
    name: '',
    code: '',
    category: '',
    underwriter: '',
    premium: ''
  }
}
</script>