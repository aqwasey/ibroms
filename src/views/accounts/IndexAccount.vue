<template>
  <div class="p-6">
    <ConfirmDelete
      :item-id="selectedItemId"
      :loading="bankAccountsStore.adding"
      :title="'Account'"
      :text="'Are you sure you want to delete? It will be deleted permanently'"
      @delete-item="handleDelete"
      v-model:show="showConfirm" />

    <!-- View Account Modal -->
    <ViewAccount
      :account="selectedItem"
      v-model:show="showViewModal"
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
        <div v-if="!bankAccountsStore?.bankAccounts?.length" class="text-gray-500 text-center py-4">
          No accounts found
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
import { computed, inject, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import TableComponent from '@/components/TableComponent.vue'
import { useBankAccountsStore } from '@/stores/bank-accounts.js'
import ConfirmDelete from '@/components/ConfirmDelete.vue'
import PageHeader from '@/components/PageHeader.vue'
import ViewAccount from '@/views/accounts/ViewAccount.vue'

const router = useRouter()
const showConfirm = ref(false)
const showViewModal = ref(false)
const selectedItemId = ref(null)
const selectedItem = ref(null)
const messageApi = inject('messageApi')

const bankAccountsStore = useBankAccountsStore()

// DUMMY DATA FOR TESTING - REMOVE IN PRODUCTION
const USE_DUMMY_DATA = true; // Set this to false to use real data from API

const DUMMY_BANK_ACCOUNTS = [
  {
    id: '1',
    bank_name: 'National Bank',
    account_no: '123456789',
    account_type: 'Savings',
    email: 'accounts@national.com',
    purpose: 'General Operations'
  },
  {
    id: '2',
    bank_name: 'Commerce Bank',
    account_no: '987654321',
    account_type: 'Checking',
    email: 'finance@commerce-bank.com',
    purpose: 'Payroll'
  },
  {
    id: '3',
    bank_name: 'First Trust',
    account_no: '567891234',
    account_type: 'Business',
    email: 'business@firsttrust.com',
    purpose: 'Investments'
  },
  {
    id: '4',
    bank_name: 'Global Finance',
    account_no: '456123789',
    account_type: 'Savings',
    email: 'global@financebank.com',
    purpose: 'Emergency Fund'
  },
  {
    id: '5',
    bank_name: 'City Credit Union',
    account_no: '789123456',
    account_type: 'Credit',
    email: 'credit@citycu.com',
    purpose: 'Expenses'
  },
  {
    id: '6',
    bank_name: 'Bank of Insurance',
    account_no: '654987321',
    account_type: 'Trust',
    email: 'trust@bankofinsurance.com',
    purpose: 'Claims Payment'
  }
];

// Mock the store's data if using dummy data
if (USE_DUMMY_DATA) {
  // Override the store's properties for demo purposes
  bankAccountsStore.bankAccounts = DUMMY_BANK_ACCOUNTS;
  bankAccountsStore.loading = false;
}

onMounted(() => {
  if (!USE_DUMMY_DATA) {
    bankAccountsStore.fetchBankAccounts()
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
  router.push('/accounts/new')
}

const onEditItem = (item) => {
  router.push(`/accounts/${item.id}/edit`)
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
    messageApi.error(error?.response?.data?.info ?? 'Something went wrong')
  }
}
</script>
