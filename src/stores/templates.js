import { defineStore } from 'pinia'
import axios from 'axios'
import { parameterize } from '@sentry/vue'

export const useTemplateStore = defineStore('templates', {
  state: () => ({
    templates: [],
    currentTemplate: null,
    loading: false,
    error: null,
    template_types: [
      { value: 'email', label: 'Email' },
      { value: 'sms', label: 'SMS' },
      { value: 'push', label: 'Push Notification' },
      // { value: 'webhook', label: 'Webhook' },
      // { value: 'in_app', label: 'In-App Message' }
    ],
    allparams: [
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
  }),

  actions: {
    async createTemplate(payload) {
      this.loading = true
      try {
        const { data } = await axios.post('/templates', payload)
        return data
      } catch (error) {
        this.error = error.response?.data?.detail || error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchTemplateById(id) {
      this.loading = true
      try {
        const { data } = await axios.get(`/templates/${id}`)
        this.currentTemplate = data
        return data
      } catch (error) {
        this.error = error.response?.data?.detail || error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchTemplates() {
      this.loading = true
      try {
        const { data } = await axios.get('/templates')
        this.templates = data
      } catch (error) {
        this.error = error.response?.data?.detail || error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateTemplateById(id, payload) {
      this.loading = true
      try {
        const { data } = await axios.patch(`/templates/${id}`, payload)
        return data
      } catch (error) {
        this.error = error.response?.data?.detail || error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteTemplate(id) {
      this.loading = true
      try {
        await axios.delete(`/templates/${id}`)
        this.templates = this.templates.filter(t => t.id !== id)
      } catch (error) {
        this.error = error.response?.data?.detail || error.message
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
