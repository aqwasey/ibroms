import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createCrudService } from '@/services/crudService.js'

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
      error.value = err.message || 'Failed to create package'
      console.error('Error creating package:', err)
      throw err
    } finally {
      saving.value = false
    }
  }

  // Update existing package
  const updatePackage = async (packageId, packageData) => {
    saving.value = true
    error.value = null

    try {
      const response = await crudService.update(packageId, packageData)
      // Update local array
      const index = packages.value.findIndex(p => p.id === packageId)
      if (index !== -1) {
        packages.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.message || 'Failed to update package'
      console.error('Error updating package:', err)
      throw err
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
      error.value = err.message || 'Failed to delete package'
      console.error('Error deleting package:', err)
      throw err
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
