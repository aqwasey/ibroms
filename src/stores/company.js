import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api.js'

export const useCompanyStore = defineStore('company', () => {
  const company = ref(null)
  const loading = ref(false)
  const adding = ref(false)
  const error = ref(null)

  const fetchCompany = async () => {
    loading.value = true
    error.value = null
    console.log('🏪 Company Store: Starting API call to /company/')

    try {
      const res = await api.get('/company/')
      console.log('🏪 Company Store: Raw API response:', res)
      console.log('🏪 Company Store: Response status:', res.status)
      console.log('🏪 Company Store: Response data:', res.data)
      console.log('🏪 Company Store: Response data type:', typeof res.data)
      
      company.value = res.data
      console.log('🏪 Company Store: Company value set to:', company.value)
    } catch (err) {
      console.error('🏪 Company Store: API Error:', err)
      console.error('🏪 Company Store: Error response:', err.response)
      error.value = 'Failed to load company'
    } finally {
      loading.value = false
      console.log('🏪 Company Store: Final company value:', company.value)
      console.log('🏪 Company Store: Final loading state:', loading.value)
    }
  }

  const createProduct = async (productData) => {
    adding.value = true
    error.value = null

    try {
      const res = await api().post('/company/', productData)
      company.value.push(res.data)
      return res.data
    } catch (err) {
      error.value = 'Failed to create product'
      throw err
    } finally {
      adding.value = false
    }
  }

  const deleteProduct = async (productId) => {
    adding.value = true
    error.value = null

    try {
      await api().delete(`/company/${productId}`)
      company.value = company.value.filter(u => u.id !== productId)
    } catch (err) {
      error.value = 'Failed to delete product'
      throw err
    } finally {
      adding.value = false
    }
  }

  const updateProduct = async (productId, productData) => {
    adding.value = true
    error.value = null

    try {
      const res = await api().patch(`/company/${productId}`, productData)
      const index = company.value.findIndex(u => u.id === productId)
      if (index !== -1) {
        company.value[index] = res.data
      }
      return res.data
    } catch (err) {
      error.value = 'Failed to update product'
      throw err
    } finally {
      adding.value = false
    }
  }

  return {
    company,
    loading,
    adding,
    error,
    fetchCompany,
    createProduct,
    deleteProduct,
    updateProduct
  }
})
