import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createCrudService } from '@/services/crudService.js'

export const useAgeGroupsStore = defineStore('ageGroups', () => {
  const ageGroups = ref([])
  const loading = ref(false)
  const saving = ref(false)
  const error = ref(null)
  
  // Create CRUD service for age groups
  const crudService = createCrudService('/age-groups')

  // Fetch all age groups
  const fetchAllAgeGroups = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await crudService.getAll()
      // API returns data in 'info' field for age groups
      ageGroups.value = response.info || []
      return response
    } catch (err) {
      error.value = err.message || 'Failed to fetch age groups'
      console.error('Error fetching age groups:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Fetch single age group by ID
  const fetchAgeGroup = async (id) => {
    loading.value = true
    error.value = null

    try {
      const response = await crudService.getById(id)
      return response.data
    } catch (err) {
      error.value = err.message || 'Failed to fetch age group'
      console.error('Error fetching age group:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Create new age group
  const createAgeGroup = async (ageGroupData) => {
    saving.value = true
    error.value = null

    try {
      const response = await crudService.create(ageGroupData)
      const newAgeGroup = response.data
      ageGroups.value.push(newAgeGroup)
      return newAgeGroup
    } catch (err) {
      error.value = err.message || 'Failed to create age group'
      console.error('Error creating age group:', err)
      throw err
    } finally {
      saving.value = false
    }
  }

  // Update existing age group
  const updateAgeGroup = async (id, ageGroupData) => {
    saving.value = true
    error.value = null

    try {
      const response = await crudService.update(id, ageGroupData)
      const updatedAgeGroup = response.data
      
      // Update age group in local array
      const index = ageGroups.value.findIndex(ag => ag.id === id)
      if (index !== -1) {
        ageGroups.value[index] = updatedAgeGroup
      }
      
      return updatedAgeGroup
    } catch (err) {
      error.value = err.message || 'Failed to update age group'
      console.error('Error updating age group:', err)
      throw err
    } finally {
      saving.value = false
    }
  }

  // Delete age group
  const deleteAgeGroup = async (id) => {
    saving.value = true
    error.value = null

    try {
      await crudService.delete(id)
      
      // Remove age group from local array
      ageGroups.value = ageGroups.value.filter(ag => ag.id !== id)
      
      return true
    } catch (err) {
      error.value = err.message || 'Failed to delete age group'
      console.error('Error deleting age group:', err)
      throw err
    } finally {
      saving.value = false
    }
  }

  return {
    ageGroups,
    loading,
    saving,
    error,
    fetchAllAgeGroups,
    fetchAgeGroup,
    createAgeGroup,
    updateAgeGroup,
    deleteAgeGroup
  }
})
