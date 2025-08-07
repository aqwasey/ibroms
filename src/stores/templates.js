import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createCrudService } from '@/services/crudService.js'

export const useTemplateStore = defineStore('templates', () => {
  const templates = ref([])
  const loading = ref(false)
  const saving = ref(false)
  const error = ref(null)
  
  // Create CRUD service for templates
  const crudService = createCrudService('/templates')
  
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
  // Fetch all templates
  const fetchAllTemplates = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await crudService.getAll()
      templates.value = response.data || []
      return response
    } catch (err) {
      error.value = err.message || 'Failed to fetch templates'
      console.error('Error fetching templates:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Fetch single template by ID
  const fetchTemplate = async (id) => {
    loading.value = true
    error.value = null

    try {
      const response = await crudService.getById(id)
      return response.data
    } catch (err) {
      error.value = err.message || 'Failed to fetch template'
      console.error('Error fetching template:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Create new template
  const createTemplate = async (templateData) => {
    saving.value = true
    error.value = null

    try {
      const response = await crudService.create(templateData)
      const newTemplate = response.data
      templates.value.push(newTemplate)
      return newTemplate
    } catch (err) {
      error.value = err.message || 'Failed to create template'
      console.error('Error creating template:', err)
      throw err
    } finally {
      saving.value = false
    }
  }

  // Update existing template
  const updateTemplate = async (id, templateData) => {
    saving.value = true
    error.value = null

    try {
      const response = await crudService.update(id, templateData)
      const updatedTemplate = response.data
      
      // Update template in local array
      const index = templates.value.findIndex(t => t.id === id)
      if (index !== -1) {
        templates.value[index] = updatedTemplate
      }
      
      return updatedTemplate
    } catch (err) {
      error.value = err.message || 'Failed to update template'
      console.error('Error updating template:', err)
      throw err
    } finally {
      saving.value = false
    }
  }

  // Delete template
  const deleteTemplate = async (id) => {
    saving.value = true
    error.value = null

    try {
      await crudService.delete(id)
      
      // Remove template from local array
      templates.value = templates.value.filter(t => t.id !== id)
      
      return true
    } catch (err) {
      error.value = err.message || 'Failed to delete template'
      console.error('Error deleting template:', err)
      throw err
    } finally {
      saving.value = false
    }
  }

  return {
    templates,
    loading,
    saving,
    error,
    template_types,
    allParams,
    fetchAllTemplates,
    fetchTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate
  }
})
