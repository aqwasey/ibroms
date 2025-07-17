<template>
  <div class="p-6">
    <ConfirmDeleteTemplate v-model:show="showConfirm" :itemId="selectedItemId" :templateName="selectedItem?.title" @template-deleted="handleTemplateDeleted" />
    <ViewTemplate v-model:show="showViewModal" :template="selectedItem" />
    <NewTemplate v-model:show="showNewModal" @template-created="handleTemplateCreated" />
    <EditTemplate v-model:show="showEditModal" :template="selectedItem" @template-updated="handleTemplateUpdated" />
    <div>
      <PageHeader title="Templates" subtitle="Manage all templates" searchPlaceholder="Search templates..." buttonText="Add Template" @search="handleSearch" @button-click="showAddModal" />
      <div v-if="store.loading" class="text-gray-500 text-center py-4">Loading templates...</div>
      <div v-else>
        <div v-if="!filteredTemplates.length" class="text-gray-500 text-center py-4">No templates found</div>
        <TableComponent v-else :columns="columns" :data="data" :items-per-page="itemsPerPage" :total-items="totalItems" :current-page="currentPage" @page-changed="onPageChanged" @action="onAction" @edit-item="onEditItem" @delete-item="onDeleteItem" :selectable="true" @selection-change="handleSelectionChange" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { useTemplateStore } from '@/stores/templates'
import NewTemplate from '@/views/templates/NewTemplate.vue'
import EditTemplate from '@/views/templates/EditTemplate.vue'
import ViewTemplate from '@/views/templates/ViewTemplate.vue'
import ConfirmDeleteTemplate from '@/views/templates/ConfirmDeleteTemplate.vue'
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
const store = useTemplateStore()

onMounted(() => {
  store.fetchTemplates()
})

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'category', label: 'Category' },
  { key: 'template_type', label: 'Template Type' }
]
const itemsPerPage = ref(10)
const currentPage = ref(1)
const totalItems = computed(() => filteredTemplates.value.length)
const data = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredTemplates.value.slice(start, end)
})
const filteredTemplates = computed(() => {
  if (!searchQuery.value) return store.items
  const query = searchQuery.value.toLowerCase()
  return store.items.filter(t =>
    t.title?.toLowerCase().includes(query) ||
    t.category?.toLowerCase().includes(query) ||
    t.template_type?.toLowerCase().includes(query)
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
const handleTemplateCreated = () => { store.fetchTemplates(); showNewModal.value = false }
const handleTemplateUpdated = () => { store.fetchTemplates(); showEditModal.value = false }
const handleTemplateDeleted = () => { store.fetchTemplates(); showConfirm.value = false }
const handleSearch = (query) => { searchQuery.value = query }
const handleSelectionChange = () => {}
</script>