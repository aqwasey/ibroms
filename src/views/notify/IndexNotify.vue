<template>
  <div class="p-6">
    <ConfirmDeleteNotify v-model:show="showConfirm" :itemId="selectedItemId" :notifyName="selectedItem?.title" @notify-deleted="handleNotifyDeleted" />
    <ViewNotify v-model:show="showViewModal" :notify="selectedItem" :loading="viewLoading" />
    <NewNotify v-model:show="showNewModal" @notify-created="handleNotifyCreated" />
    <EditNotify v-model:show="showEditModal" :notify="selectedItem" :loading="editLoading" @notify-updated="handleNotifyUpdated" />
    <div>
      <PageHeader title="Notifications" subtitle="Manage all notifications" searchPlaceholder="Search notifications..." buttonText="Add Notification" @search="handleSearch" @button-click="showAddModal" />
      <div v-if="store.loading" class="text-gray-500 text-center py-4">Loading notifications...</div>
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
              title="No Notifications Found"
              description="You haven't added any notifications yet. Create your first notification to get started."
            />
          </template>
        </TableComponent>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { useNotifyStore } from '@/stores/notify'
import NewNotify from '@/views/notify/NewNotify.vue'
import EditNotify from '@/views/notify/EditNotify.vue'
import ViewNotify from '@/views/notify/ViewNotify.vue'
import ConfirmDeleteNotify from '@/views/notify/ConfirmDeleteNotify.vue'
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
const store = useNotifyStore()

onMounted(async () => {
  try {
    await store.fetchAllNotifications()
    // Also fetch message templates for the forms
    await store.fetchMessageTemplates()
  } catch (error) {
    console.error('Error loading notifications data:', error)
  }
})

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'description', label: 'Description' },
  { key: 'schedule', label: 'Schedule' }
]
const itemsPerPage = ref(10)
const currentPage = ref(1)
const totalItems = computed(() => filteredNotifications.value.length)
const data = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredNotifications.value.slice(start, end)
})
const filteredNotifications = computed(() => {
  if (!searchQuery.value) return store.notifications
  const query = searchQuery.value.toLowerCase()
  return store.notifications.filter(n =>
    n.title?.toLowerCase().includes(query) ||
    n.description?.toLowerCase().includes(query) ||
    n.schedule?.toLowerCase().includes(query)
  )
})
const onPageChanged = (page) => { currentPage.value = page }
const onAction = async ({ action, item }) => {
  if (action === 'view') {
    try {
      // Show immediate loading feedback
      viewLoading.value = true
      
      // Open modal immediately with basic data and loading state
      selectedItem.value = { ...item }
      showViewModal.value = true
      
      // Fetch complete notification details
      const fullNotificationData = await store.fetchNotificationForView(item.id)
      selectedItem.value = fullNotificationData
      console.log('Updated view modal with complete notification data:', selectedItem.value)
    } catch (error) {
      messageApi.error('Failed to load notification details')
      console.error('Error fetching notification details:', error)
    } finally {
      viewLoading.value = false
    }
  } else if (action === 'edit') { 
    onEditItem(item) 
  } else if (action === 'delete') { 
    onDeleteItem(item) 
  }
}

const onEditItem = async (item) => {
  try {
    // Show immediate loading feedback
    editLoading.value = true
    
    // Open modal immediately with basic data and loading state
    selectedItem.value = { ...item }
    showEditModal.value = true
    
    // Fetch complete notification details for editing
    const fullNotificationData = await store.fetchNotificationForView(item.id)
    selectedItem.value = fullNotificationData
    console.log('Updated edit modal with complete notification data:', selectedItem.value)
  } catch (error) {
    messageApi.error('Failed to load notification details for editing')
    console.error('Error fetching notification details for edit:', error)
  } finally {
    editLoading.value = false
  }
}
const onDeleteItem = (item) => { selectedItemId.value = item.id; selectedItem.value = { ...item }; showConfirm.value = true }
const showAddModal = () => { showNewModal.value = true }
const handleNotifyCreated = () => { store.fetchAllNotifications(); showNewModal.value = false }
const handleNotifyUpdated = () => { store.fetchAllNotifications(); showEditModal.value = false }
const handleNotifyDeleted = () => { store.fetchAllNotifications(); showConfirm.value = false }
const handleSearch = (query) => { searchQuery.value = query }
const handleSelectionChange = () => {}
</script>
