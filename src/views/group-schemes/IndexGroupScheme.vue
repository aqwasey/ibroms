<template>
  <div class="p-6">
    <!-- Delete Confirmation Modal -->
    <ConfirmDeleteGroupScheme 
      v-model:show="showConfirm" 
      :itemId="selectedItemId" 
      :groupSchemeName="selectedItem?.name" 
      @group-scheme-deleted="handleGroupSchemeDeleted" 
    />

    <!-- View Modal -->
    <ViewGroupScheme 
      v-model:show="showViewModal" 
      :groupScheme="selectedItem" 
    />
    
    <!-- New Modal -->
    <NewGroupScheme 
      v-model:show="showNewModal" 
      @group-scheme-created="handleGroupSchemeCreated"
    />
    
    <!-- Edit Modal -->
    <EditGroupScheme 
      v-model:show="showEditModal" 
      :groupScheme="selectedItem"
      @group-scheme-updated="handleGroupSchemeUpdated"
    />

    <div>
      <PageHeader 
        title="Group Schemes" 
        subtitle="Manage all group schemes"
        searchPlaceholder="Search groupSchemes..."
        buttonText="Add Group Scheme"
        @search="handleSearch"
        @button-click="showAddModal"
      />

      <div v-if="store.loading" class="text-gray-500 text-center py-4">
        Loading groupSchemes...
      </div>
      <div v-else>
        <div v-if="!filteredGroupSchemes.length" class="text-gray-500 text-center py-4">
          No group schemes found
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
import { useGroupSchemesStore } from '@/stores/group-schemes'
import NewGroupScheme from '@/views/group-schemes/NewGroupScheme.vue'
import EditGroupScheme from '@/views/group-schemes/EditGroupScheme.vue'
import ViewGroupScheme from '@/views/group-schemes/ViewGroupScheme.vue'
import ConfirmDeleteGroupScheme from '@/views/group-schemes/ConfirmDeleteGroupScheme.vue'
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

const store = useGroupSchemesStore()

// DUMMY DATA FOR TESTING - REMOVE IN PRODUCTION
const USE_DUMMY_DATA = true; // Set this to false to use real data from API

const DUMMY_PRODUCTS = [
  { 
    id: '1', 
    name: 'Health Insurance Basic', 
    code: 'HIB-001', 
    category: 'Health', 
    underwriter: 'Global Insurance',
    premium: '250'
  },
  { 
    id: '2', 
    name: 'Life Insurance Premium', 
    code: 'LIP-002', 
    category: 'Life', 
    underwriter: 'Secure Life Ltd',
    premium: '500'
  },
  { 
    id: '3', 
    name: 'Auto Insurance Plus', 
    code: 'AIP-003', 
    category: 'Auto', 
    underwriter: 'Motor Protect Inc',
    premium: '350'
  },
  { 
    id: '4', 
    name: 'Property Insurance', 
    code: 'PI-004', 
    category: 'Property', 
    underwriter: 'Home Shield Co',
    premium: '400'
  },
  { 
    id: '5', 
    name: 'Travel Insurance', 
    code: 'TI-005', 
    category: 'Travel', 
    underwriter: 'Journey Safe Corp',
    premium: '150'
  }
];

// Mock the store's data if using dummy data
if (USE_DUMMY_DATA) {
  // Override the store's properties for demo purposes
  store.groupSchemes = DUMMY_PRODUCTS;
  store.loading = false;
}

onMounted(() => {
  if (!USE_DUMMY_DATA) {
    store.fetchGroupSchemes()
  }
})

const columns = [
  { key: 'name', label: 'Group Scheme Name' },
  { key: 'code', label: 'Group Scheme Code' },
  { key: 'category', label: 'Category' },
  { key: 'underwriter', label: 'Underwriter' },
  { key: 'premium', label: 'Premium' }
]

// Pagination settings
const itemsPerPage = ref(10)
const currentPage = ref(1)

// Calculate total items for pagination
const totalItems = computed(() => filteredGroupSchemes.value.length)

// Get current page data - in a real app, this would likely come from an API
const data = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredGroupSchemes.value.slice(start, end)
})

// Filter group schemes based on search query
const filteredGroupSchemes = computed(() => {
  if (!searchQuery.value) return USE_DUMMY_DATA ? DUMMY_PRODUCTS : store.groupSchemes;
  
  const query = searchQuery.value.toLowerCase();
  const items = USE_DUMMY_DATA ? DUMMY_PRODUCTS : store.groupSchemes;
  
  return items.filter(p =>
    p.name?.toLowerCase().includes(query) || 
    p.code?.toLowerCase().includes(query) ||
    p.category?.toLowerCase().includes(query) ||
    p.underwriter?.toLowerCase().includes(query) ||
    p.premium?.toLowerCase().includes(query)
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

// Handle group scheme created event
const handleGroupSchemeCreated = () => {
  messageApi?.success('Group Scheme created successfully!')
  // In a real app, this might refresh the data
  // In our dummy data scenario, we would push to the array
  if (!USE_DUMMY_DATA) {
    store.fetchGroupSchemes()
  }
}

// Handle group scheme updated event
const handleGroupSchemeUpdated = () => {
  messageApi?.success('Group Scheme updated successfully!')
  // In a real app, the store would be updated
  if (!USE_DUMMY_DATA) {
    store.fetchGroupSchemes()
  }
}

// Handle group scheme deleted event
const handleGroupSchemeDeleted = () => {
  // The actual delete operation is now handled by ConfirmDeleteGroupScheme component
  selectedItemId.value = null
  selectedItem.value = null
  
  messageApi?.success('Group Scheme deleted successfully!')
  if (!USE_DUMMY_DATA) {
    store.fetchGroupSchemes()
  }
}
</script>
