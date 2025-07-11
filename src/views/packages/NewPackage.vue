<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="Add Package"
    @save="handleSave"
  >
    <div class="w-full flex flex-col gap-4">
      <InputField 
        v-model="form.title"
        label="Title"
        placeholder="Enter package title"
        class="w-full"
      />
      
      <InputField 
        v-model="form.ageBegin"
        label="Age Begin"
        placeholder="Enter starting age"
        class="w-full"
      />
      
      <InputField 
        v-model="form.ageEnd"
        label="Age End"
        placeholder="Enter ending age"
        class="w-full"
      />
      
      <SelectField 
        v-model="form.relationship"
        label="Relationship"
        placeholder="Select relationship type"
        :options="relationshipOptions"
        class="w-full"
      />
      
      <InputField 
        v-model="form.price"
        label="Price"
        placeholder="Enter price"
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
import { usePackagesStore } from '@/stores/packages'
import { message } from 'ant-design-vue'

const store = usePackagesStore()

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['update:show', 'package-created'])

const form = ref({
  title: '',
  ageBegin: '',
  ageEnd: '',
  relationship: '',
  price: ''
})

const relationshipOptions = [
  { value: 'Family', label: 'Family' },
  { value: 'Individual', label: 'Individual' },
  { value: 'Group', label: 'Group' }
]

const handleSave = async () => {
  try {
    await store.createPackage(form.value)
    message.success('Package added successfully')
    resetForm()
    emits('package-created')
    emits('update:show', false)
  } catch (error) {
    message.error('Failed to add package')
    console.error(error)
  }
}

const resetForm = () => {
  form.value = {
    title: '',
    ageBegin: '',
    ageEnd: '',
    relationship: '',
    price: ''
  }
}
</script>