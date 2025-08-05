<template>
  <div class="p-6">
    <ConfirmDelete
      :item-id="selectedItemId"
      :loading="bankAccountsStore.saving"
      :title="'Account'"
      :text="'Are you sure you want to delete? It will be deleted permanently'"
      @delete-item="handleDelete"
      v-model:show="showConfirm" />

    <!-- View Account Modal -->
    <ViewAccount
      :account="selectedItem"
      v-model:show="showViewModal"
    />

    <!-- New Account Modal -->
    <NewAccount
      v-model:show="showNewModal"
      @account-created="handleAccountCreated"
    />

    <!-- Edit Account Modal -->
    <EditAccount
      :account="selectedItem"
      v-model:show="showEditModal"
      @account-updated="handleAccountUpdated"
    />

    <div>
      <PageHeader
        title="Bank Accounts"
        searchPlaceholder="Search bank account"
        buttonText="New Bank Account"
        @search="handleSearch"
        @buttonClick="navigateToNewAccount"
      />

      <div v-if="bankAccountsStore.loading" class="text-gray-500 text-center py-4">
        Loading accounts...
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
              title="No Bank Accounts Found"
              description="You haven't added any bank accounts yet. Create your first bank account to get started."
            />
          </template>
        </TableComponent>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, onMounted, ref } from 'vue'
import TableComponent from '@/components/TableComponent.vue'
import { useBankAccountsStore } from '@/stores/bank-accounts.js'
import ConfirmDelete from '@/components/ConfirmDelete.vue'
import PageHeader from '@/components/PageHeader.vue'
import ViewAccount from '@/views/accounts/ViewAccount.vue'
import NewAccount from '@/views/accounts/NewAccount.vue'
import EditAccount from '@/views/accounts/EditAccount.vue'
import NoDataFound from '@/components/NoDataFound.vue'

const showConfirm = ref(false)
const showViewModal = ref(false)
const showNewModal = ref(false)
const showEditModal = ref(false)
const selectedItemId = ref(null)
const selectedItem = ref(null)
const messageApi = inject('messageApi')

const bankAccountsStore = useBankAccountsStore()

// No longer using dummy data - real API integration

// Fetch bank accounts when component mounts
onMounted(async () => {
  try {
    await bankAccountsStore.fetchAllBankAccounts()
  } catch (error) {
    messageApi.error(error?.message || 'Failed to load bank accounts')
    console.error('Error fetching bank accounts:', error)
  }
})

const columns = [
  { key: 'bank_name', label: 'Bank Name' },
  { key: 'account_no', label: 'Account No' },
  { key: 'account_type', label: 'Account Type' },
  { key: 'email', label: 'Email' },
  { key: 'purpose', label: 'Purpose' }
]

// Pagination settings
const itemsPerPage = ref(10)
const currentPage = ref(1)

// Calculate total items for pagination
const totalItems = computed(() => bankAccountsStore.bankAccounts.length)

// Get current page data - in a real app, this would likely come from an API
const data = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return bankAccountsStore.bankAccounts.slice(start, end)
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

const navigateToNewAccount = () => {
  showNewModal.value = true
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
  console.log('Searching for:', query)
  // Implement search functionality here
}

const handleSelectionChange = (selectedIds) => {
  console.log('Selected items:', selectedIds)
  // Do something with the selected IDs
}

const handleDelete = async (itemId) => {
  try {
    await bankAccountsStore.deleteBankAccount(itemId)
    selectedItemId.value = null
    showConfirm.value = false
    messageApi.success('Account deleted successfully!')
  } catch (error) {
    messageApi.error(error?.message || 'Failed to delete account')
    console.error('Error deleting account:', error)
  }
}

// Handle account created event
const handleAccountCreated = async (account) => {
  // Force refresh the bank accounts list to ensure UI is updated
  // Note: Success message is already shown in NewAccount.vue, no need to duplicate
  try {
    await bankAccountsStore.fetchAllBankAccounts()
  } catch (error) {
    console.error('Error refreshing bank accounts after creation:', error)
  }
}

// Handle account updated event
const handleAccountUpdated = async (account) => {
  // Force refresh the bank accounts list to ensure UI is updated
  // Note: Success message is already shown in EditAccount.vue, no need to duplicate
  try {
    await bankAccountsStore.fetchAllBankAccounts()
  } catch (error) {
    console.error('Error refreshing bank accounts after update:', error)
  }
}
</script>


