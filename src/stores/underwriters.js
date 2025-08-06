// stores/underwriters.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import notificationService from '@/services/notificationService'

export const useUnderwritersStore = defineStore('underwriters', () => {
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
      const response = await api.get('/underwriters/')
      
      // Check if response.data has the expected structure
      let underwritersData = []
      if (response.data && response.data.data) {
        // API returns {data: [...], info: "...", status: 1}
        underwritersData = response.data.data
      } else if (Array.isArray(response.data)) {
        // API returns data directly as array
        underwritersData = response.data
      }
      
      underwriters.value = underwritersData
    } catch (err) {
      error.value = err.message || 'Failed to fetch underwriters'
      console.error('Fetch underwriters error:', err)
      notificationService.error(err?.response?.data?.info || 'Failed to fetch underwriters')
      underwriters.value = []
    } finally {
      loading.value = false
    }
  }


  const fetchUnderwriterById = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/underwriters/${id}`)
      // Handle different response structures
      const underwriterData = response.data?.data || response.data
      return underwriterData
    } catch (err) {
      error.value = err.message || 'Failed to fetch underwriter'
      console.error('Fetch underwriter by ID error:', err)
      notificationService.error(err?.response?.data?.info || 'Failed to fetch underwriter')
      throw err
    } finally {
      loading.value = false
    }
  }


  const createUnderwriter = async (underwriterData) => {
    saving.value = true
    error.value = null
    try {
      const response = await api.post('/underwriters/', underwriterData)
      // Handle different response structures
      const newUnderwriter = response.data?.data || response.data
      underwriters.value.push(newUnderwriter)
      notificationService.success(response.data?.info || 'Underwriter created successfully')
      return newUnderwriter
    } catch (err) {
      error.value = err
      console.error('[createUnderwriter]', err)
      notificationService.error(err?.response?.data?.info || 'Failed to create underwriter')
      throw err
    } finally {
      saving.value = false
    }
  }

  const updateUnderwriter = async (id, underwriterData) => {
    saving.value = true
    error.value = null
    try {
      const response = await api.patch(`/underwriters/${id}`, underwriterData)
      // Handle different response structures
      const updated = response.data?.data || response.data
      const index = underwriters.value.findIndex(u => u.id === id)
      if (index !== -1) underwriters.value[index] = updated
      notificationService.success(response.data?.info || 'Underwriter updated successfully')
      return updated
    } catch (err) {
      error.value = err
      console.error('[updateUnderwriter]', err)
      notificationService.error(err?.response?.data?.info || 'Failed to update underwriter')
      throw err
    } finally {
      saving.value = false
    }
  }

  const deleteUnderwriter = async (id) => {
    saving.value = true
    error.value = null
    try {
      const response = await api.delete(`/underwriters/${id}`)
      underwriters.value = underwriters.value.filter(u => u.id !== id)
      notificationService.success(response.data?.info || 'Underwriter deleted successfully')
    } catch (err) {
      error.value = err
      console.error('[deleteUnderwriter]', err)
      notificationService.error(err?.response?.data?.info || 'Failed to delete underwriter')
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
    fetchUnderwriterById,
    createUnderwriter,
    updateUnderwriter,
    deleteUnderwriter,
  }
})
