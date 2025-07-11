<template>
  <div class="p-6">
    <!-- Delete Confirmation Modal -->
    <ConfirmDeleteUnderwriter 
      v-model:show="showConfirm" 
      :itemId="selectedItemId" 
      :underwriterName="selectedItem?.name" 
      @underwriter-deleted="handleUnderwriterDeleted" 
    />

    <!-- View Modal -->
    <ViewUnderwriter 
      v-model:show="showViewModal" 
      :underwriter="selectedItem" 
    />
    
    <!-- New Modal -->
    <NewUnderwriter 
      v-model:show="showNewModal" 
      @underwriter-created="handleUnderwriterCreated"
    />
    
    <!-- Edit Modal -->
    <EditUnderwriter 
      v-model:show="showEditModal" 
      :underwriter="selectedItem"
      @underwriter-updated="handleUnderwriterUpdated"
    />

    <div>
      <PageHeader 
        title="Underwriters" 
        subtitle="Manage all insurance underwriters"
        searchPlaceholder="Search underwriters..."
        buttonText="Add Underwriter"
        @search="handleSearch"
        @button-click="showAddModal"
      />

      <div v-if="store.loading" class="text-gray-500 text-center py-4">
        Loading underwriters...
      </div>
      <div v-else>
        <div v-if="!filteredUnderwriters.length" class="text-gray-500 text-center py-4">
          No underwriters found
        </div>
        <TableComponent
          v-else
          :columns="columns"
          :data="data"
          :items-per-page="itemsPerPage"
          :total-items="totalItems"
          :current-page="currentPage"
          @page-changed="onPageChanged"
          @action="onAction"
          @edit-item="onEditItem"
          @delete-item="onDeleteItem"
          :selectable="true"
          @selection-change="handleSelectionChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { useUnderwritersStore } from '@/stores/underwriters'
import NewUnderwriter from '@/views/underwriters/NewUnderwriter.vue'
import EditUnderwriter from '@/views/underwriters/EditUnderwriter.vue'
import ViewUnderwriter from '@/views/underwriters/ViewUnderwriter.vue'
import ConfirmDeleteUnderwriter from '@/views/underwriters/ConfirmDeleteUnderwriter.vue'
import PageHeader from '@/components/PageHeader.vue'
import TableComponent from '@/components/TableComponent.vue'
import { useTimeAgo } from '@vueuse/core'

const showConfirm = ref(false)
const showViewModal = ref(false)
const showNewModal = ref(false)
const showEditModal = ref(false)
const selectedItemId = ref(null)
const selectedItem = ref(null)
const searchQuery = ref('')
const messageApi = inject('messageApi')

const store = useUnderwritersStore()

// DUMMY DATA FOR TESTING - REMOVE IN PRODUCTION
const USE_DUMMY_DATA = true; // Set this to false to use real data from API

const DUMMY_UNDERWRITERS = [
  { 
    id: '1', 
    name: 'ABC Insurance', 
    sector: 'Funeral', 
    province: 'Accra', 
    town_city: 'Accra Central',
    created_on: new Date('2025-03-10').toISOString(),
    updated_on: new Date('2025-05-15').toISOString()
  },
  { 
    id: '2', 
    name: 'XYZ Underwriters', 
    sector: 'Life', 
    province: 'Ashanti', 
    town_city: 'Kumasi',
    created_on: new Date('2025-01-20').toISOString(),
    updated_on: new Date('2025-06-05').toISOString()
  },
  { 
    id: '3', 
    name: 'Golden Life Insurance', 
    sector: 'Medical', 
    province: 'Eastern', 
    town_city: 'Koforidua',
    created_on: new Date('2025-02-14').toISOString(),
    updated_on: new Date('2025-04-22').toISOString()
  },
  { 
    id: '4', 
    name: 'Premier Underwriting', 
    sector: 'General', 
    province: 'Central', 
    town_city: 'Cape Coast',
    created_on: new Date('2025-04-05').toISOString(),
    updated_on: new Date('2025-06-10').toISOString()
  },
  { 
    id: '5', 
    name: 'Nationwide Insurance', 
    sector: 'Funeral', 
    province: 'Northern', 
    town_city: 'Tamale',
    created_on: new Date('2025-05-12').toISOString(),
    updated_on: new Date('2025-07-01').toISOString()
  }
];

// Mock the store's data if using dummy data
if (USE_DUMMY_DATA) {
  // Override the store's properties for demo purposes
  store.underwriters = DUMMY_UNDERWRITERS;
  store.loading = false;
}

onMounted(() => {
  if (!USE_DUMMY_DATA) {
    store.fetchAllUnderwriters()
  }
})

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'sector', label: 'Sector' },
  { key: 'province', label: 'Province' },
  { key: 'town_city', label: 'Town/City' },
  { key: 'created_on', label: 'Created On' },
  { key: 'updated_on', label: 'Updated On' }
]

// Pagination settings
const itemsPerPage = ref(10)
const currentPage = ref(1)

// Calculate total items for pagination
const totalItems = computed(() => filteredUnderwriters.value.length)

// Get current page data - in a real app, this would likely come from an API
const data = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredUnderwriters.value.slice(start, end)
})

// Filter underwriters based on search query
const filteredUnderwriters = computed(() => {
  if (!searchQuery.value) return store.underwriters;
  
  const query = searchQuery.value.toLowerCase();
  return store.underwriters.filter(u =>
    u.name?.toLowerCase().includes(query) || 
    u.sector?.toLowerCase().includes(query) ||
    u.province?.toLowerCase().includes(query) ||
    u.town_city?.toLowerCase().includes(query)
  );
})

// Event handlers
const onPageChanged = (page) => {
  currentPage.value = page
}

const onAction = ({ action, item }) => {
  console.log(`Action ${action} performed on:`, item)

  if (action === 'view') {
    // Show view modal
    selectedItem.value = { ...item } // Create a fresh copy of the item
    console.log('Showing view modal for item:', selectedItem.value)
    showViewModal.value = true
  } else if (action === 'edit') {
    onEditItem(item)
  } else if (action === 'delete') {
    onDeleteItem(item)
  }
}

const showAddModal = () => {
  showNewModal.value = true
}

const onViewItem = (item) => {
  selectedItem.value = { ...item } // Create a fresh copy of the item
  showViewModal.value = true
}

const onEditItem = (item) => {
  selectedItem.value = { ...item } // Create a fresh copy of the item
  showEditModal.value = true
}

const onDeleteItem = (item) => {
  selectedItemId.value = item.id
  selectedItem.value = item
  showConfirm.value = true
}

const handleSearch = (query) => {
  searchQuery.value = query
}

const handleSelectionChange = (selectedIds) => {
  console.log('Selected items:', selectedIds)
  // Do something with the selected IDs
}

// Handle underwriter created event
const handleUnderwriterCreated = (underwriter) => {
  messageApi?.success('Underwriter created successfully!')
  // In a real app, this might refresh the data
  // In our dummy data scenario, we would push to the array
  if (USE_DUMMY_DATA) {
    store.underwriters.push(underwriter)
  }
}

// Handle underwriter updated event
const handleUnderwriterUpdated = (underwriter) => {
  messageApi?.success('Underwriter updated successfully!')
  // In a real app, the store would be updated
  // In our dummy data scenario, we would update the array
  if (USE_DUMMY_DATA && underwriter?.id) {
    const index = store.underwriters.findIndex(u => u.id === underwriter.id)
    if (index !== -1) {
      store.underwriters[index] = { ...underwriter }
    }
  }
}

// Handle underwriter deleted event
const handleUnderwriterDeleted = (underwriterId) => {
  // The actual delete operation is now handled by ConfirmDeleteUnderwriter component
  selectedItemId.value = null
  selectedItem.value = null
  
  // Remove from dummy data if using it
  if (USE_DUMMY_DATA && underwriterId) {
    const index = store.underwriters.findIndex(u => u.id === underwriterId)
    if (index !== -1) {
      store.underwriters.splice(index, 1)
      messageApi?.success('Underwriter deleted successfully!')
    }
  }
}
</script>

<style scoped>
.text-red-500 {
  color: red;
}

.custom-table .ant-table-thead > tr > th,
.custom-table .ant-table-tbody > tr > td {
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 8px;
  padding-right: 8px;
  font-size: 14px;
}

.ant-btn-text .anticon {
  margin-right: 0;
  padding: 0 4px;
}
</style>
