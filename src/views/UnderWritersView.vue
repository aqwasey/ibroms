<template>
  <div class="p-4">

    <Modal
      :show="isOpen"
      :loading="underwritersStore.adding"
      title="Add Underwriter"
      :close="() => {
        isOpen = false;
      }"
    >
      <a-form
        size="large"
        layout="vertical"
        :model="formState"
        name="basic"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed">
        <a-form-item
          label="Title"
          name="name"
          :rules="[{ required: true, message: 'Required' }]">
          <a-input v-model:value="formState.name" />
        </a-form-item>

        <a-form-item
          label="Sector"
          name="sector"
          :rules="[{ required: true, message: 'Required' }]">
          <a-select placeholder="Select Sector" show-search allow-clear
                    v-model:value="formState.sector">
            <a-select-option value="Funeral">Funeral</a-select-option>
            <a-select-option value="Sector 1">Sector 1</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          label="Province"
          name="province"
          :rules="[{ required: true, message: 'Required' }]">
          <a-select placeholder="Select Province" allow-clear v-model:value="formState.province">
            <a-select-option value="Province 1">Province 1</a-select-option>
            <a-select-option value="Province 2">Province 2</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          label="Town/City"
          name="town_city"
          :rules="[{ required: true, message: 'Required' }]">
          <a-input v-model:value="formState.town_city" />
        </a-form-item>
        <div class="flex justify-end gap-3">
          <button @click="isOpen = false" class="btn-light">
            Cancel
          </button>
          <a-button type="primary" class="btn-primary" html-type="submit">Save</a-button>
        </div>
      </a-form>

    </Modal>
    <div v-if="underwritersStore.loading" class="text-black text-2xl">
      Loading underwriters...
    </div>
    <div v-else>
      <div v-if="!underwritersStore.underwriters.length" class="text-gray-500 text-center py-4">
        No underwriters found
      </div>
      <div v-else>
        <div class="flex justify-between items-center py-4">
          <h2 class="text-[30px] font-medium text-i-gray-900">Underwriters</h2>
          <div class="flex gap-4 items-center">
            <InputField
              type="text"
              class="text-center rounded bg-gray-50 text-sm"
            />
            <Button @click="openModal">New Underwriter</Button>
          </div>
        </div>
        <div>
          <div class="flex items-center gap-x-5">
            <Icon name="share" size="24" color="#2A2A2A" />
            <Icon name="export" size="24" color="#2A2A2A" />
          </div>
        </div>
        <TableComponent
          :columns="columns"
          :data="data"
          :items-per-page="itemsPerPage"
          :total-items="totalItems"
          :current-page="currentPage"
          @page-changed="onPageChanged"
          @action="onAction"
          @edit-item="onEditItem"
          @delete-item="onDeleteItem"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, onMounted, reactive, ref } from 'vue'
import TableComponent from '@/components/TableComponent.vue'
import Modal from '@/components/Modal.vue'
import { useUnderwritersStore } from '@/stores/underwriters.js'
import Icon from '@/components/icon.vue'
import Button from '@/components/Button.vue'
import InputField from '@/components/InputField.vue'

const messageApi = inject('messageApi')

const underwritersStore = useUnderwritersStore()
const { error, fetchUnderwriters } = underwritersStore

onMounted(() => {
  fetchUnderwriters()
})

const isOpen = ref(false)
// Define columns configuration
const columns = [
  { key: 'name', label: 'TITLE' },
  { key: 'sector', label: 'SECTOR' },
  { key: 'province', label: 'PROVINCE' },
  { key: 'town_city', label: 'TOWN/CITY' },
  { key: 'created_on', label: 'CREATED ON' },
  { key: 'updated_on', label: 'UPDATED ON' }
]

// Pagination settings
const itemsPerPage = ref(10)
const currentPage = ref(1)

// Calculate total items for pagination
const totalItems = computed(() => underwritersStore.underwriters.length)

// Get current page data - in a real app, this would likely come from an API
const data = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return underwritersStore.underwriters.slice(start, end)
})

// Event handlers
const onPageChanged = (page) => {
  currentPage.value = page
  console.log(`Page changed to: ${page}`)
  // In a real app, you might fetch data for the new page here
}

const onAction = ({ action, item }) => {
  console.log(`Action ${action} performed on:`, item)
}

const openModal = () => {
  isOpen.value = true
}

const closeModal = () => {
  isOpen.value = false
}

const onEditItem = (item) => {
  console.log('Editing product:', item)
  // In a real app, you might show a form or modal with item data here
}

const onDeleteItem = (item) => {
  console.log('Delete request for product:', item)

  // Simple confirmation
  if (confirm(`Are you sure you want to delete product ${item.itemCode}?`)) {
    // Remove from our local data
    underwritersStore.underwriters = underwritersStore.underwriters.filter(p => p.id !== item.id)
    console.log(`Product ${item.itemCode} deleted`)

    // In a real app, you would make an API call here
  }
}

const formState = reactive({
  name: '',
  sector: '',
  town_city: '',
  province: ''
})

const onFinish = async values => {
  try {
    await underwritersStore.createUnderwriter({
      ...values,
      id: '',
      description: '',
      website: ''
    })

    messageApi.success('Form submitted successfully!')
    closeModal()
  } catch (error) {
    messageApi.error(error?.response?.data?.info ?? 'Something went wrong')
  }
}
const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo)
}
</script>

