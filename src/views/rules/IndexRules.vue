<template>
  <div class="p-6">
    <ConfirmDeleteRule v-model:show="showConfirm" :itemId="selectedItemId" :ruleName="selectedItem?.title" @rule-deleted="handleRuleDeleted" />
    <ViewRule v-model:show="showViewModal" :rule="selectedItem" />
    <NewRule v-model:show="showNewModal" @rule-created="handleRuleCreated" />
    <EditRule v-model:show="showEditModal" :rule="selectedItem" @rule-updated="handleRuleUpdated" />
    <div>
      <PageHeader title="Rules" subtitle="Manage all rules" searchPlaceholder="Search rules..." buttonText="Add Rule" @search="handleSearch" @button-click="showAddModal" />
      <div v-if="store.loading" class="text-gray-500 text-center py-4">Loading rules...</div>
      <div v-else>
        <TableComponent :columns="columns" :data="data" :items-per-page="itemsPerPage" :total-items="totalItems" :current-page="currentPage" @page-changed="onPageChanged" @action="onAction" @edit-item="onEditItem" @delete-item="onDeleteItem" :selectable="true" @selection-change="handleSelectionChange">
          <template #empty-state>
            <NoDataFound
              title="No Rules Found"
              description="You haven't added any business rules yet. Create your first rule to get started."
            />
          </template>
        </TableComponent>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRulesStore } from '@/stores/rules'
import NewRule from '@/views/rules/NewRule.vue'
import EditRule from '@/views/rules/EditRule.vue'
import ViewRule from '@/views/rules/ViewRule.vue'
import ConfirmDeleteRule from '@/views/rules/ConfirmDeleteRule.vue'
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
const store = useRulesStore()

onMounted(() => {
  store.fetchRules()
})

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'description', label: 'Description' },
  { key: 'limit_type', label: 'Limit Type' },
  { key: 'service_list', label: 'Services', format: (value) => value && value.length ? value.join(', ') : 'None' }
]
const itemsPerPage = ref(10)
const currentPage = ref(1)
const totalItems = computed(() => filteredRules.value.length)
const data = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredRules.value.slice(start, end)
})
const filteredRules = computed(() => {
  if (!searchQuery.value) return store.items
  const query = searchQuery.value.toLowerCase()
  return store.items.filter(rule =>
    rule.title?.toLowerCase().includes(query) ||
    rule.description?.toLowerCase().includes(query) ||
    rule.limit_type?.toLowerCase().includes(query) ||
    (rule.service_list && rule.service_list.some(service => service.toLowerCase().includes(query)))
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
const handleRuleCreated = () => { store.fetchRules(); showNewModal.value = false }
const handleRuleUpdated = () => { store.fetchRules(); showEditModal.value = false }
const handleRuleDeleted = () => { store.fetchRules(); showConfirm.value = false }
const handleSearch = (query) => { searchQuery.value = query }
const handleSelectionChange = () => {}
</script>
