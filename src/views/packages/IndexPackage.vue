<template>
  <div class="p-6">
    <!-- Delete Confirmation Modal -->
    <ConfirmDeletePackage 
      v-model:show="showConfirm" 
      :itemId="selectedItemId" 
      :packageName="selectedItem?.title" 
      @package-deleted="handlePackageDeleted" 
    />

    <!-- View Modal -->
    <ViewPackage 
      v-model:show="showViewModal" 
      :package="selectedItem" 
    />
    
    <!-- New Modal -->
    <NewPackage 
      v-model:show="showNewModal" 
      @package-created="handlePackageCreated"
    />
    
    <!-- Edit Modal -->
    <EditPackage 
      v-model:show="showEditModal" 
      :package="selectedItem"
      @package-updated="handlePackageUpdated"
    />

    <div>
      <PageHeader 
        title="Packages" 
        subtitle="Manage all packages"
        searchPlaceholder="Search packages..."
        buttonText="Add Package"
        @search="handleSearch"
        @button-click="showAddModal"
      />

      <div v-if="packagesStore.loading" class="text-gray-500 text-center py-4">
        Loading packages...
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
              title="No Packages Found"
              description="You haven't added any packages yet. Create your first package to get started."
            />
          </template>
        </TableComponent>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { usePackagesStore } from '@/stores/packages'
import NewPackage from '@/views/packages/NewPackage.vue'
import EditPackage from '@/views/packages/EditPackage.vue'
import ViewPackage from '@/views/packages/ViewPackage.vue'
import ConfirmDeletePackage from '@/views/packages/ConfirmDeletePackage.vue'
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
const messageApi = inject('messageApi')

const packagesStore = usePackagesStore()

// Fetch packages when component mounts
onMounted(async () => {
  try {
    await packagesStore.fetchAllPackages()
  } catch (error) {
    const errorMessage = error?.message || 'Failed to load packages'
    if (!errorMessage.includes('fetch') && !errorMessage.includes('Network Error')) {
      messageApi.error(errorMessage)
    }
    console.error('Error fetching packages:', error)
  }
})

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'target', label: 'Target' },
  { key: 'price', label: 'Price' },
  { key: 'cover_amount', label: 'Cover Amount' },
  { key: 'waiting_period', label: 'Waiting Period' }
]

// Pagination settings
const itemsPerPage = ref(10)
const currentPage = ref(1)

// Calculate total items for pagination
const totalItems = computed(() => filteredPackages.value.length)

// Get current page data - in a real app, this would likely come from an API
const data = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredPackages.value.slice(start, end)
})

// Filter packages based on search query
const filteredPackages = computed(() => {
  if (!searchQuery.value) return packagesStore.packages;
  
  const query = searchQuery.value.toLowerCase();
  
  return packagesStore.packages.filter(p =>
    p.title?.toLowerCase().includes(query) || 
    p.target?.toLowerCase().includes(query) ||
    p.description?.toLowerCase().includes(query) ||
    p.price?.toString().includes(query)
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

// Handle package created event
const handlePackageCreated = async () => {
  // Force refresh the packages list to ensure UI is updated
  // Note: Success message is already shown in NewPackage.vue, no need to duplicate
  try {
    await packagesStore.fetchAllPackages()
  } catch (error) {
    console.error('Error refreshing packages after creation:', error)
  }
}

// Handle package updated event
const handlePackageUpdated = async () => {
  // Force refresh the packages list to ensure UI is updated
  // Note: Success message is already shown in EditPackage.vue, no need to duplicate
  try {
    await packagesStore.fetchAllPackages()
  } catch (error) {
    console.error('Error refreshing packages after update:', error)
  }
}

// Handle package deleted event
const handlePackageDeleted = async () => {
  // The actual delete operation is now handled by ConfirmDeletePackage component
  selectedItemId.value = null
  selectedItem.value = null
  
  // Force refresh the packages list to ensure UI is updated
  try {
    await packagesStore.fetchAllPackages()
  } catch (error) {
    console.error('Error refreshing packages after deletion:', error)
  }
}
</script>
