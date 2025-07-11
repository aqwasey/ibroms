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

      <div v-if="store.loading" class="text-gray-500 text-center py-4">
        Loading packages...
      </div>
      <div v-else>
        <div v-if="!filteredPackages.length" class="text-gray-500 text-center py-4">
          No packages found
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
import { usePackagesStore } from '@/stores/packages'
import NewPackage from '@/views/packages/NewPackage.vue'
import EditPackage from '@/views/packages/EditPackage.vue'
import ViewPackage from '@/views/packages/ViewPackage.vue'
import ConfirmDeletePackage from '@/views/packages/ConfirmDeletePackage.vue'
import PageHeader from '@/components/PageHeader.vue'
import TableComponent from '@/components/TableComponent.vue'

const showConfirm = ref(false)
const showViewModal = ref(false)
const showNewModal = ref(false)
const showEditModal = ref(false)
const selectedItemId = ref(null)
const selectedItem = ref(null)
const searchQuery = ref('')
const messageApi = inject('messageApi')

const store = usePackagesStore()

// DUMMY DATA FOR TESTING - REMOVE IN PRODUCTION
const USE_DUMMY_DATA = true; // Set this to false to use real data from API

const DUMMY_PACKAGES = [
  { 
    id: '1', 
    title: 'Standard Family', 
    ageBegin: '18', 
    ageEnd: '60', 
    relationship: 'Family',
    price: '500'
  },
  { 
    id: '2', 
    title: 'Premium Individual', 
    ageBegin: '25', 
    ageEnd: '45', 
    relationship: 'Individual',
    price: '300'
  },
  { 
    id: '3', 
    title: 'Group Enterprise', 
    ageBegin: '20', 
    ageEnd: '55', 
    relationship: 'Group',
    price: '1200'
  },
  { 
    id: '4', 
    title: 'Senior Advantage', 
    ageBegin: '60', 
    ageEnd: '85', 
    relationship: 'Individual',
    price: '450'
  },
  { 
    id: '5', 
    title: 'Youth Plan', 
    ageBegin: '8', 
    ageEnd: '18', 
    relationship: 'Individual',
    price: '200'
  }
];

// Mock the store's data if using dummy data
if (USE_DUMMY_DATA) {
  // Override the store's properties for demo purposes
  store.items = DUMMY_PACKAGES;
  store.loading = false;
}

onMounted(() => {
  if (!USE_DUMMY_DATA) {
    store.fetchPackages()
  }
})

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'ageBegin', label: 'Age Begin' },
  { key: 'ageEnd', label: 'Age End' },
  { key: 'relationship', label: 'Relationship' },
  { key: 'price', label: 'Price' }
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
  if (!searchQuery.value) return USE_DUMMY_DATA ? DUMMY_PACKAGES : store.items;
  
  const query = searchQuery.value.toLowerCase();
  const items = USE_DUMMY_DATA ? DUMMY_PACKAGES : store.items;
  
  return items.filter(p =>
    p.title?.toLowerCase().includes(query) || 
    p.ageBegin?.toLowerCase().includes(query) ||
    p.ageEnd?.toLowerCase().includes(query) ||
    p.relationship?.toLowerCase().includes(query) ||
    p.price?.toLowerCase().includes(query)
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
const handlePackageCreated = () => {
  messageApi?.success('Package created successfully!')
  // In a real app, this might refresh the data
  // In our dummy data scenario, we would push to the array
  if (!USE_DUMMY_DATA) {
    store.fetchPackages()
  }
}

// Handle package updated event
const handlePackageUpdated = () => {
  messageApi?.success('Package updated successfully!')
  // In a real app, the store would be updated
  if (!USE_DUMMY_DATA) {
    store.fetchPackages()
  }
}

// Handle package deleted event
const handlePackageDeleted = () => {
  // The actual delete operation is now handled by ConfirmDeletePackage component
  selectedItemId.value = null
  selectedItem.value = null
  
  messageApi?.success('Package deleted successfully!')
  if (!USE_DUMMY_DATA) {
    store.fetchPackages()
  }
}
</script>
