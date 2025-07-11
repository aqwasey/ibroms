<template>
  <div class="p-6">
    <ConfirmDeleteUserAccount
      :user="selectedItem"
      v-model:show="showConfirm"
      @user-deleted="handleUserDeleted" />

    <!-- View User Account Modal -->
    <ViewUserAccount
      :user="selectedItem"
      v-model:show="showViewModal"
    />
    
    <!-- New User Account Modal -->
    <NewUserAccount
      v-model:show="showNewModal"
      @user-created="handleUserCreated"
    />
    
    <!-- Edit User Account Modal -->
    <EditUserAccount
      :user="selectedItem"
      v-model:show="showEditModal"
      @user-updated="handleUserUpdated"
    />

    <div>
      <PageHeader
        title="User Accounts"
        searchPlaceholder="Search user accounts"
        buttonText="New User Account"
        @search="handleSearch"
        @buttonClick="showAddModal"
      />

      <div v-if="userAccountStore.loading" class="text-gray-500 text-center py-4">
        Loading user accounts...
      </div>
      <div v-else>
        <div v-if="!userAccountStore?.users?.length" class="text-gray-500 text-center py-4">
          No user accounts found
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
import TableComponent from '@/components/TableComponent.vue'
import { useUserAccountStore } from '@/stores/userAccounts.js'
import PageHeader from '@/components/PageHeader.vue'
import ViewUserAccount from '@/views/user-accounts/ViewUserAccount.vue'
import NewUserAccount from '@/views/user-accounts/NewUserAccount.vue'
import EditUserAccount from '@/views/user-accounts/EditUserAccount.vue'
import ConfirmDeleteUserAccount from '@/views/user-accounts/ConfirmDeleteUserAccount.vue'

const showConfirm = ref(false)
const showViewModal = ref(false)
const showNewModal = ref(false)
const showEditModal = ref(false)
const selectedItemId = ref(null)
const selectedItem = ref(null)
const messageApi = inject('messageApi')

const userAccountStore = useUserAccountStore()

// DUMMY DATA FOR TESTING - REMOVE IN PRODUCTION
const USE_DUMMY_DATA = true; // Set this to false to use real data from API

const DUMMY_USER_ACCOUNTS = [
  {
    id: '1',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    serviceProvider: 'Google',
    accessLevel: '01',
    permissions: 'Yes'
  },
  {
    id: '2',
    fullName: 'Jane Smith',
    email: 'jane.smith@example.com',
    serviceProvider: 'Microsoft',
    accessLevel: '02',
    permissions: 'Yes'
  },
  {
    id: '3',
    fullName: 'Michael Johnson',
    email: 'michael.j@example.com',
    serviceProvider: 'Apple',
    accessLevel: '01',
    permissions: 'No'
  },
  {
    id: '4',
    fullName: 'Sarah Williams',
    email: 'sarah.w@example.com',
    serviceProvider: 'Google',
    accessLevel: '03',
    permissions: 'Yes'
  },
  {
    id: '5',
    fullName: 'Robert Brown',
    email: 'robert.b@example.com',
    serviceProvider: 'Microsoft',
    accessLevel: '02',
    permissions: 'No'
  },
  {
    id: '6',
    fullName: 'Emily Davis',
    email: 'emily.d@example.com',
    serviceProvider: 'Apple',
    accessLevel: '01',
    permissions: 'Yes'
  }
];

// Mock the store's data if using dummy data
if (USE_DUMMY_DATA) {
  // Override the store's properties for demo purposes
  userAccountStore.users = DUMMY_USER_ACCOUNTS;
  userAccountStore.loading = false;
}

onMounted(() => {
  if (!USE_DUMMY_DATA) {
    userAccountStore.fetchUsers()
  }
})

const columns = [
  { key: 'fullName', label: 'Full Name' },
  { key: 'email', label: 'Email' },
  { key: 'serviceProvider', label: 'Service Provider' },
  { key: 'accessLevel', label: 'Access Level' },
  { key: 'permissions', label: 'Permissions' }
]

// Pagination settings
const itemsPerPage = ref(10)
const currentPage = ref(1)

// Calculate total items for pagination
const totalItems = computed(() => userAccountStore.users.length)

// Get current page data - in a real app, this would likely come from an API
const data = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return userAccountStore.users.slice(start, end)
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

const handleUserDeleted = (userId) => {
  // The actual delete operation is now handled by ConfirmDeleteUserAccount component
  selectedItemId.value = null
  selectedItem.value = null
}

// Handle user account created event
const handleUserCreated = (user) => {
  messageApi.success('User account created successfully!')
  // No need to refresh data as the store should be updated already
}

// Handle user account updated event
const handleUserUpdated = (user) => {
  messageApi.success('User account updated successfully!')
  // No need to refresh data as the store should be updated already
}
</script>
