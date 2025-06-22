// stores/underwriters.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api.js'

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
      const response = await api().get('/underwriters/')
      // Case: API returns 200 with an "info" message
      if (response.data?.info) {
        underwriters.value = []  // no actual data
        error.value = response.data.info // show message as a user-facing notice
        console.warn('Info:', response.data.info)
      } else {
        underwriters.value = response.data
      }
    } catch (err) {
      // If the backend returns a JSON error response (e.g. 404 with { info: "Not found" })
      if (err.response && err.response.data?.info) {
        underwriters.value = []
        error.value = err.response.data.info
        console.warn('Info (error case):', err.response.data.info)
      } else {
        // Generic fallback for unexpected errors
        error.value = err.message || 'Unexpected error occurred'
        console.error('Fetch error:', err)
      }
    } finally {
      loading.value = false
    }
  }


  const fetchUnderwriters = async () => {
    loading.value = true
    error.value = null
    try {
      const companyId = localStorage.getItem('company_id')  // Or wherever you store it
      const data = await api().get('/underwriters/', {
        params: { company_id: companyId }
      })
      underwriters.value = data
    } catch (err) {
      error.value = err.response?.data || err.message
      // console.error('Fetch error:', err.response?.data || err.message)
    } finally {
      loading.value = false
    }
  }


  const createUnderwriter = async (underwriterData) => {
    saving.value = true
    error.value = null
    try {
      const newUnderwriter = await api().post('/underwriters/', underwriterData)
      underwriters.value.push(newUnderwriter)
      return newUnderwriter
    } catch (err) {
      error.value = err
      console.error('[createUnderwriter]', err.response?.data || err.message)
      throw err
    } finally {
      saving.value = false
    }
  }

  const updateUnderwriter = async (id, underwriterData) => {
    saving.value = true
    error.value = null
    try {
      const updated = await api().patch(`/underwriters/${id}`, underwriterData)
      const index = underwriters.value.findIndex(u => u.id === id)
      if (index !== -1) underwriters.value[index] = updated
      return updated
    } catch (err) {
      error.value = err
      console.error('[updateUnderwriter]', err.response?.data || err.message)
      throw err
    } finally {
      saving.value = false
    }
  }

  const deleteUnderwriter = async (id) => {
    saving.value = true
    error.value = null
    try {
      await api().delete(`/underwriters/${id}`)
      underwriters.value = underwriters.value.filter(u => u.id !== id)
    } catch (err) {
      error.value = err
      console.error('[deleteUnderwriter]', err.response?.data || err.message)
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
