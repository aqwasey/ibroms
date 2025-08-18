import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createCrudService } from '@/services/crudService.js'

// Helper function to extract meaningful error messages from API response
const extractErrorMessage = (error) => {
  // Check if error has validation details
  if (error.response?.data?.detail && Array.isArray(error.response.data.detail)) {
    const validationErrors = error.response.data.detail
    const messages = validationErrors.map(err => {
      // Create user-friendly field names
      const fieldPath = err.loc ? err.loc.slice(1).join(' → ') : 'field'
      const fieldName = fieldPath.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
      return `${fieldName}: ${err.msg}`
    })
    return messages.join('\n')
  }
  
  // Check for other API error formats
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  
  if (error.response?.data?.error) {
    return error.response.data.error
  }
  
  // Fallback to generic message
  return error.message || 'An error occurred'
}

export const useGroupSchemesStore = defineStore('groupSchemes', () => {
  const groupSchemes = ref([])
  const loading = ref(false)
  const saving = ref(false)
  const error = ref(null)
  
  // Create CRUD service for schemes
  const crudService = createCrudService('/schemes')

  // Fetch all group schemes
  const fetchAllGroupSchemes = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await crudService.getAll()
      groupSchemes.value = response.data || []
      return response
    } catch (err) {
      error.value = err.message || 'Failed to fetch group schemes'
      console.error('Error fetching group schemes:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Fetch single group scheme by ID
  const fetchGroupScheme = async (id) => {
    loading.value = true
    error.value = null

    try {
      const response = await crudService.getById(id)
      return response.data
    } catch (err) {
      error.value = err.message || 'Failed to fetch group scheme'
      console.error('Error fetching group scheme:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Create new group scheme
  const createGroupScheme = async (groupSchemeData) => {
    saving.value = true
    error.value = null

    try {
      const response = await crudService.create(groupSchemeData)
      groupSchemes.value.push(response.data)
      return response.data
    } catch (err) {
      const detailedMessage = extractErrorMessage(err)
      error.value = detailedMessage
      console.error('Error creating group scheme:', err)
      // Create a new error with the detailed message for the UI
      const enhancedError = new Error(detailedMessage)
      enhancedError.originalError = err
      throw enhancedError
    } finally {
      saving.value = false
    }
  }

  // Update group scheme
  const updateGroupScheme = async (id, groupSchemeData) => {
    saving.value = true
    error.value = null

    try {
      // Include the ID in the request body as expected by the API
      const dataWithId = { ...groupSchemeData, id }
      
      // Import api service directly to make a PUT request to base endpoint
      const { default: api } = await import('@/services/api.js')
      const response = await api.put('/schemes/', dataWithId)
      
      const index = groupSchemes.value.findIndex(scheme => scheme.id === id)
      if (index !== -1) {
        groupSchemes.value[index] = response.data
      }
      return response.data
    } catch (err) {
      const detailedMessage = extractErrorMessage(err)
      error.value = detailedMessage
      console.error('Error updating group scheme:', err)
      // Create a new error with the detailed message for the UI
      const enhancedError = new Error(detailedMessage)
      enhancedError.originalError = err
      throw enhancedError
    } finally {
      saving.value = false
    }
  }

  // Delete group scheme
  const deleteGroupScheme = async (id) => {
    saving.value = true
    error.value = null

    try {
      await crudService.delete(id)
      groupSchemes.value = groupSchemes.value.filter(scheme => scheme.id !== id)
    } catch (err) {
      const detailedMessage = extractErrorMessage(err)
      error.value = detailedMessage
      console.error('Error deleting group scheme:', err)
      // Create a new error with the detailed message for the UI
      const enhancedError = new Error(detailedMessage)
      enhancedError.originalError = err
      throw enhancedError
    } finally {
      saving.value = false
    }
  }

  return {
    groupSchemes,
    loading,
    saving,
    error,
    fetchAllGroupSchemes,
    fetchGroupScheme,
    createGroupScheme,
    updateGroupScheme,
    deleteGroupScheme
  }
})
