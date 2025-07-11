<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="Add Underwriter"
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
import { ref, defineProps, defineEmits } from 'vue'
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
  }
})

const emits = defineEmits(['update:show'])

const form = ref({
  name: '',
  sector: '',
  province: '',
  town_city: ''
})

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
    await store.createUnderwriter(form.value)
    message.success('Underwriter added successfully')
    resetForm()
    emits('update:show', false)
  } catch (error) {
    message.error('Failed to add underwriter')
    console.error(error)
  }
}

const resetForm = () => {
  form.value = {
    name: '',
    sector: '',
    province: '',
    town_city: ''
  }
}
</script>
