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

export const usePackagesStore = defineStore('packages', () => {
  const packages = ref([])
  const loading = ref(false)
  const saving = ref(false)
  const error = ref(null)

  // Create CRUD service for packages
  const crudService = createCrudService('/packages')

  // Fetch all packages
  const fetchAllPackages = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await crudService.getAll()
      packages.value = response.data || []
      return response
    } catch (err) {
      error.value = err.message || 'Failed to fetch packages'
      console.error('Error fetching packages:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Fetch single package by ID
  const fetchPackage = async (id) => {
    loading.value = true
    error.value = null

    try {
      const response = await crudService.getById(id)
      return response.data
    } catch (err) {
      error.value = err.message || 'Failed to fetch package'
      console.error('Error fetching package:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Fetch single package by ID for viewing (without global loading state)
  const fetchPackageForView = async (id) => {
    try {
      const response = await crudService.getById(id)
      return response.data
    } catch (err) {
      console.error('Error fetching package for view:', err)
      throw err
    }
  }

  // Create new package
  const createPackage = async (packageData) => {
    saving.value = true
    error.value = null

    try {
      const response = await crudService.create(packageData)
      // Add to local array
      packages.value.push(response.data)
      return response.data
    } catch (err) {
      const detailedMessage = extractErrorMessage(err)
      error.value = detailedMessage
      console.error('Error creating package:', err)
      // Create a new error with the detailed message for the UI
      const enhancedError = new Error(detailedMessage)
      enhancedError.originalError = err
      throw enhancedError
    } finally {
      saving.value = false
    }
  }

  // Update existing package
  const updatePackage = async (packageId, packageData) => {
    saving.value = true
    error.value = null

    try {
      // Ensure the ID is included in the request body as required by the API
      const dataWithId = {
        ...packageData,
        id: packageId
      }

      const response = await crudService.update(packageId, dataWithId)
      // Update local array
      const index = packages.value.findIndex(p => p.id === packageId)
      if (index !== -1) {
        packages.value[index] = response.data
      }
      return response.data
    } catch (err) {
      const detailedMessage = extractErrorMessage(err)
      error.value = detailedMessage
      console.error('Error updating package:', err)
      // Create a new error with the detailed message for the UI
      const enhancedError = new Error(detailedMessage)
      enhancedError.originalError = err
      throw enhancedError
    } finally {
      saving.value = false
    }
  }

  // Delete package
  const deletePackage = async (packageId) => {
    saving.value = true
    error.value = null

    try {
      await crudService.delete(packageId)
      // Remove from local array
      packages.value = packages.value.filter(p => p.id !== packageId)
    } catch (err) {
      const detailedMessage = extractErrorMessage(err)
      error.value = detailedMessage
      console.error('Error deleting package:', err)
      // Create a new error with the detailed message for the UI
      const enhancedError = new Error(detailedMessage)
      enhancedError.originalError = err
      throw enhancedError
    } finally {
      saving.value = false
    }
  }

  return {
    packages,
    loading,
    saving,
    error,
    fetchAllPackages,
    fetchPackage,
    fetchPackageForView,
    createPackage,
    updatePackage,
    deletePackage
  }
})
