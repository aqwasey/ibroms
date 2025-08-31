import { defineStore } from 'pinia'
import { ref, readonly } from 'vue'
import { peopleApiService } from '@/services/peopleApi'

export const usePeopleStore = defineStore('people', () => {
  // State
  const people = ref([])
  const loading = ref(false)
  const error = ref(null)
  const searchResults = ref([])
  const currentPerson = ref(null)

  // Fetch all people
  const fetchAllPeople = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await peopleApiService.getAllPeople()
      people.value = Array.isArray(response) ? response : (response.data || [])
    } catch (err) {
      error.value = err.message || 'Failed to fetch people'
      console.error('Error fetching people:', err)
      people.value = []
    } finally {
      loading.value = false
    }
  }

  // Create a new person (basic)
  const createPerson = async (personData) => {
    loading.value = true
    error.value = null
    try {
      const response = await peopleApiService.addPerson(personData)
      const newPerson = response.data || response
      people.value.push(newPerson)
      return newPerson
    } catch (err) {
      error.value = err.message || 'Failed to create person'
      console.error('Error creating person:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Create person with contact
  const createPersonWithContact = async (personData, contactData) => {
    loading.value = true
    error.value = null
    try {
      const response = await peopleApiService.addPersonWithContact(personData, contactData)
      const newPerson = response.data || response
      people.value.push(newPerson)
      return newPerson
    } catch (err) {
      error.value = err.message || 'Failed to create person with contact'
      console.error('Error creating person with contact:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Create person with documents
  const createPersonWithDocs = async (personData, docsData) => {
    loading.value = true
    error.value = null
    try {
      const response = await peopleApiService.addPersonWithDocs(personData, docsData)
      const newPerson = response.data || response
      people.value.push(newPerson)
      return newPerson
    } catch (err) {
      error.value = err.message || 'Failed to create person with documents'
      console.error('Error creating person with documents:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Create person with full details
  const createPersonFull = async (personData, contactData, documentsData) => {
    loading.value = true
    error.value = null
    try {
      const response = await peopleApiService.addPersonFull(personData, contactData, documentsData)
      const newPerson = response.data || response
      people.value.push(newPerson)
      return newPerson
    } catch (err) {
      error.value = err.message || 'Failed to create person with full details'
      console.error('Error creating person with full details:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update a person
  const updatePerson = async (personData) => {
    loading.value = true
    error.value = null
    try {
      const response = await peopleApiService.updatePerson(personData)
      const updatedPerson = response.data || response
      
      const index = people.value.findIndex(p => p.id === personData.id)
      if (index !== -1) {
        people.value[index] = updatedPerson
      }
      
      return updatedPerson
    } catch (err) {
      error.value = err.message || 'Failed to update person'
      console.error('Error updating person:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete a person
  const deletePerson = async (personId) => {
    loading.value = true
    error.value = null
    try {
      await peopleApiService.deletePerson(personId)
      people.value = people.value.filter(p => p.id !== personId)
      return true
    } catch (err) {
      error.value = err.message || 'Failed to delete person'
      console.error('Error deleting person:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get person by ID or ID number
  const getPerson = async (param, value) => {
    loading.value = true
    error.value = null
    try {
      const response = await peopleApiService.getPerson(param, value)
      currentPerson.value = response.data || response
      return currentPerson.value
    } catch (err) {
      error.value = err.message || 'Failed to get person'
      console.error('Error getting person:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get person full profile
  const getPersonFull = async (idno) => {
    loading.value = true
    error.value = null
    try {
      const response = await peopleApiService.getPersonFull(idno)
      currentPerson.value = response.data || response
      return currentPerson.value
    } catch (err) {
      error.value = err.message || 'Failed to get person full profile'
      console.error('Error getting person full profile:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Search people by name
  const searchByName = async (name) => {
    loading.value = true
    error.value = null
    try {
      const response = await peopleApiService.searchByName(name)
      searchResults.value = Array.isArray(response) ? response : (response.data || [])
      return searchResults.value
    } catch (err) {
      error.value = err.message || 'Failed to search people by name'
      console.error('Error searching people by name:', err)
      searchResults.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  // Search people by contact
  const searchByContact = async (item, value) => {
    loading.value = true
    error.value = null
    try {
      const response = await peopleApiService.searchByContact(item, value)
      searchResults.value = Array.isArray(response) ? response : (response.data || [])
      return searchResults.value
    } catch (err) {
      error.value = err.message || 'Failed to search people by contact'
      console.error('Error searching people by contact:', err)
      searchResults.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get people by period
  const getByPeriod = async (param) => {
    loading.value = true
    error.value = null
    try {
      const response = await peopleApiService.getByPeriod(param)
      const results = Array.isArray(response) ? response : (response.data || [])
      people.value = results
      return results
    } catch (err) {
      error.value = err.message || 'Failed to get people by period'
      console.error('Error getting people by period:', err)
      people.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  // Generic search function
  const searchPeople = async (searchTerm, searchType = 'name') => {
    loading.value = true
    error.value = null
    try {
      const response = await peopleApiService.searchPeople(searchTerm, searchType)
      searchResults.value = Array.isArray(response) ? response : (response.data || [])
      return searchResults.value
    } catch (err) {
      error.value = err.message || 'Failed to search people'
      console.error('Error searching people:', err)
      searchResults.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    people: readonly(people),
    searchResults: readonly(searchResults),
    currentPerson: readonly(currentPerson),
    loading: readonly(loading),
    error: readonly(error),
    
    // Actions - CRUD Operations
    fetchAllPeople,
    createPerson,
    createPersonWithContact,
    createPersonWithDocs,
    createPersonFull,
    updatePerson,
    deletePerson,
    
    // Actions - Read Operations
    getPerson,
    getPersonFull,
    searchByName,
    searchByContact,
    getByPeriod,
    searchPeople
  }
})
