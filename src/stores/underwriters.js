// stores/underwriters.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createCrudService } from '@/services/crudService'

export const useUnderwritersStore = defineStore('underwriters', () => {
  // Create CRUD service for underwriters endpoint
  const underwriterService = createCrudService('/underwriters')
  
  const underwriters = ref([])
  const loading = ref(false)
  const saving = ref(false)
  const error = ref(null)
  const provinces = [
    'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo',
    'Mpumalanga', 'North West', 'Northern Cape', 'Western Cape'
  ]
  const sectors = [
    'Funeral', 'Legal', 'Medical', 'Life', 'Property', 'Vehicle', 'Other'
  ]

  const fetchAllUnderwriters = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await underwriterService.getAll()
      // Process the response
      underwriters.value = response
    } catch (err) {
      error.value = err.message || 'Unexpected error occurred'
      console.error('Fetch error:', err)
      underwriters.value = []
    } finally {
      loading.value = false
    }
  }


  const fetchUnderwriters = async () => {
    loading.value = true
    error.value = null
    try {
      const companyId = localStorage.getItem('company_id')  // Or wherever you store it
      const response = await underwriterService.getAll({ company_id: companyId })
      underwriters.value = response
    } catch (err) {
      error.value = err.message || 'Unexpected error occurred'
      console.error('Fetch error:', err)
      underwriters.value = []
    } finally {
      loading.value = false
    }
  }


  const createUnderwriter = async (underwriterData) => {
    saving.value = true
    error.value = null
    try {
      const newUnderwriter = await underwriterService.create(underwriterData)
      underwriters.value.push(newUnderwriter)
      return newUnderwriter
    } catch (err) {
      error.value = err
      console.error('[createUnderwriter]', err.message)
      throw err
    } finally {
      saving.value = false
    }
  }

  const updateUnderwriter = async (id, underwriterData) => {
    saving.value = true
    error.value = null
    try {
      const updated = await underwriterService.patch(id, underwriterData)
      const index = underwriters.value.findIndex(u => u.id === id)
      if (index !== -1) underwriters.value[index] = updated
      return updated
    } catch (err) {
      error.value = err
      console.error('[updateUnderwriter]', err.message)
      throw err
    } finally {
      saving.value = false
    }
  }

  const deleteUnderwriter = async (id) => {
    saving.value = true
    error.value = null
    try {
      await underwriterService.delete(id)
      underwriters.value = underwriters.value.filter(u => u.id !== id)
    } catch (err) {
      error.value = err
      console.error('[deleteUnderwriter]', err.message)
      throw err
    } finally {
      saving.value = false
    }
  }

  return {
    provinces,
    sectors,
    underwriters,
    loading,
    saving,
    error,
    fetchAllUnderwriters,
    fetchUnderwriters,
    createUnderwriter,
    updateUnderwriter,
    deleteUnderwriter,
  }
})
