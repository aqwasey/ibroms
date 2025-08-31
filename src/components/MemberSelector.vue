<template>
  <div class="w-full">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold" :style="{ color: COLORS.TEXT_PRIMARY }">{{ title }}</h3>
      <button
        v-if="allowMultiple"
        type="button"
        @click="addMember"
        class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
        :style="{ 
          backgroundColor: COLORS.PRIMARY, 
          ':hover': { backgroundColor: COLORS.PRIMARY_DARK },
          'focus:ring-color': COLORS.PRIMARY_LIGHT
        }"
        @mouseover="$event.target.style.backgroundColor = COLORS.PRIMARY_DARK"
        @mouseleave="$event.target.style.backgroundColor = COLORS.PRIMARY"
      >
        <PlusIcon class="w-4 h-4 mr-1" />
        Add Member
      </button>
    </div>
    
    <!-- Single Member Selection (for main member/beneficiary) -->
    <div v-if="!allowMultiple" class="space-y-4">
      <div class="border rounded-lg p-6" :style="{ borderColor: COLORS.BORDER_DARK, backgroundColor: COLORS.BACKGROUND }">
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="block text-sm font-medium" :style="{ color: COLORS.TEXT_PRIMARY }">
                Search by Name or ID Number
              </label>
              <input
                v-model="singleSearchTerm"
                type="text"
                placeholder="Enter name or ID number"
                class="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent text-base"
                :style="{ 
                  borderColor: COLORS.BORDER_DARK, 
                  color: COLORS.TEXT_BODY,
                  'focus:ring-color': COLORS.PRIMARY_LIGHT,
                  'focus:border-color': COLORS.PRIMARY
                }"
                @keyup.enter="searchMembers"
                @input="onSearchInput"
              />
            </div>
            
            <div class="flex items-end">
              <button
                @click="searchMembers"
                :disabled="!singleSearchTerm.trim() || searching"
                class="w-full px-4 py-3 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                :style="{
                  backgroundColor: (!singleSearchTerm.trim() || searching) ? COLORS.GRAY_400 : COLORS.PRIMARY,
                  'focus:ring-color': COLORS.PRIMARY_LIGHT
                }"
              >
                {{ searching ? 'Searching...' : 'Search' }}
              </button>
            </div>
          </div>
          
          <!-- Search Results -->
          <div v-if="searchResults.length > 0" class="mt-4 space-y-2">
            <h4 class="font-medium" :style="{ color: COLORS.TEXT_PRIMARY }">Search Results</h4>
            <div class="max-h-60 overflow-y-auto space-y-2">
              <div 
                v-for="person in searchResults" 
                :key="person.id"
                @click="selectPerson(person)"
                class="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                :style="{ borderColor: COLORS.BORDER }"
              >
                <div class="flex justify-between items-center">
                  <div>
                    <p class="font-medium" :style="{ color: COLORS.TEXT_PRIMARY }">
                      {{ `${person.othername || ''} ${person.surname || ''}`.trim() }}
                    </p>
                    <p class="text-sm" :style="{ color: COLORS.TEXT_PRIMARY }">
                      ID: {{ person.idno }} | {{ person.gender }} | {{ formatDate(person.birthdate) }}
                    </p>
                  </div>
                  <div class="text-xs px-2 py-1 rounded" :style="{ 
                    backgroundColor: person.is_alive ? COLORS.SUCCESS_LIGHT : COLORS.ERROR_LIGHT,
                    color: person.is_alive ? COLORS.SUCCESS_DARK : COLORS.ERROR_DARK
                  }">
                    {{ person.is_alive ? 'Alive' : 'Deceased' }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Selected Member Display -->
          <div v-if="selectedMember" class="mt-4 p-4 rounded-lg border" :style="{ backgroundColor: COLORS.SUCCESS_LIGHT, borderColor: COLORS.SUCCESS }">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="font-medium" :style="{ color: COLORS.TEXT_PRIMARY }">Selected Member</h4>
                <p class="text-sm font-semibold" :style="{ color: COLORS.TEXT_PRIMARY }">
                  {{ selectedMember.name }} ({{ selectedMember.idno }})
                </p>
              </div>
              <button
                @click="clearSingleMember"
                class="p-2 rounded-full hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                :style="{ color: COLORS.ERROR }"
              >
                <XIcon class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Multiple Members Selection -->
    <div v-else class="space-y-4">
      <div v-if="members.length === 0" class="text-center py-8" :style="{ color: COLORS.TEXT_SECONDARY }">
        No members added yet. Click "Add Member" to get started.
      </div>
      
      <div v-else>
        <div 
          v-for="(member, index) in members" 
          :key="index" 
          class="border rounded-lg p-6 mb-4" 
          :style="{ borderColor: COLORS.BORDER_DARK, backgroundColor: COLORS.BACKGROUND }"
        >
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-md font-medium" :style="{ color: COLORS.TEXT_PRIMARY }">
              Member {{ index + 1 }}
            </h4>
            <button
              type="button"
              @click="removeMember(index)"
              class="inline-flex items-center p-2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
              :style="{ 
                color: COLORS.DANGER,
                'focus:ring-color': COLORS.DANGER + '33'
              }"
              @mouseover="$event.target.style.backgroundColor = COLORS.DANGER + '1A'"
              @mouseleave="$event.target.style.backgroundColor = 'transparent'"
            >
              <TrashIcon class="w-4 h-4" />
            </button>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="block text-sm font-medium" :style="{ color: COLORS.TEXT_PRIMARY }">
                Search by Name or ID Number
              </label>
              <input
                v-model="member.searchTerm"
                type="text"
                placeholder="Enter name or ID number"
                class="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent text-base"
                :style="{ 
                  borderColor: COLORS.BORDER_DARK, 
                  color: COLORS.TEXT_BODY,
                  'focus:ring-color': COLORS.PRIMARY_LIGHT,
                  'focus:border-color': COLORS.PRIMARY
                }"
                @keyup.enter="searchMember(index)"
                @input="onMultipleSearchInput(index)"
              />
            </div>
            
            <div class="flex items-end">
              <button
                @click="searchMultipleMember(index)"
                :disabled="!member.searchTerm.trim() || member.searching"
                class="w-full px-4 py-3 text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
                :style="{ 
                  backgroundColor: COLORS.SUCCESS,
                  'focus:ring-color': COLORS.SUCCESS + '33'
                }"
                @mouseover="!member.searching && ($event.target.style.backgroundColor = '#1E8449')"
                @mouseleave="!member.searching && ($event.target.style.backgroundColor = COLORS.SUCCESS)"
              >
                {{ member.searching ? 'Searching...' : 'Search' }}
              </button>
            </div>
          </div>
          
          <!-- Search Results for Multiple Members -->
          <div v-if="member.searchResults && member.searchResults.length > 0" class="mt-4 space-y-2">
            <h5 class="font-medium" :style="{ color: COLORS.TEXT_PRIMARY }">Search Results</h5>
            <div class="max-h-60 overflow-y-auto space-y-2">
              <div 
                v-for="person in member.searchResults" 
                :key="person.id"
                @click="selectMultiplePerson(index, person)"
                class="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                :style="{ borderColor: COLORS.BORDER }"
              >
                <div class="flex justify-between items-center">
                  <div>
                    <p class="font-medium" :style="{ color: COLORS.TEXT_PRIMARY }">
                      {{ `${person.othername || ''} ${person.surname || ''}`.trim() }}
                    </p>
                    <p class="text-sm" :style="{ color: COLORS.TEXT_PRIMARY }">
                      ID: {{ person.idno }} | {{ person.gender }} | {{ formatDate(person.birthdate) }}
                    </p>
                  </div>
                  <div class="text-xs px-2 py-1 rounded" :style="{ 
                    backgroundColor: person.is_alive ? COLORS.SUCCESS_LIGHT : COLORS.ERROR_LIGHT,
                    color: person.is_alive ? COLORS.SUCCESS_DARK : COLORS.ERROR_DARK
                  }">
                    {{ person.is_alive ? 'Alive' : 'Deceased' }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="member.selected" class="mt-4 p-4 rounded-md" :style="{ backgroundColor: COLORS.SUCCESS_LIGHT, borderColor: COLORS.SUCCESS, border: '1px solid' }">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium" :style="{ color: COLORS.TEXT_PRIMARY }">Selected Member</p>
                <p class="text-base font-semibold" :style="{ color: COLORS.TEXT_PRIMARY }">{{ member.selected.name }}</p>
                <p class="text-sm" :style="{ color: COLORS.TEXT_PRIMARY }">ID: {{ member.selected.idno }}</p>
              </div>
              <button
                @click="clearMemberSelection(index)"
                class="p-2 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                :style="{ color: COLORS.ERROR }"
              >
                <XIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { PlusIcon, TrashIcon, XIcon } from 'lucide-vue-next'
import { COLORS } from '@/constants/colors.js'
import { peopleApiService } from '@/services/peopleApi.js'
import { inject } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Array],
    default: () => []
  },
  title: {
    type: String,
    default: 'Members'
  },
  allowMultiple: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: 'Search by ID number'
  }
})

const emit = defineEmits(['update:modelValue', 'member-selected', 'member-removed'])
const messageApi = inject('messageApi')

// Single member selection (for main member/beneficiary)
const singleSearchTerm = ref('')
const selectedMember = ref(null)
const searching = ref(false)
const searchResults = ref([])
const searchTimeout = ref(null)

// Multiple members selection
const members = ref([])
const multipleSearchTimeouts = ref({})

// Initialize based on allowMultiple prop
const initializeComponent = () => {
  if (props.allowMultiple) {
    members.value = Array.isArray(props.modelValue) ? 
      props.modelValue.map(id => ({ 
        id, 
        searchTerm: '', 
        selected: null, 
        searching: false,
        searchResults: []
      })) : []
  } else {
    // For single selection, initialize selectedMember if modelValue exists
    if (props.modelValue) {
      // We could fetch the member details here if needed
    }
  }
}

// Search for a single member (main member/beneficiary)
const searchMembers = async () => {
  if (!singleSearchTerm.value.trim()) return
  
  try {
    searching.value = true
    searchResults.value = []
    
    // Check if search term looks like an ID number (contains only digits)
    const isIdSearch = /^\d+$/.test(singleSearchTerm.value.trim())
    
    let result
    if (isIdSearch) {
      // Search by ID number
      result = await peopleApiService.searchPeople(singleSearchTerm.value, 'idno')
      const person = extractPersonFromResult(result)
      if (person) {
        searchResults.value = [person]
      }
    } else {
      // Search by name using the new endpoint
      const response = await peopleApiService.searchByName(singleSearchTerm.value)
      if (response?.data && Array.isArray(response.data)) {
        searchResults.value = response.data
      }
    }
    
    if (searchResults.value.length === 0) {
      messageApi.error('No persons found')
    }
  } catch (error) {
    console.error('Error searching members:', error)
    messageApi.error('Failed to search for persons')
  } finally {
    searching.value = false
  }
}

const onSearchInput = () => {
  // Clear previous timeout
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  // Clear results and selected member when typing
  searchResults.value = []
  
  // Auto-search after 500ms of no typing (debounce)
  if (singleSearchTerm.value.trim().length >= 2) {
    searchTimeout.value = setTimeout(() => {
      searchMembers()
    }, 500)
  }
}

const selectPerson = (person) => {
  selectedMember.value = {
    id: person.id,
    name: `${person.othername || ''} ${person.surname || ''}`.trim(),
    idno: person.idno
  }
  emit('update:modelValue', person.id)
  emit('member-selected', person)
  searchResults.value = []
  singleSearchTerm.value = ''
  messageApi.success('Member selected successfully')
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString()
  } catch {
    return dateString
  }
}


const onMultipleSearchInput = (index) => {
  const member = members.value[index]
  
  // Clear previous timeout
  if (multipleSearchTimeouts.value[index]) {
    clearTimeout(multipleSearchTimeouts.value[index])
  }
  
  // Clear results when typing
  member.searchResults = []
  
  // Auto-search after 500ms of no typing (debounce)
  if (member.searchTerm.trim().length >= 2) {
    multipleSearchTimeouts.value[index] = setTimeout(() => {
      searchMultipleMember(index)
    }, 500)
  }
}

const searchMultipleMember = async (index) => {
  const member = members.value[index]
  if (!member.searchTerm.trim()) return
  
  try {
    member.searching = true
    member.searchResults = []
    
    // Check if search term looks like an ID number (contains only digits)
    const isIdSearch = /^\d+$/.test(member.searchTerm.trim())
    
    let result
    if (isIdSearch) {
      // Search by ID number
      result = await peopleApiService.searchPeople(member.searchTerm, 'idno')
      const person = extractPersonFromResult(result)
      if (person) {
        member.searchResults = [person]
      }
    } else {
      // Search by name using the new endpoint
      const response = await peopleApiService.searchByName(member.searchTerm)
      if (response?.data && Array.isArray(response.data)) {
        member.searchResults = response.data
      }
    }
    
    if (member.searchResults.length === 0) {
      messageApi.error('No persons found')
    }
  } catch (error) {
    console.error('Error searching member:', error)
    messageApi.error('Failed to search for person')
  } finally {
    member.searching = false
  }
}

const selectMultiplePerson = (index, person) => {
  const member = members.value[index]
  
  member.selected = {
    id: person.id,
    name: `${person.othername || ''} ${person.surname || ''}`.trim(),
    idno: person.idno
  }
  member.id = person.id
  member.searchResults = []
  member.searchTerm = ''
  
  // Update the modelValue array
  const currentIds = props.modelValue || []
  const newIds = [...currentIds]
  newIds[index] = person.id
  emit('update:modelValue', newIds)
  emit('member-selected', person)
  
  messageApi.success('Member selected successfully')
}

// Search method for multiple member selection (legacy compatibility)
const searchMember = searchMultipleMember

// Extract person from API result
const extractPersonFromResult = (result) => {
  if (result.data?.person) {
    return result.data.person
  } else if (result.person) {
    return result.person
  } else if (result.data && !Array.isArray(result.data)) {
    return result.data
  } else if (Array.isArray(result) && result.length > 0) {
    return result[0]
  }
  return null
}


// Add new member slot for multiple selection
const addMember = () => {
  members.value.push({
    id: null,
    searchTerm: '',
    selected: null,
    searching: false,
    searchResults: []
  })
}

// Remove member from multiple selection
const removeMember = (index) => {
  members.value.splice(index, 1)
  updateMultipleSelection()
  emit('member-removed', index)
}

// Clear member selection in multiple selection
const clearMemberSelection = (index) => {
  const member = members.value[index]
  member.selected = null
  member.id = null
  member.searchTerm = ''
  updateMultipleSelection()
}

// Update multiple selection model value
const updateMultipleSelection = () => {
  const selectedIds = members.value
    .filter(member => member.selected && member.id)
    .map(member => member.id)
  emit('update:modelValue', selectedIds)
}

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  if (props.allowMultiple && Array.isArray(newValue)) {
    // Update members array to match new value
    const currentIds = members.value.map(m => m.id).filter(Boolean)
    const newIds = newValue.filter(Boolean)
    
    // Add missing members
    newIds.forEach(id => {
      if (!currentIds.includes(id)) {
        members.value.push({
          id,
          searchTerm: '',
          selected: null,
          searching: false
        })
      }
    })
    
    // Remove extra members
    members.value = members.value.filter(member => 
      !member.id || newIds.includes(member.id)
    )
  }
}, { immediate: true })

// Initialize component
initializeComponent()
</script>
