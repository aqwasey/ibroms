import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/utils/api'

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

  // Actions
  const fetchRules = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api('/rules')
      items.value = response.data || dummyRules
    } catch (err) {
      console.error('Error fetching rules:', err)
      error.value = err.message
      // Fallback to dummy data for development
      items.value = dummyRules
    } finally {
      loading.value = false
    }
  }

  const fetchRuleById = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await api(`/rules/${id}`)
      return response.data
    } catch (err) {
      console.error(`Error fetching rule ${id}:`, err)
      error.value = err.message
      // Return fallback data
      return dummyRules.find(rule => rule.id === id)
    } finally {
      loading.value = false
    }
  }

  const createRule = async (payload) => {
    loading.value = true
    error.value = null
    try {
      const response = await api('/rules', {
        method: 'POST',
        data: payload
      })
      // Add to items list
      const newRule = response.data || { ...payload, id: String(Math.floor(Math.random() * 1000)) }
      items.value.unshift(newRule)
      return newRule
    } catch (err) {
      console.error('Error creating rule:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateRule = async (id, payload) => {
    loading.value = true
    error.value = null
    try {
      const response = await api(`/rules/${id}`, {
        method: 'PATCH',
        data: payload
      })
      // Update in items list
      const updatedRule = response.data || { ...payload, id }
      const index = items.value.findIndex(item => item.id === id)
      if (index !== -1) {
        items.value[index] = updatedRule
      }
      return updatedRule
    } catch (err) {
      console.error(`Error updating rule ${id}:`, err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteRule = async (id) => {
    loading.value = true
    error.value = null
    try {
      await api(`/rules/${id}`, {
        method: 'DELETE'
      })
      // Remove from items list
      items.value = items.value.filter(item => item.id !== id)
      return true
    } catch (err) {
      console.error(`Error deleting rule ${id}:`, err)
      error.value = err.message
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
