<template>
  <div class="p-6">
    <!-- Delete Confirmation Modal -->
    <ConfirmDeleteDuty 
      v-model:show="showConfirm" 
      :itemId="selectedItemId" 
      :dutyTitle="selectedItem?.title" 
      @duty-deleted="handleDutyDeleted" 
    />

    <!-- View Modal -->
    <ViewDuty 
      v-model:show="showViewModal" 
      :duty="selectedItem" 
      :loading="viewLoading"
    />
    
    <!-- New Modal -->
    <NewDuty 
      v-model:show="showNewModal" 
      @duty-created="handleDutyCreated"
    />
    
    <!-- Edit Modal -->
    <EditDuty 
      v-model:show="showEditModal" 
      :duty="selectedItem"
      :loading="editLoading"
      @duty-updated="handleDutyUpdated"
    />

    <div>
      <PageHeader 
        title="Duties" 
        subtitle="Manage all duties"
        searchPlaceholder="Search duties..."
        buttonText="Add Duty"
        @search="handleSearch"
        @button-click="showAddModal"
      />

      <div v-if="dutyStore.loading" class="text-gray-500 text-center py-4">
        Loading duties...
      </div>
      <div v-else>
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
          :selectable="true"
          @selection-change="handleSelectionChange"
        >
          <template #empty-state>
            <NoDataFound
              title="No Duties Found"
              description="You haven't added any duties yet. Create your first duty to get started."
            />
          </template>
        </TableComponent>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { useDutyStore } from '@/stores/duty'
import NewDuty from '@/views/duty/NewDuty.vue'
import EditDuty from '@/views/duty/EditDuty.vue'
import ViewDuty from '@/views/duty/ViewDuty.vue'
import ConfirmDeleteDuty from '@/views/duty/ConfirmDeleteDuty.vue'
import PageHeader from '@/components/PageHeader.vue'
import TableComponent from '@/components/TableComponent.vue'
import NoDataFound from '@/components/NoDataFound.vue'

const showConfirm = ref(false)
const showViewModal = ref(false)
const showNewModal = ref(false)
const showEditModal = ref(false)
const selectedItemId = ref(null)
const selectedItem = ref(null)
const searchQuery = ref('')
const viewLoading = ref(false)
const editLoading = ref(false)
const messageApi = inject('messageApi')

const dutyStore = useDutyStore()

// Fetch duties when component mounts
onMounted(async () => {
  try {
    await dutyStore.fetchAllDuties()
  } catch (error) {
    const errorMessage = error?.message || 'Failed to load duties'
    if (!errorMessage.includes('fetch') && !errorMessage.includes('Network Error')) {
      messageApi.error(errorMessage)
    }
    console.error('Error fetching duties:', error)
  }
})

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'description', label: 'Description' },
  { key: 'notes', label: 'Notes' },
  { key: 'created_on', label: 'Created On' },
  { key: 'updated_on', label: 'Updated On' }
]

// Pagination settings
const itemsPerPage = ref(10)
const currentPage = ref(1)

// Calculate total items for pagination
const totalItems = computed(() => filteredDuties.value.length)

// Get current page data
const data = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredDuties.value.slice(start, end)
})

// Filter duties based on search query
const filteredDuties = computed(() => {
  if (!searchQuery.value) return dutyStore.duties;
  
  const query = searchQuery.value.toLowerCase();
  
  return dutyStore.duties.filter(d =>
    d.title?.toLowerCase().includes(query) || 
    d.description?.toLowerCase().includes(query) ||
    d.notes?.toLowerCase().includes(query)
  );
})

// Event handlers
const onPageChanged = (page) => {
  currentPage.value = page
}

const onAction = async ({ action, item }) => {
  console.log(`Action ${action} performed on:`, item)

  if (action === 'view') {
    try {
      // Show immediate loading feedback
      viewLoading.value = true
      
      // Open modal immediately with basic data and loading state
      selectedItem.value = { ...item }
      showViewModal.value = true
      
      // Fetch complete duty details
      const fullDutyData = await dutyStore.fetchDutyForView(item.id)
      selectedItem.value = fullDutyData
      console.log('Updated view modal with complete duty data:', selectedItem.value)
    } catch (error) {
      messageApi.error('Failed to load duty details')
      console.error('Error fetching duty details:', error)
    } finally {
      viewLoading.value = false
    }
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

const onEditItem = async (item) => {
  try {
    // Show immediate loading feedback
    editLoading.value = true
    
    // Open modal immediately with basic data and loading state
    selectedItem.value = { ...item }
    showEditModal.value = true
    
    // Fetch complete duty details for editing
    const fullDutyData = await dutyStore.fetchDutyForView(item.id)
    selectedItem.value = fullDutyData
    console.log('Updated edit modal with complete duty data:', selectedItem.value)
  } catch (error) {
    messageApi.error('Failed to load duty details for editing')
    console.error('Error fetching duty details for edit:', error)
  } finally {
    editLoading.value = false
  }
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

// Handle duty created event
const handleDutyCreated = async () => {
  // Force refresh the duties list to ensure UI is updated
  try {
    await dutyStore.fetchAllDuties()
  } catch (error) {
    console.error('Error refreshing duties after creation:', error)
  }
}

// Handle duty updated event
const handleDutyUpdated = async () => {
  // Force refresh the duties list to ensure UI is updated
  try {
    await dutyStore.fetchAllDuties()
  } catch (error) {
    console.error('Error refreshing duties after update:', error)
  }
}

// Handle duty deleted event
const handleDutyDeleted = async () => {
  // The actual delete operation is handled by ConfirmDeleteDuty component
  selectedItemId.value = null
  selectedItem.value = null
  
  // Force refresh the duties list to ensure UI is updated
  try {
    await dutyStore.fetchAllDuties()
  } catch (error) {
    console.error('Error refreshing duties after deletion:', error)
  }
}
</script>
