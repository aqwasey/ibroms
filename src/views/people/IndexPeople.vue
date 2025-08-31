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
      :loading="viewModalLoading"
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
        subtitle="Search and manage people"
        searchPlaceholder="Search by name, ID number, or contact..."
        buttonText="Add Person"
        @search="handleSearch"
        @button-click="showAddModal"
      />

      <!-- Search Type Selector -->
      <div class="mb-6 flex gap-4 items-center">
        <div class="flex gap-2">
          <button
            v-for="type in searchTypes"
            :key="type.value"
            @click="searchType = type.value"
            :class="[
              'px-3 py-2 text-sm font-medium rounded-md transition-colors',
              searchType === type.value
                ? 'text-white border'
                : 'bg-white border hover:bg-gray-50'
            ]"
            :style="{
              backgroundColor: searchType === type.value ? COLORS.PRIMARY : COLORS.WHITE,
              borderColor: searchType === type.value ? COLORS.PRIMARY : COLORS.BORDER_DARK,
              color: searchType === type.value ? COLORS.WHITE : COLORS.TEXT_BODY
            }"
          >
            {{ type.label }}
          </button>
        </div>

        <div class="flex gap-2">
          <button
            v-for="period in periodOptions"
            :key="period.value"
            @click="loadByPeriod(period.value)"
            class="px-3 py-2 text-sm font-medium rounded-md border transition-colors"
            :style="{
              backgroundColor: COLORS.SUCCESS,
              borderColor: COLORS.SUCCESS,
              color: COLORS.WHITE
            }"
            @mouseover="$event.target.style.backgroundColor = '#1E8449'"
            @mouseleave="$event.target.style.backgroundColor = COLORS.SUCCESS"
          >
            {{ period.label }}
          </button>
        </div>
      </div>

      <!-- Contact Type Selector (only show when contact search is selected) -->
      <div v-if="searchType === 'contact'" class="mb-4">
        <label class="block text-sm font-medium mb-2" :style="{ color: COLORS.TEXT_BODY }">Contact Type:</label>
        <div class="flex gap-2 flex-wrap">
          <button
            v-for="type in contactTypes"
            :key="type.value"
            @click="contactType = type.value"
            :class="[
              'px-3 py-1.5 text-sm font-medium rounded-md transition-colors border',
              contactType === type.value
                ? 'text-white'
                : 'bg-white hover:bg-gray-50'
            ]"
            :style="{
              backgroundColor: contactType === type.value ? COLORS.INFO : COLORS.WHITE,
              borderColor: contactType === type.value ? COLORS.INFO : COLORS.BORDER_DARK,
              color: contactType === type.value ? COLORS.WHITE : COLORS.TEXT_BODY
            }"
          >
            {{ type.label }}
          </button>
        </div>
        <p class="text-xs mt-1" :style="{ color: COLORS.TEXT_MUTED }">
          Enter the {{ contactTypes.find(t => t.value === contactType)?.label.toLowerCase() }} value to search for
        </p>
      </div>

      <div v-if="loading" class="text-gray-500 text-center py-4">
        {{ loadingMessage }}
      </div>
      <div v-else-if="!hasSearched && searchResults.length === 0" class="text-center py-8 mb-6">
        <div class="text-gray-500 mb-4">
          <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <p class="text-lg font-medium">Search for People</p>
          <p class="text-sm">Use the search bar above to find people by name, ID, or contact info</p>
          <p class="text-sm mt-2">Or click a period button to load recent people</p>
        </div>
      </div>
      <div v-else class="mt-6">
        <TableComponent
          :columns="columns"
          :data="paginatedData"
          :items-per-page="itemsPerPage"
          :total-items="searchResults.length"
          :current-page="currentPage"
          @page-changed="onPageChanged"
          @action="onAction"
        >
          <template #empty>
            <NoDataFound
              title="No People Found"
              :description="searchQuery ? `No results found for '${searchQuery}'` : 'No people found for the selected criteria'"
            />
          </template>
        </TableComponent>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { peopleApiService } from '@/services/peopleApi'
import { COLORS } from '@/constants/colors'
import PageHeader from '@/components/PageHeader.vue'
import TableComponent from '@/components/TableComponent.vue'
import NoDataFound from '@/components/NoDataFound.vue'
import ConfirmDeletePerson from './ConfirmDeletePerson.vue'
import ViewPerson from './ViewPerson.vue'
import NewPerson from './NewPerson.vue'
import EditPerson from './EditPerson.vue'

const messageApi = inject('messageApi')

// Table configuration
const columns = [
  { label: 'Other Name(s)', key: 'othername' },
  { label: 'Surname', key: 'surname' },
  { label: 'Gender', key: 'gender' },
  { label: 'Date of Birth', key: 'birthdate' },
  { label: 'ID Type', key: 'id_type' },
  { label: 'ID Number', key: 'idno' }
]

// Search and pagination state
const itemsPerPage = ref(10)
const currentPage = ref(1)
const searchQuery = ref('')
const searchType = ref('name')
const contactType = ref('email')
const searchResults = ref([])
const loading = ref(false)
const loadingMessage = ref('Searching...')
const hasSearched = ref(false)

// Modal states
const showConfirm = ref(false)
const showViewModal = ref(false)
const showNewModal = ref(false)
const showEditModal = ref(false)
const selectedItemId = ref('')
const selectedItem = ref(null)
const viewModalLoading = ref(false)

// Search configuration
const searchTypes = [
  { value: 'name', label: 'Name' },
  { value: 'idno', label: 'ID Number' },
  { value: 'contact', label: 'Contact' }
]

const periodOptions = [
  { value: 'last-week', label: 'Last Week' },
  { value: 'last-month', label: 'Last Month' },
  { value: 'all', label: 'All Time' }
]

const contactTypes = [
  { value: 'email', label: 'Email' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'phone', label: 'Phone' },
  { value: 'landline', label: 'Landline' }
]

// Get paginated data
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return searchResults.value.slice(start, end)
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

const onViewItem = async (item) => {
  try {
    // Show modal first with loading state
    selectedItem.value = { ...item }
    showViewModal.value = true
    viewModalLoading.value = true
    
    // Fetch full person data with contacts and documents
    const fullPersonData = await peopleApiService.getPersonFull(item.idno)
    selectedItem.value = fullPersonData
  } catch (error) {
    console.error('Error fetching person details:', error)
    messageApi.error('Failed to load person details')
    // Keep the basic item data as fallback
  } finally {
    viewModalLoading.value = false
  }
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

const handleSearch = async (query) => {
  if (!query.trim()) {
    searchResults.value = []
    hasSearched.value = false
    return
  }

  searchQuery.value = query
  await performSearch(query, searchType.value)
}

const performSearch = async (query, type) => {
  loading.value = true
  const searchTypeLabel = type === 'name' ? 'by name' : type === 'idno' ? 'by ID number' : `by ${contactTypes.find(t => t.value === contactType.value)?.label.toLowerCase() || 'contact'}`
  loadingMessage.value = `Searching ${searchTypeLabel}...`

  try {
    let results

    if (type === 'contact') {
      // Use the selected contact type
      results = await peopleApiService.searchPeople(query, type, 100, contactType.value)
    } else {
      results = await peopleApiService.searchPeople(query, type, 100)
    }

    // Handle different response formats and extract person data
    let processedResults = []
    
    if (Array.isArray(results)) {
      processedResults = results
    } else if (results.data && Array.isArray(results.data)) {
      processedResults = results.data
    } else if (results.data) {
      // Single result
      processedResults = [results.data]
    } else if (results.person) {
      // Handle nested person object
      processedResults = [results.person]
    } else if (results.people && Array.isArray(results.people)) {
      // Handle nested people array
      processedResults = results.people
    } else {
      processedResults = []
    }
    
    // Extract person data from nested structures if needed
    searchResults.value = processedResults.map(item => {
      // If item has a person property, extract it
      if (item.person && typeof item.person === 'object') {
        return { ...item.person, ...item }
      }
      // If item has nested data structure, flatten it
      if (item.data && typeof item.data === 'object') {
        return { ...item.data, ...item }
      }
      // Return as is if already in correct format
      return item
    })

    hasSearched.value = true
    currentPage.value = 1

  } catch (error) {
    console.error('Search error:', error)
    messageApi.error(error?.message || 'Failed to search people')
    searchResults.value = []
    hasSearched.value = true
  } finally {
    loading.value = false
  }
}

const loadByPeriod = async (period) => {
  loading.value = true
  loadingMessage.value = `Loading people from ${period}...`

  try {
    const results = await peopleApiService.getByPeriod(period)

    // Handle different response formats for period loading
    let processedResults = []
    
    if (Array.isArray(results)) {
      processedResults = results
    } else if (results.data && Array.isArray(results.data)) {
      processedResults = results.data
    } else if (results.people && Array.isArray(results.people)) {
      processedResults = results.people
    } else {
      processedResults = []
    }
    
    // Extract person data from nested structures if needed
    searchResults.value = processedResults.map(item => {
      // If item has a person property, extract it
      if (item.person && typeof item.person === 'object') {
        return { ...item.person, ...item }
      }
      // If item has nested data structure, flatten it
      if (item.data && typeof item.data === 'object') {
        return { ...item.data, ...item }
      }
      // Return as is if already in correct format
      return item
    })

    hasSearched.value = true
    currentPage.value = 1
    searchQuery.value = ''

  } catch (error) {
    console.error('Period load error:', error)
    messageApi.error(error?.message || `Failed to load people from ${period}`)
    searchResults.value = []
    hasSearched.value = true
  } finally {
    loading.value = false
  }
}

// Handle person created event
const handlePersonCreated = () => {
  // Refresh current search if we have one
  if (hasSearched.value && searchQuery.value) {
    performSearch(searchQuery.value, searchType.value)
  }
}

// Handle person updated event
const handlePersonUpdated = () => {
  // Refresh current search if we have one
  if (hasSearched.value && searchQuery.value) {
    performSearch(searchQuery.value, searchType.value)
  }
}

// Handle person deleted event
const handlePersonDeleted = () => {
  selectedItemId.value = null
  selectedItem.value = null

  // Refresh current search if we have one
  if (hasSearched.value && searchQuery.value) {
    performSearch(searchQuery.value, searchType.value)
  }
}
</script>
