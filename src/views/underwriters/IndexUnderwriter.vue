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
const store = useUnderwritersStore()

onMounted(() => {
  fetchUnderwriters()
})

// Function to fetch underwriters from API
const fetchUnderwriters = async () => {
  try {
    await store.fetchAllUnderwriters()
  } catch (error) {
    console.error('Error fetching underwriters:', error)
  }
}

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
  fetchUnderwriters() // Refresh the list
}

// Handle underwriter updated event
const handleUnderwriterUpdated = (underwriter) => {
  fetchUnderwriters() // Refresh the list
}

// Handle underwriter deleted event
const handleUnderwriterDeleted = (underwriterId) => {
  // Reset selections
  selectedItemId.value = null
  selectedItem.value = null
  
  // Refresh the list
  fetchUnderwriters()
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
