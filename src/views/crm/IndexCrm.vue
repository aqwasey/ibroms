<template>
  <div class="p-6">
    <!-- Delete Confirmation Modal -->
    <ConfirmDeleteCrm
      v-model:show="showConfirm"
      :itemId="selectedItemId"
      :crmName="selectedItem?.otherNames || 'this CRM'"
      @crm-deleted="handleCrmDeleted"
    />

    <!-- View Modal -->
    <ViewCrm
      v-model:show="showViewModal"
      :crm="selectedItem"
    />
    
    <!-- New Modal -->
    <NewCrm
      v-model:show="showNewModal"
      @crm-created="handleCrmCreated"
    />
    
    <!-- Edit Modal -->
    <EditCrm
      v-model:show="showEditModal"
      :crm="selectedItem"
      @crm-updated="handleCrmUpdated"
    />

    <div>
      <PageHeader 
        title="CRM" 
        subtitle="Manage all CRM"
        buttonText="Add CRM" 
        @button-click="showAddModal"
      />

      <div class="mt-8">
        <TableComponent 
          :columns="columns" 
          :data="filteredData"
          :loading="loading"
          :searchable="true"
          :selectable="true"
          @search="searchData"
          @action="onAction"
          @edit-item="handleEdit"
          @delete-item="handleDelete"
          @selection-change="handleSelectionChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCrmStore } from '@/stores/crm'
import PageHeader from '@/components/PageHeader.vue'
import TableComponent from '@/components/TableComponent.vue'
import ConfirmDeleteCrm from './ConfirmDeleteCrm.vue'
import ViewCrm from './ViewCrm.vue'
import NewCrm from './NewCrm.vue'
import EditCrm from './EditCrm.vue'

const store = useCrmStore()

// Table configuration
const columns = [
  { label: 'Other Name(s)', key: 'otherNames' },
  { label: 'Surname', key: 'surname' },
  { label: 'Gender', key: 'gender' },
  { label: 'Date of Birth', key: 'dateOfBirth' },
  { label: 'ID Type', key: 'idType' },
  { label: 'ID Number', key: 'idNumber' }
]

// Data handling
const loading = ref(false)
const searchTerm = ref('')
const showConfirm = ref(false)
const showViewModal = ref(false)
const showNewModal = ref(false)
const showEditModal = ref(false)
const selectedItemId = ref('')
const selectedItem = ref(null)

// Get data from store
const fetchData = async () => {
  loading.value = true
  await store.fetchCrmList()
  loading.value = false
}

// Filter data based on search term
const filteredData = computed(() => {
  if (!searchTerm.value) return store.crmList

  return store.crmList.filter(item => {
    const searchString = searchTerm.value.toLowerCase()
    return (
      (item.otherNames?.toLowerCase().includes(searchString)) ||
      (item.surname?.toLowerCase().includes(searchString)) ||
      (item.gender?.toLowerCase().includes(searchString)) ||
      (item.idNumber?.toLowerCase().includes(searchString))
    )
  })
})

// Handlers for table actions
const showAddModal = () => {
  showNewModal.value = true
}

const onAction = ({ action, item }) => {
  console.log(`Action ${action} performed on:`, item)

  if (action === 'view') {
    // Show view modal
    selectedItem.value = { ...item } // Create a fresh copy of the item
    console.log('Showing view modal for item:', selectedItem.value)
    showViewModal.value = true
  } else if (action === 'edit') {
    handleEdit(item)
  } else if (action === 'delete') {
    handleDelete(item)
  }
}

const handleEdit = (item) => {
  selectedItem.value = { ...item }
  showEditModal.value = true
}

const handleDelete = (item) => {
  selectedItem.value = item
  selectedItemId.value = item.id
  showConfirm.value = true
}

// Handlers for modal actions
const searchData = (term) => {
  searchTerm.value = term
}

const handleCrmCreated = () => {
  fetchData()
}

const handleCrmUpdated = () => {
  fetchData()
}

const handleCrmDeleted = () => {
  fetchData()
}

// Handler for checkbox selection
const handleSelectionChange = (selectedIds) => {
  console.log('Selected CRM items:', selectedIds)
  // You can store the selected IDs for batch operations or other actions
}

// Fetch data on component mount
onMounted(() => {
  fetchData()
})
</script>
