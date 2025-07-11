<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="Edit Package"
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
import { ref, defineProps, defineEmits, watch } from 'vue'
import Modal from '@/components/Modal.vue'
import InputField from '@/components/InputField.vue'
import SelectField from '@/components/SelectField.vue'
import { usePackagesStore } from '@/stores/packages.js'
import { message } from 'ant-design-vue'

const store = usePackagesStore()

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  package: {
    type: Object,
    required: true
  }
})

const emits = defineEmits(['update:show', 'package-updated'])

const form = ref({
  id: '',
  title: '',
  ageBegin: '',
  ageEnd: '',
  relationship: '',
  price: ''
})

// Watch for changes in the package prop to update form
watch(() => props.package, (newVal) => {
  if (newVal) {
    form.value = { ...newVal }
  }
}, { immediate: true, deep: true })

const relationshipOptions = [
  { value: 'Individual', label: 'Individual' },
  { value: 'Family', label: 'Family' },
  { value: 'Group', label: 'Group' }
]

const handleSave = async () => {
  try {
    await store.updatePackage(form.value.id, form.value)
    message.success('Package updated successfully')
    emits('package-updated')
    emits('update:show', false)
  } catch (error) {
    message.error('Failed to update package')
    console.error(error)
  }
}
</script>