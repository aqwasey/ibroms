<template>
  <div class="p-6">
    <!-- Delete Confirmation Modal -->
    <ConfirmDeletePerson 
      v-model:show="showConfirm" 
      :itemId="selectedItemId" 
      :personName="selectedItem?.othername" 
      @person-deleted="handlePersonDeleted" 
    />

    <!-- View Modal -->
    <ViewPerson 
      v-model:show="showViewModal" 
      :person="selectedItem" 
    />
    
    <!-- New Modal -->
    <NewPerson 
      v-model:show="showNewModal" 
      @person-created="handlePersonCreated"
    />
    
    <!-- Edit Modal -->
    <EditPerson 
      v-model:show="showEditModal" 
      :person="selectedItem"
      @person-updated="handlePersonUpdated"
    />

    <div>
      <PageHeader 
        title="People" 
        subtitle="Manage all people"
        searchPlaceholder="Search people..."
        buttonText="Add Person"
        @search="handleSearch"
        @button-click="showAddModal"
      />

      <div v-if="store.loading" class="text-gray-500 text-center py-4">
        Loading people...
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
        >
          <template #empty>
            <NoDataFound
              title="No People Found"
              description="You haven't added any people yet. Create your first person to get started."
            />
          </template>
        </TableComponent>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePeopleStore } from '@/stores/people'
import PageHeader from '@/components/PageHeader.vue'
import TableComponent from '@/components/TableComponent.vue'
import NoDataFound from '@/components/NoDataFound.vue'
import ConfirmDeletePerson from './ConfirmDeletePerson.vue'
import ViewPerson from './ViewPerson.vue'
import NewPerson from './NewPerson.vue'
import EditPerson from './EditPerson.vue'

const store = usePeopleStore()

// Table configuration
const columns = [
  { label: 'Other Name(s)', key: 'othername' },
  { label: 'Surname', key: 'surname' },
  { label: 'Gender', key: 'gender' },
  { label: 'Date of Birth', key: 'birthdate' },
  { label: 'ID Type', key: 'id_type' },
  { label: 'ID Number', key: 'idno' }
]

// Pagination settings
const itemsPerPage = ref(10)
const currentPage = ref(1)
const searchQuery = ref('')

// Modal states
const showConfirm = ref(false)
const showViewModal = ref(false)
const showNewModal = ref(false)
const showEditModal = ref(false)
const selectedItemId = ref('')
const selectedItem = ref(null)

// Get data from store
const fetchData = async () => {
  await store.fetchAllPeople()
}

// Filter data based on search query
const filteredData = computed(() => {
  if (!searchQuery.value) return store.people

  const query = searchQuery.value.toLowerCase()
  return store.people.filter(item => {
    return (
      (item.othername?.toLowerCase().includes(query)) ||
      (item.surname?.toLowerCase().includes(query)) ||
      (item.gender?.toLowerCase().includes(query)) ||
      (item.idno?.toLowerCase().includes(query))
    )
  })
})

// Calculate total items for pagination
const totalItems = computed(() => filteredData.value.length)

// Get current page data
const data = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredData.value.slice(start, end)
})

// Event handlers
const onPageChanged = (page) => {
  currentPage.value = page
}

const showAddModal = () => {
  showNewModal.value = true
}

const onAction = ({ action, item }) => {
  if (action === 'view') {
    onViewItem(item)
  } else if (action === 'edit') {
    onEditItem(item)
  } else if (action === 'delete') {
    onDeleteItem(item)
  }
}

const onViewItem = (item) => {
  selectedItem.value = { ...item }
  showViewModal.value = true
}

const onEditItem = (item) => {
  selectedItem.value = { ...item }
  showEditModal.value = true
}

const onDeleteItem = (item) => {
  selectedItemId.value = item.id
  selectedItem.value = item
  showConfirm.value = true
}

const handleSearch = (query) => {
  searchQuery.value = query
}

// Fetch data on component mount
onMounted(() => {
  fetchData()
})

// Handle person created event
const handlePersonCreated = () => {
  fetchData()
}

// Handle person updated event
const handlePersonUpdated = () => {
  fetchData()
}

// Handle person deleted event
const handlePersonDeleted = () => {
  selectedItemId.value = null
  selectedItem.value = null
  fetchData()
}
</script>
