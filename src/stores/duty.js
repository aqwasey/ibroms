import { ref, computed, readonly } from 'vue'
import { defineStore } from 'pinia'
import { dutyApiService } from '@/services/dutyApi'

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

export const useDutyStore = defineStore('duty', () => {
  const duties = ref([])
  const currentDuty = ref(null)
  const loading = ref(false)
  const saving = ref(false)
  const error = ref(null)

  // Computed properties
  const dutyCount = computed(() => duties.value.length)
  const hasDuties = computed(() => duties.value.length > 0)

  // Fetch all duties
  const fetchAllDuties = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await dutyApiService.getAllDuties()
      duties.value = response || []
      return response
    } catch (err) {
      const detailedMessage = extractErrorMessage(err)
      error.value = detailedMessage
      console.error('Error fetching duties:', err)
      throw new Error(detailedMessage)
    } finally {
      loading.value = false
    }
  }

  // Fetch single duty by ID
  const fetchDuty = async (id) => {
    loading.value = true
    error.value = null

    try {
      const response = await dutyApiService.getDutyById(id)
      currentDuty.value = response
      return response
    } catch (err) {
      const detailedMessage = extractErrorMessage(err)
      error.value = detailedMessage
      console.error('Error fetching duty:', err)
      throw new Error(detailedMessage)
    } finally {
      loading.value = false
    }
  }

  // Fetch single duty for viewing (without global loading state)
  const fetchDutyForView = async (id) => {
    try {
      const response = await dutyApiService.getDutyById(id)
      return response
    } catch (err) {
      console.error('Error fetching duty for view:', err)
      throw err
    }
  }

  // Fetch duty titles
  const fetchDutyTitles = async () => {
    try {
      const response = await dutyApiService.getDutyTitles()
      return response || []
    } catch (err) {
      console.error('Error fetching duty titles:', err)
      throw err
    }
  }

  // Create new duty
  const createDuty = async (dutyData) => {
    saving.value = true
    error.value = null

    try {
      const response = await dutyApiService.addDuty(dutyData)
      // Add to local array
      duties.value.push(response)
      return response
    } catch (err) {
      const detailedMessage = extractErrorMessage(err)
      error.value = detailedMessage
      console.error('Error creating duty:', err)
      // Create a new error with the detailed message for the UI
      const enhancedError = new Error(detailedMessage)
      enhancedError.originalError = err
      throw enhancedError
    } finally {
      saving.value = false
    }
  }

  // Update existing duty
  const updateDuty = async (dutyId, dutyData) => {
    saving.value = true
    error.value = null

    try {
      const response = await dutyApiService.updateDuty(dutyId, dutyData)
      // Update local array
      const index = duties.value.findIndex(d => d.id === dutyId)
      if (index !== -1) {
        duties.value[index] = response
      }
      return response
    } catch (err) {
      const detailedMessage = extractErrorMessage(err)
      error.value = detailedMessage
      console.error('Error updating duty:', err)
      // Create a new error with the detailed message for the UI
      const enhancedError = new Error(detailedMessage)
      enhancedError.originalError = err
      throw enhancedError
    } finally {
      saving.value = false
    }
  }

  // Delete duty
  const deleteDuty = async (dutyId) => {
    saving.value = true
    error.value = null

    try {
      await dutyApiService.deleteDuty(dutyId)
      // Remove from local array
      duties.value = duties.value.filter(d => d.id !== dutyId)
    } catch (err) {
      const detailedMessage = extractErrorMessage(err)
      error.value = detailedMessage
      console.error('Error deleting duty:', err)
      // Create a new error with the detailed message for the UI
      const enhancedError = new Error(detailedMessage)
      enhancedError.originalError = err
      throw enhancedError
    } finally {
      saving.value = false
    }
  }

  // Clear current duty
  const clearCurrentDuty = () => {
    currentDuty.value = null
  }

  // Clear error
  const clearError = () => {
    error.value = null
  }

  return {
    // State
    duties: readonly(duties),
    currentDuty: readonly(currentDuty),
    loading: readonly(loading),
    saving: readonly(saving),
    error: readonly(error),
    
    // Computed
    dutyCount,
    hasDuties,
    
    // Actions
    fetchAllDuties,
    fetchDuty,
    fetchDutyForView,
    fetchDutyTitles,
    createDuty,
    updateDuty,
    deleteDuty,
    clearCurrentDuty,
    clearError
  }
})
