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
      const res = await api.post('/company/', productData)
      company.value = res.data
      return res.data
    } catch (err) {
      error.value = 'Failed to create company'
      throw err
    } finally {
      adding.value = false
    }
  }

  const deleteProduct = async (productId) => {
    adding.value = true
    error.value = null

    try {
      await api.delete(`/company/${productId}`)
      company.value = null
    } catch (err) {
      error.value = 'Failed to delete company'
      throw err
    } finally {
      adding.value = false
    }
  }

  const updateProduct = async (productData) => {
    adding.value = true
    error.value = null
    console.log('📝 Company Store: Starting update with data:', productData)

    try {
      // Get company ID from user data in localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const companyId = user.company_id
      
      if (!companyId) {
        throw new Error('Company ID not found in user data')
      }
      
      console.log('🏪 Company Store: Updating company ID:', companyId)
      console.log('📝 Company Store: Update payload:', productData)
      
      const res = await api.patch(`/company/${companyId}`, productData)
      console.log('🏪 Company Store: Update response:', res)
      
      // Update the stored company data
      company.value = res.data
      console.log('🏪 Company Store: Updated company value:', company.value)
      
      return res.data
    } catch (err) {
      console.error('🏪 Company Store: Update error:', err)
      error.value = 'Failed to update company profile'
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
