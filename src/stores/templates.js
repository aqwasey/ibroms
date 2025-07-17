import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api.js'

export const useTemplateStore = defineStore('templates', () => {
  const items = ref([])
  const loading = ref(false)
  const adding = ref(false)
  const error = ref(null)
  
  // Template types for dropdown
  const template_types = [
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'SMS' },
    { value: 'push', label: 'Push Notification' }
  ]
  const fetchTemplates = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await api().get('/templates/')
      items.value = res.info
    } catch (err) {
      items.value = [
        { id: 1, title: 'Welcome Email', category: 'POLICY', template_type: 'email', params_list: ['client_firstname', 'policy_number'], template: 'Welcome {{client_firstname}}, your policy {{policy_number}} has been created.' },
        { id: 2, title: 'Payment Reminder', category: 'NOTIFICATION', template_type: 'sms', params_list: ['client_firstname', 'policy_arrears'], template: 'Hello {{client_firstname}}, your payment of {{policy_arrears}} is due.' },
        { id: 3, title: 'Policy Renewal', category: 'POLICY', template_type: 'email', params_list: ['client_firstname', 'policy_number', 'policy_premium'], template: 'Dear {{client_firstname}}, your policy {{policy_number}} is up for renewal. The premium is {{policy_premium}}.' }
      ]
      error.value = 'Using dummy data for development'
      console.warn('API call failed, using dummy data for templates')
    } finally {
      loading.value = false
    }
  }

  const createTemplate = async (templateData) => {
    adding.value = true
    error.value = null
    try {
      const res = await api().post('/templates/', templateData)
      items.value.push(res.data)
      return res.data
    } catch (err) {
      error.value = 'Failed to create template'
      throw err
    } finally {
      adding.value = false
    }
  }

  const deleteTemplate = async (templateId) => {
    adding.value = true
    error.value = null
    try {
      await api().delete(`/templates/${templateId}`)
      items.value = items.value.filter(t => t.id !== templateId)
    } catch (err) {
      error.value = 'Failed to delete template'
      throw err
    } finally {
      adding.value = false
    }
  }

  const updateTemplate = async (templateId, templateData) => {
    adding.value = true
    error.value = null
    try {
      const res = await api().patch(`/templates/${templateId}`, templateData)
      const index = items.value.findIndex(t => t.id === templateId)
      if (index !== -1) {
        items.value[index] = res.data
      }
      return res.data
    } catch (err) {
      error.value = 'Failed to update template'
      throw err
    } finally {
      adding.value = false
    }
  }

  return {
    items,
    loading,
    adding,
    error,
    template_types,
    fetchTemplates,
    createTemplate,
    deleteTemplate,
    updateTemplate
  }
})
