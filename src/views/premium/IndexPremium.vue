<template>
  <div class="p-6">
    <ConfirmDeletePremium v-model:show="showConfirm" :itemId="selectedItemId" :premiumName="selectedItem?.policyNo" @premium-deleted="handlePremiumDeleted" />
    <ViewPremium v-model:show="showViewModal" :premium="selectedItem" />
    <NewPremium v-model:show="showNewModal" @premium-created="handlePremiumCreated" />
    <EditPremium v-model:show="showEditModal" :premium="selectedItem" @premium-updated="handlePremiumUpdated" />
    <div>
      <PageHeader title="Premiums" subtitle="Manage all premiums" searchPlaceholder="Search premiums..." buttonText="Add Premium" @search="handleSearch" @button-click="showAddModal" />
      <div v-if="store.loading" class="text-gray-500 text-center py-4">Loading premiums...</div>
      <div v-else>
        <div v-if="!filteredPremiums.length" class="text-gray-500 text-center py-4">No premiums found</div>
        <TableComponent v-else :columns="columns" :data="data" :items-per-page="itemsPerPage" :total-items="totalItems" :current-page="currentPage" @page-changed="onPageChanged" @action="onAction" @edit-item="onEditItem" @delete-item="onDeleteItem" :selectable="true" @selection-change="handleSelectionChange" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { usePremiumStore } from '@/stores/premium'
import NewPremium from '@/views/premium/NewPremium.vue'
import EditPremium from '@/views/premium/EditPremium.vue'
import ViewPremium from '@/views/premium/ViewPremium.vue'
import ConfirmDeletePremium from '@/views/premium/ConfirmDeletePremium.vue'
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
const store = usePremiumStore()

onMounted(() => {
  store.fetchPremiums()
})

const columns = [
  { key: 'policyNo', label: 'Policy NO' },
  { key: 'paymentOption', label: 'Payment Option' },
  { key: 'reason', label: 'Reason' },
  { key: 'amount', label: 'Amount' }
]
const itemsPerPage = ref(10)
const currentPage = ref(1)
const totalItems = computed(() => filteredPremiums.value.length)
const data = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredPremiums.value.slice(start, end)
})
const filteredPremiums = computed(() => {
  if (!searchQuery.value) return store.items
  const query = searchQuery.value.toLowerCase()
  return store.items.filter(p =>
    p.policyNo?.toLowerCase().includes(query) ||
    p.paymentOption?.toLowerCase().includes(query) ||
    p.reason?.toLowerCase().includes(query) ||
    p.amount?.toLowerCase().includes(query)
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
const handlePremiumCreated = () => { store.fetchPremiums(); showNewModal.value = false }
const handlePremiumUpdated = () => { store.fetchPremiums(); showEditModal.value = false }
const handlePremiumDeleted = () => { store.fetchPremiums(); showConfirm.value = false }
const handleSearch = (query) => { searchQuery.value = query }
const handleSelectionChange = () => {}
</script>