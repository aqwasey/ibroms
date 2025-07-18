<template>
  <div class="p-6">
    <ConfirmDeleteNotify v-model:show="showConfirm" :itemId="selectedItemId" :notifyName="selectedItem?.title" @notify-deleted="handleNotifyDeleted" />
    <ViewNotify v-model:show="showViewModal" :notify="selectedItem" />
    <NewNotify v-model:show="showNewModal" @notify-created="handleNotifyCreated" />
    <EditNotify v-model:show="showEditModal" :notify="selectedItem" @notify-updated="handleNotifyUpdated" />
    <div>
      <PageHeader title="Notifications" subtitle="Manage all notifications" searchPlaceholder="Search notifications..." buttonText="Add Notification" @search="handleSearch" @button-click="showAddModal" />
      <div v-if="store.loading" class="text-gray-500 text-center py-4">Loading notifications...</div>
      <div v-else>
        <div v-if="!filteredNotifications.length" class="text-gray-500 text-center py-4">No notifications found</div>
        <TableComponent v-else :columns="columns" :data="data" :items-per-page="itemsPerPage" :total-items="totalItems" :current-page="currentPage" @page-changed="onPageChanged" @action="onAction" @edit-item="onEditItem" @delete-item="onDeleteItem" :selectable="true" @selection-change="handleSelectionChange" />
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

const showConfirm = ref(false)
const showViewModal = ref(false)
const showNewModal = ref(false)
const showEditModal = ref(false)
const selectedItemId = ref(null)
const selectedItem = ref(null)
const searchQuery = ref('')
const messageApi = inject('messageApi')
const store = useNotifyStore()

onMounted(() => {
  store.fetchNotifications()
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
  if (!searchQuery.value) return store.items
  const query = searchQuery.value.toLowerCase()
  return store.items.filter(n =>
    n.title?.toLowerCase().includes(query) ||
    n.description?.toLowerCase().includes(query) ||
    n.schedule?.toLowerCase().includes(query)
  )
})
const onPageChanged = (page) => { currentPage.value = page }
const onAction = ({ action, item }) => {
  if (action === 'view') { selectedItem.value = { ...item }; showViewModal.value = true }
  else if (action === 'edit') { onEditItem(item) }
  else if (action === 'delete') { onDeleteItem(item) }
}
const onEditItem = (item) => { selectedItem.value = { ...item }; showEditModal.value = true }
const onDeleteItem = (item) => { selectedItemId.value = item.id; selectedItem.value = { ...item }; showConfirm.value = true }
const showAddModal = () => { showNewModal.value = true }
const handleNotifyCreated = () => { store.fetchNotifications(); showNewModal.value = false }
const handleNotifyUpdated = () => { store.fetchNotifications(); showEditModal.value = false }
const handleNotifyDeleted = () => { store.fetchNotifications(); showConfirm.value = false }
const handleSearch = (query) => { searchQuery.value = query }
const handleSelectionChange = () => {}
</script>
