import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import notificationService from '@/services/notificationService'

export const useRulesStore = defineStore('rules', () => {
  // State
  const items = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Service options for TagInput component
  const serviceOptions = [
    { name: 'Premium', description: 'Premium service features' },
    { name: 'Basic', description: 'Basic service features' },
    { name: 'Analytics', description: 'Analytics service features' },
    { name: 'Reporting', description: 'Reporting service features' },
    { name: 'CRM', description: 'Customer relationship management' },
    { name: 'Billing', description: 'Billing service features' },
    { name: 'Support', description: 'Support service features' },
    { name: 'Marketing', description: 'Marketing service features' },
  ]

  // Limit type options for SelectField component
  const limitTypeOptions = [
    { label: 'Restricted', value: 'RESTRICTED' },
    { label: 'Unlimited', value: 'UNLIMITED' }
  ]

  // Dummy fallback data for development
  const dummyRules = [
    {
      id: '1',
      title: 'Basic Rule',
      description: 'Rule for basic services',
      service_list: ['Basic', 'Support'],
      limit_type: 'RESTRICTED',
      company_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      created_at: new Date().toISOString(),
      status: true
    },
    {
      id: '2',
      title: 'Premium Rule',
      description: 'Rule for premium services',
      service_list: ['Premium', 'Analytics', 'Reporting'],
      limit_type: 'UNLIMITED',
      company_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      created_at: new Date().toISOString(),
      status: true
    }
  ]

  // Get company_id from localStorage user data
  const getCompanyId = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return user.company_id
  }

  // Actions
  const fetchRules = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/rules/')
      // API returns: {data: [...], info: "X Business rules found", status: 1}
      items.value = response.data || []
    } catch (err) {
      console.error('Error fetching rules:', err)
      error.value = err.message
      notificationService.error('Failed to fetch rules')
      items.value = []
    } finally {
      loading.value = false
    }
  }

  const fetchRuleById = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/rules/${id}`)
      // API returns: {data: {...}, info: "1 Business rule for X found", status: 1}
      return response.data
    } catch (err) {
      console.error(`Error fetching rule ${id}:`, err)
      error.value = err.message
      notificationService.error('Failed to fetch rule details')
      throw err
    } finally {
      loading.value = false
    }
  }

  const createRule = async (payload) => {
    loading.value = true
    error.value = null
    try {
      // Add company_id from logged-in user
      const ruleData = {
        ...payload,
        company_id: getCompanyId()
      }
      
      const response = await api.post('/rules/', ruleData)
      // API returns: {data: {...}, info: "Business rule created successful", status: 1}
      
      if (response.status === 1) {
        // Add to items list
        items.value.unshift(response.data)
        notificationService.success(response.info || 'Rule created successfully')
        return response.data
      } else {
        throw new Error(response.info || 'Failed to create rule')
      }
    } catch (err) {
      console.error('Error creating rule:', err)
      error.value = err.message
      const errorMsg = err.response?.data?.info || err.message || 'Failed to create rule'
      notificationService.error(errorMsg)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateRule = async (id, payload) => {
    loading.value = true
    error.value = null
    try {
      // Prepare update payload with required fields
      const updateData = {
        title: payload.title,
        description: payload.description,
        service_list: payload.service_list,
        limit_type: payload.limit_type,
        id: parseInt(id),
        activate: payload.activate || false
      }
      
      const response = await api.patch(`/rules/${id}`, updateData)
      // API returns: {data: {...}, info: "Business rule updated successful", status: 1}
      
      if (response.status === 1) {
        // Update in items list
        const index = items.value.findIndex(item => item.id == id)
        if (index !== -1) {
          items.value[index] = response.data
        }
        notificationService.success(response.info || 'Rule updated successfully')
        return response.data
      } else {
        throw new Error(response.info || 'Failed to update rule')
      }
    } catch (err) {
      console.error(`Error updating rule ${id}:`, err)
      error.value = err.message
      const errorMsg = err.response?.data?.info || err.message || 'Failed to update rule'
      notificationService.error(errorMsg)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteRule = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.delete(`/rules/${id}`)
      // API returns: {data: "Business rule deleted successful", status: 1}
      
      if (response.status === 1) {
        // Remove from items list
        items.value = items.value.filter(item => item.id != id)
        notificationService.success(response.data || 'Rule deleted successfully')
        return true
      } else {
        throw new Error(response.info || 'Failed to delete rule')
      }
    } catch (err) {
      console.error(`Error deleting rule ${id}:`, err)
      error.value = err.message
      const errorMsg = err.response?.data?.info || err.message || 'Failed to delete rule'
      notificationService.error(errorMsg)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    items,
    loading,
    error,
    serviceOptions,
    limitTypeOptions,
    fetchRules,
    fetchRuleById,
    createRule,
    updateRule,
    deleteRule
  }
})
