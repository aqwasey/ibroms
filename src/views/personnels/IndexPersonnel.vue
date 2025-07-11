<template>
  <div class="p-6">
    <ConfirmDeletePersonnel
      :person="selectedItem"
      v-model:show="showConfirm"
      @person-deleted="handlePersonDeleted" />

    <!-- View Personnel Modal -->
    <ViewPersonnel
      :person="selectedItem"
      v-model:show="showViewModal"
    />
    
    <!-- New Personnel Modal -->
    <NewPersonnel
      v-model:show="showNewModal"
      @person-created="handlePersonCreated"
    />
    
    <!-- Edit Personnel Modal -->
    <EditPersonnel
      :person="selectedItem"
      v-model:show="showEditModal"
      @person-updated="handlePersonUpdated"
    />

    <div>
      <PageHeader
        title="Personnel"
        searchPlaceholder="Search personnel"
        buttonText="New Personnel"
        @search="handleSearch"
        @buttonClick="showAddModal"
      />

      <div v-if="personnelStore.loading" class="text-gray-500 text-center py-4">
        Loading personnel...
      </div>
      <div v-else>
        <div v-if="!personnelStore?.person?.length" class="text-gray-500 text-center py-4">
          No personnel found
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
import { usePersonnelStore } from '@/stores/personnels.js'
import PageHeader from '@/components/PageHeader.vue'
import ViewPersonnel from '@/views/personnels/ViewPersonnel.vue'
import NewPersonnel from '@/views/personnels/NewPersonnel.vue'
import EditPersonnel from '@/views/personnels/EditPersonnel.vue'
import ConfirmDeletePersonnel from '@/views/personnels/ConfirmDeletePersonnel.vue'

const showConfirm = ref(false)
const showViewModal = ref(false)
const showNewModal = ref(false)
const showEditModal = ref(false)
const selectedItemId = ref(null)
const selectedItem = ref(null)
const messageApi = inject('messageApi')

const personnelStore = usePersonnelStore()

// DUMMY DATA FOR TESTING - REMOVE IN PRODUCTION
const USE_DUMMY_DATA = true; // Set this to false to use real data from API

const DUMMY_PERSONNEL = [
  {
    id: '1',
    surname: 'Doe',
    otherNames: 'John',
    gender: 'Male',
    dateOfBirth: '1985-05-15',
    idType: 'National ID',
    idNumber: 'NID12345678'
  },
  {
    id: '2',
    surname: 'Smith',
    otherNames: 'Jane',
    gender: 'Female',
    dateOfBirth: '1990-08-21',
    idType: 'Driver License',
    idNumber: 'DL5678901'
  },
  {
    id: '3',
    surname: 'Johnson',
    otherNames: 'Michael',
    gender: 'Male',
    dateOfBirth: '1982-11-30',
    idType: 'Passport',
    idNumber: 'P98765432'
  },
  {
    id: '4',
    surname: 'Williams',
    otherNames: 'Sarah',
    gender: 'Female',
    dateOfBirth: '1988-03-12',
    idType: 'National ID',
    idNumber: 'NID87654321'
  },
  {
    id: '5',
    surname: 'Brown',
    otherNames: 'Robert',
    gender: 'Male',
    dateOfBirth: '1975-09-08',
    idType: 'Driver License',
    idNumber: 'DL1234567'
  },
  {
    id: '6',
    surname: 'Davis',
    otherNames: 'Emily',
    gender: 'Female',
    dateOfBirth: '1992-07-24',
    idType: 'Passport',
    idNumber: 'P45678901'
  }
];

// Mock the store's data if using dummy data
if (USE_DUMMY_DATA) {
  // Override the store's properties for demo purposes
  personnelStore.person = DUMMY_PERSONNEL;
  personnelStore.loading = false;
}

onMounted(() => {
  if (!USE_DUMMY_DATA) {
    personnelStore.fetchPersonnel()
  }
})

const columns = [
  { key: 'otherNames', label: 'Other Name(s)' },
  { key: 'surname', label: 'Surname' },
  { key: 'gender', label: 'Gender' },
  { key: 'dateOfBirth', label: 'Date of Birth' },
  { key: 'idType', label: 'ID Type' },
  { key: 'idNumber', label: 'ID Number' }
]

// Pagination settings
const itemsPerPage = ref(10)
const currentPage = ref(1)

// Calculate total items for pagination
const totalItems = computed(() => personnelStore.person.length)

// Get current page data - in a real app, this would likely come from an API
const data = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return personnelStore.person.slice(start, end)
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

const handlePersonDeleted = (personId) => {
  // The actual delete operation is now handled by ConfirmDeletePersonnel component
  selectedItemId.value = null
  selectedItem.value = null
}

// Handle personnel created event
const handlePersonCreated = (person) => {
  messageApi.success('Personnel created successfully!')
  // No need to refresh data as the store should be updated already
}

// Handle personnel updated event
const handlePersonUpdated = (person) => {
  messageApi.success('Personnel updated successfully!')
  // No need to refresh data as the store should be updated already
}
</script>
