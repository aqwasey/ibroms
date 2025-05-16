<template>
  <div class="p-4">

    <Modal title="Add Underwriter" :show="isOpen" :close="() => isOpen = false">
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
          name="title"
          :rules="[{ required: true, message: 'Required' }]">
          <a-input v-model:value="formState.title" />
        </a-form-item>

        <a-form-item
          label="Sector"
          name="sector"
          :rules="[{ required: true, message: 'Required' }]">
          <a-select placeholder="Select Sector" show-search allow-clear v-model:value="formState.sector" >
            <a-select-option value="1">Option 1</a-select-option>
            <a-select-option value="2">Option 2</a-select-option>
            <a-select-option value="3">Option 3</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          label="Province"
          name="province"
          :rules="[{ required: true, message: 'Required' }]">
          <a-select placeholder="Select Province" allow-clear v-model:value="formState.province" >
            <a-select-option value="1">Option 1</a-select-option>
            <a-select-option value="2">Option 2</a-select-option>
            <a-select-option value="3">Option 3</a-select-option>
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
          <a-button type="primary" class="btn-primary" html-type="submit">Submit</a-button>
        </div>
      </a-form>

    </Modal>
    <div v-if="underwritersStore.loading" class="text-black text-2xl">Loading underwriters...</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>
    <div v-else>
      <div v-if="!underwritersStore.underwriters.length" class="text-gray-500 text-center py-4">No underwriters found</div>
      <TableComponent
        v-else
        :columns="columns"
        :data="data"
        :items-per-page="itemsPerPage"
        :total-items="totalItems"
        :current-page="currentPage"
        @page-changed="onPageChanged"
        @action="onAction"
        @add-item="onAddItem"
        @edit-item="onEditItem"
        @delete-item="onDeleteItem"
        title="Underwriters"
        search-placeholder="Search underwriter"
        button-label="New Underwriter"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import TableComponent from '@/components/TableComponent.vue'
import Modal from '@/components/Modal.vue'
import { useUnderwritersStore } from '@/stores/underwriters.js'

const underwritersStore = useUnderwritersStore();
const {  error, fetchUnderwriters } = underwritersStore;


watch(underwritersStore.loading, (newVal) => {
  console.log('Loading state:', newVal);
});

onMounted(() => {
  console.log('Component mounted, fetching underwriters...');
  fetchUnderwriters();
});

const isOpen = ref(false)
// Define columns configuration
const columns = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'TITLE' },
  { key: 'sector', label: 'SECTOR' },
  { key: 'province', label: 'PROVINCE' },
  { key: 'town_city', label: 'TOWN/CITY' },
  { key: 'created_at', label: 'CREATED ON' },
  { key: 'updated_at', label: 'UPDATED ON' }
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

const onAddItem = () => {
  isOpen.value = true
  // In a real app, you might show a form or modal here
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
  title: '',
  sector: '',
  town_city: '',
  province: '',
})

const onFinish = values => {
  console.log('Success:', values)
}
const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo)
}
</script>

