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
  
  // Available parameters for templates
  const allParams = [
    { name: 'client_firstname', label: 'Client Firstname', type: 'string', description: 'The first name of the client' },
    { name: 'client_lastname', label: 'Client Lastname', type: 'string', description: 'The last name of the client' },
    { name: 'policy_number', label: 'Policy Number', type: 'string', description: 'The policy number associated with the client' },
    { name: 'policy_type', label: 'Policy Type', type: 'string', description: 'The type of policy (e.g., health, life, auto)' },
    { name: 'policy_status', label: 'Policy Status', type: 'string', description: 'The current status of the policy (e.g., active, expired)' },
    { name: 'policy_start_date', label: 'Policy Start Date', type: 'date', description: 'The start date of the policy' },
    { name: 'client_email', label: 'Client Email', type: 'string', description: 'The email address of the client' },
    { name: 'client_phone', label: 'Client Phone', type: 'string', description: 'The phone number of the client' },
    { name: 'policy_premium', label: 'Policy Premium', type: 'string', description: 'The premium amount for the policy' },
    { name: 'client_birth_date', label: 'Client Birth Date', type: 'date', description: 'The date of the client\'s birth' },
    { name: 'client_address', label: 'Client Address', type: 'string', description: 'The address of the client' },
    { name: 'policy_arrears', label: 'Policy Arrears', type: 'number', description: 'Policy premium arrears' }
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
    allParams,
    fetchTemplates,
    createTemplate,
    deleteTemplate,
    updateTemplate
  }
})
