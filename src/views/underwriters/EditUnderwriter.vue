<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="Edit Underwriter"
    @save="handleSave"
  >
    <div class="w-full flex flex-col gap-4">
      <InputField 
        v-model="form.name"
        label="Title"
        placeholder="Enter underwriter name"
        class="w-full"
      />
      
      <SelectField 
        v-model="form.sector"
        label="Sector"
        placeholder="Select sector"
        :options="sectorOptions"
        class="w-full"
      />
      
      <SelectField 
        v-model="form.province"
        label="Province"
        placeholder="Select province"
        :options="provinceOptions"
        class="w-full"
      />
      
      <InputField 
        v-model="form.town_city"
        label="Town/City"
        placeholder="Enter town / city"
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
import { useUnderwritersStore } from '@/stores/underwriters'
import { message } from 'ant-design-vue'

const store = useUnderwritersStore()

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  underwriter: {
    type: Object,
    required: true
  }
})

const emits = defineEmits(['update:show'])

const form = ref({
  id: '',
  name: '',
  sector: '',
  province: '',
  town_city: ''
})

// Watch for changes in the underwriter prop to update form
watch(() => props.underwriter, (newVal) => {
  if (newVal) {
    form.value = { ...newVal }
  }
}, { immediate: true, deep: true })

const sectorOptions = [
  { value: 'Funeral', label: 'Funeral' },
  { value: 'Life', label: 'Life' },
  { value: 'Medical', label: 'Medical' },
  { value: 'General', label: 'General' }
]

const provinceOptions = [
  { value: 'Accra', label: 'Accra' },
  { value: 'Ashanti', label: 'Ashanti' },
  { value: 'Central', label: 'Central' },
  { value: 'Eastern', label: 'Eastern' },
  { value: 'Northern', label: 'Northern' }
]

const handleSave = async () => {
  try {
    await store.updateUnderwriter(form.value)
    message.success('Underwriter updated successfully')
    emits('update:show', false)
  } catch (error) {
    message.error('Failed to update underwriter')
    console.error(error)
  }
}
</script>
