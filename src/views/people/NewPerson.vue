<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="Add Person"
    variant="create"
    :loading="loading"
    showActions
    @confirm="handleSubmit"
    confirmButtonText="Create Person"
    size="xl"
  >
    <div class="w-full flex flex-col gap-4">
      <!-- Creation Type Selection -->
      <SelectField
        v-model="creationType"
        label="Creation Type"
        placeholder="Select creation type"
        :options="creationTypeOptions"
        class="w-full"
      />
      
      <SpaceComponent direction="vertical" size="lg" />

      <!-- Basic Person Fields (Always shown) -->
      <div class="border-t pt-4">
        <h3 class="text-sm font-medium text-gray-700 mb-3">Personal Information</h3>
        <div class="grid grid-cols-2 gap-4">
          <InputField
            v-model="formData.person.othername"
            label="Other Name(s)"
            placeholder="Enter other names"
            validation-type="text"
            :validation-options="{ maxLength: 100 }"
            class="w-full"
          />

          <InputField
            v-model="formData.person.surname"
            label="Surname"
            placeholder="Enter surname"
            validation-type="text"
            :validation-options="{ maxLength: 50 }"
            class="w-full"
          />

          <SelectField
            v-model="formData.person.gender"
            label="Gender"
            placeholder="Select gender"
            :options="genderOptions"
            class="w-full"
          />

        </div>
        
        <SpaceComponent direction="vertical" size="lg" />

        <div class="grid grid-cols-3 gap-4">
          <InputField
            v-model="formData.person.birthdate"
            label="Date of Birth"
            placeholder="YYYY-MM-DD"
            type="date"
            class="w-full"
          />

          <SelectField
            v-model="formData.person.id_type"
            label="ID Type"
            placeholder="Select ID type"
            :options="idTypeOptions"
            class="w-full"
          />

          <InputField
            v-model="formData.person.idno"
            label="ID Number"
            placeholder="Enter ID number"
            validation-type="text"
            :validation-options="{ maxLength: 20 }"
            class="w-full"
          />
        </div>
      </div>

      <!-- Contact Information (for with-contact and full types) -->
      <div v-if="showContactFields" class="border-t pt-4">
        <h3 class="text-sm font-medium text-gray-700 mb-3">Contact Information</h3>
        <div class="grid grid-cols-3 gap-4">
          <SelectField
            v-model="formData.contact.item"
            label="Contact Type"
            placeholder="Select contact type"
            :options="contactTypeOptions"
            class="w-full"
          />

          <InputField
            v-model="formData.contact.value"
            label="Contact Value"
            placeholder="Enter contact value"
            validation-type="text"
            :validation-options="{ maxLength: 100 }"
            class="w-full"
          />

        </div>
        
        <SpaceComponent direction="vertical" size="lg" />

        <div>
          <InputField
            v-model="formData.contact.remarks"
            label="Remarks"
            placeholder="Enter remarks (optional)"
            validation-type="text"
            :validation-options="{ maxLength: 200 }"
            class="w-full"
          />
        </div>
      </div>

      <!-- Document Information (for with-docs and full types) -->
      <div v-if="showDocumentFields" class="border-t pt-4">
        <DocumentsManager v-model="formData.docs" />
      </div>
      
      <SpaceComponent direction="vertical" size="lg" />
    </div>
  </Modal>
</template>

<script setup>
import { ref, reactive, computed, defineProps, defineEmits, inject } from 'vue'
import Modal from '@/components/Modal.vue'
import InputField from '@/components/InputField.vue'
import SelectField from '@/components/SelectField.vue'
import DocumentsManager from '@/components/DocumentsManager.vue'
import SpaceComponent from '@/components/SpaceComponent.vue'
import { usePeopleStore } from '@/stores/people.js'

const { show } = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:show', 'person-created'])

// Store and services
const store = usePeopleStore()
const messageApi = inject('messageApi')

// Form data and state
const loading = ref(false)
const creationType = ref('basic')
const formData = reactive({
  person: {
    othername: '',
    surname: '',
    gender: '',
    id_type: '',
    idno: '',
    birthdate: ''
  },
  contact: {
    item: '',
    value: '',
    remarks: ''
  },
  docs: [
    {
      doc_kind: '',
      doc_path: '',
      filename: '',
      notes: ''
    }
  ]
})


// Creation type options
const creationTypeOptions = [
  { value: 'basic', label: 'Basic Person' },
  { value: 'with-contact', label: 'Person with Contact' },
  { value: 'with-docs', label: 'Person with Documents' },
  { value: 'full', label: 'Full Person Profile' }
]

// Options for select fields
const genderOptions = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' }
]

const idTypeOptions = [
  { value: 'PASSPORT', label: 'Passport' },
  { value: 'NATIONAL_ID', label: 'National ID' },
  { value: 'DRIVERS_LICENSE', label: 'Driver\'s License' }
]

const contactTypeOptions = [
  { value: 'email', label: 'Email' },
  { value: 'mobile', label: 'Mobile Phone' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'landline', label: 'Landline' },
  { value: 'address', label: 'Address' }
]


// Computed properties for conditional field display
const showContactFields = computed(() => {
  return creationType.value === 'with-contact' || creationType.value === 'full'
})

const showDocumentFields = computed(() => {
  return creationType.value === 'with-docs' || creationType.value === 'full'
})


// Form validation
const validateForm = () => {
  // Validate person fields
  if (!formData.person.othername || !formData.person.surname ||
      !formData.person.gender || !formData.person.id_type ||
      !formData.person.idno || !formData.person.birthdate) {
    return false
  }

  // Validate contact fields if required
  if (showContactFields.value) {
    if (!formData.contact.item || !formData.contact.value) {
      return false
    }
  }

  // Validate document fields if required
  if (showDocumentFields.value) {
    for (const doc of formData.docs) {
      if (!doc.doc_kind || !doc.doc_path || !doc.filename) {
        return false
      }
    }
  }

  return true
}

const handleSubmit = async () => {
  if (!validateForm()) {
    messageApi.error('Please fill in all required fields')
    return
  }

  try {
    loading.value = true

    // Call appropriate API method based on creation type
    switch (creationType.value) {
      case 'basic':
        await store.createPerson(formData.person)
        break
      case 'with-contact':
        await store.createPersonWithContact(formData.person, formData.contact)
        break
      case 'with-docs':
        await store.createPersonWithDocs(formData.person, formData.docs)
        break
      case 'full':
        await store.createPersonFull(formData.person, formData.contact, formData.docs)
        break
      default:
        await store.createPerson(formData.person)
    }

    messageApi.success('Person created successfully')
    emit('person-created')
    emit('update:show', false)

    // Reset form data
    resetForm()
  } catch (error) {
    console.error(error)
    messageApi.error(error?.response?.data?.info ?? 'Error creating Person')
  } finally {
    loading.value = false
  }
}

// Reset form function
const resetForm = () => {
  creationType.value = 'basic'
  formData.person = {
    othername: '',
    surname: '',
    gender: '',
    id_type: '',
    idno: '',
    birthdate: ''
  }
  formData.contact = {
    item: '',
    value: '',
    remarks: ''
  }
  formData.docs = [
    {
      doc_kind: '',
      doc_path: '',
      filename: '',
      notes: ''
    }
  ]
}
</script>
