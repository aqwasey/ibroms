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
        searchPlaceholder="Search group schemes..."
        buttonText="Add Group Scheme"
        @search="handleSearch"
        @button-click="showAddModal"
      />

      <div v-if="groupSchemesStore.loading" class="text-gray-500 text-center py-4">
        Loading group schemes...
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
              title="No Group Schemes Found"
              description="You haven't added any group schemes yet. Create your first group scheme to get started."
            />
          </template>
        </TableComponent>
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
import NoDataFound from '@/components/NoDataFound.vue'

const showConfirm = ref(false)
const showViewModal = ref(false)
const showNewModal = ref(false)
const showEditModal = ref(false)
const selectedItemId = ref(null)
const selectedItem = ref(null)
const searchQuery = ref('')
const messageApi = inject('messageApi')

const groupSchemesStore = useGroupSchemesStore()

// Fetch group schemes when component mounts
onMounted(async () => {
  try {
    await groupSchemesStore.fetchAllGroupSchemes()
  } catch (error) {
    const errorMessage = error?.message || 'Failed to load group schemes'
    if (!errorMessage.includes('fetch') && !errorMessage.includes('Network Error')) {
      messageApi.error(errorMessage)
    }
    console.error('Error fetching group schemes:', error)
  }
})

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'code', label: 'Code' },
  { key: 'category', label: 'Category' },
  { key: 'province', label: 'Province' },
  { key: 'manager', label: 'Manager' }
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
  if (!searchQuery.value) return groupSchemesStore.groupSchemes;
  
  const query = searchQuery.value.toLowerCase();
  
  return groupSchemesStore.groupSchemes.filter(scheme =>
    scheme.name?.toLowerCase().includes(query) || 
    scheme.code?.toLowerCase().includes(query) ||
    scheme.category?.toLowerCase().includes(query) ||
    scheme.province?.toLowerCase().includes(query) ||
    scheme.manager?.toLowerCase().includes(query)
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
const handleGroupSchemeCreated = async () => {
  // Force refresh the group schemes list to ensure UI is updated
  // Note: Success message is already shown in NewGroupScheme.vue, no need to duplicate
  try {
    await groupSchemesStore.fetchAllGroupSchemes()
  } catch (error) {
    console.error('Error refreshing group schemes after creation:', error)
  }
}

// Handle group scheme updated event
const handleGroupSchemeUpdated = async () => {
  // Force refresh the group schemes list to ensure UI is updated
  // Note: Success message is already shown in EditGroupScheme.vue, no need to duplicate
  try {
    await groupSchemesStore.fetchAllGroupSchemes()
  } catch (error) {
    console.error('Error refreshing group schemes after update:', error)
  }
}

// Handle group scheme deleted event
const handleGroupSchemeDeleted = async () => {
  // The actual delete operation is now handled by ConfirmDeleteGroupScheme component
  selectedItemId.value = null
  selectedItem.value = null
  
  // Force refresh the group schemes list to ensure UI is updated
  try {
    await groupSchemesStore.fetchAllGroupSchemes()
  } catch (error) {
    console.error('Error refreshing group schemes after deletion:', error)
  }
}
</script>
