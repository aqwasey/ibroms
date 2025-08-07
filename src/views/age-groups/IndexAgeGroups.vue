<template>
  <div class="p-6">
    <ConfirmDeleteAgeGroup v-model:show="showConfirm" :itemId="selectedItemId" :ageGroupName="selectedItem?.title" @age-group-deleted="handleAgeGroupDeleted" />
    <ViewAgeGroup v-model:show="showViewModal" :ageGroup="selectedItem" />
    <NewAgeGroup v-model:show="showNewModal" @age-group-created="handleAgeGroupCreated" />
    <EditAgeGroup v-model:show="showEditModal" :ageGroup="selectedItem" @age-group-updated="handleAgeGroupUpdated" />
    <div>
      <PageHeader title="Age Groups" subtitle="Manage age group configurations" searchPlaceholder="Search age groups..." buttonText="Add Age Group" @search="handleSearch" @button-click="showAddModal" />
      <div v-if="store.loading" class="text-gray-500 text-center py-4">Loading age groups...</div>
      <div v-else>
        <TableComponent :columns="columns" :data="data" :items-per-page="itemsPerPage" :total-items="totalItems" :current-page="currentPage" @page-changed="onPageChanged" @action="onAction" @edit-item="onEditItem" @delete-item="onDeleteItem" :selectable="true" @selection-change="handleSelectionChange">
          <template #empty-state>
            <NoDataFound
              title="No Age Groups Found"
              description="Get started by creating your first age group configuration"
            />
          </template>
        </TableComponent>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAgeGroupsStore } from '@/stores/ageGroups'
import NewAgeGroup from '@/views/age-groups/NewAgeGroup.vue'
import EditAgeGroup from '@/views/age-groups/EditAgeGroup.vue'
import ViewAgeGroup from '@/views/age-groups/ViewAgeGroup.vue'
import ConfirmDeleteAgeGroup from '@/views/age-groups/ConfirmDeleteAgeGroup.vue'
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
const store = useAgeGroupsStore()

onMounted(() => {
  store.fetchAllAgeGroups()
})

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'age_begin', label: 'Age Begin' },
  { key: 'age_end', label: 'Age End' },
  { key: 'price', label: 'Price' },
  { key: 'payout', label: 'Payout' }
]

const itemsPerPage = ref(10)
const currentPage = ref(1)
const totalItems = computed(() => filteredAgeGroups.value.length)

const data = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredAgeGroups.value.slice(start, end)
})

const filteredAgeGroups = computed(() => {
  if (!searchQuery.value) return store.ageGroups
  const query = searchQuery.value.toLowerCase()
  return store.ageGroups.filter(ag =>
    ag.title?.toLowerCase().includes(query) ||
    ag.correlate?.toLowerCase().includes(query) ||
    ag.age_begin?.toString().includes(query) ||
    ag.age_end?.toString().includes(query)
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

const handleAgeGroupCreated = () => { store.fetchAllAgeGroups(); showNewModal.value = false }
const handleAgeGroupUpdated = () => { store.fetchAllAgeGroups(); showEditModal.value = false }
const handleAgeGroupDeleted = () => { store.fetchAllAgeGroups(); showConfirm.value = false }

const handleSearch = (query) => { searchQuery.value = query }
const handleSelectionChange = () => {}
</script>
