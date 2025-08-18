import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { createCrudService } from '@/services/crudService'

// Helper function to extract meaningful error messages from API response
const extractErrorMessage = (error) => {
  // Check if error has validation details
  if (error.response?.data?.detail && Array.isArray(error.response.data.detail)) {
    const validationErrors = error.response.data.detail
    const messages = validationErrors.map(err => {
      // Create user-friendly field names
      const fieldPath = err.loc ? err.loc.slice(1).join(' → ') : 'field'
      const fieldName = fieldPath.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
      return `${fieldName}: ${err.msg}`
    })
    return messages.join('\n')
  }
  
  // Check for other API error formats
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  
  if (error.response?.data?.error) {
    return error.response.data.error
  }
  
  // Fallback to generic message
  return error.message || 'An error occurred'
}

export const useNotifyStore = defineStore('notify', () => {
  const notifications = ref([])
  const messageTemplates = ref([])
  const loading = ref(false)
  const saving = ref(false)
  const error = ref(null)

  // Create CRUD service for notifications
  const crudService = createCrudService('/notifications')
  
  // Create service for templates
  const templateService = createCrudService('/templates')

  // Available schedule options
  const scheduleOptions = ref([
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'once', label: 'One-time' }
  ])

  // Fetch all notifications
  const fetchAllNotifications = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await crudService.getAll()
      notifications.value = response.data || []
      return response
    } catch (err) {
      error.value = err.message || 'Failed to fetch notifications'
      console.error('Error fetching notifications:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Fetch single notification by ID
  const fetchNotification = async (id) => {
    loading.value = true
    error.value = null

    try {
      const response = await crudService.getById(id)
      return response.data
    } catch (err) {
      error.value = err.message || 'Failed to fetch notification'
      console.error('Error fetching notification:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Fetch single notification by ID for viewing (without global loading state)
  const fetchNotificationForView = async (id) => {
    try {
      const response = await crudService.getById(id)
      return response.data
    } catch (err) {
      console.error('Error fetching notification for view:', err)
      throw err
    }
  }

  // Fetch message templates from API
  const fetchMessageTemplates = async () => {
    try {
      const response = await templateService.getAll()
      messageTemplates.value = response.data || []
      return response
    } catch (err) {
      console.error('Error fetching message templates:', err)
      // Fallback to empty array if templates can't be fetched
      messageTemplates.value = []
      throw err
    }
  }

  // Create new notification
  const createNotification = async (notificationData) => {
    saving.value = true
    error.value = null

    try {
      const response = await crudService.create(notificationData)
      // Add to local array
      notifications.value.push(response.data)
      return response.data
    } catch (err) {
      const detailedMessage = extractErrorMessage(err)
      error.value = detailedMessage
      console.error('Error creating notification:', err)
      // Create a new error with the detailed message for the UI
      const enhancedError = new Error(detailedMessage)
      enhancedError.originalError = err
      throw enhancedError
    } finally {
      saving.value = false
    }
  }

  // Update existing notification
  const updateNotification = async (id, notificationData) => {
    saving.value = true
    error.value = null

    try {
      const response = await crudService.update(id, notificationData)
      // Update local array
      const index = notifications.value.findIndex(n => n.id === id)
      if (index !== -1) {
        notifications.value[index] = response.data
      }
      return response.data
    } catch (err) {
      const detailedMessage = extractErrorMessage(err)
      error.value = detailedMessage
      console.error('Error updating notification:', err)
      // Create a new error with the detailed message for the UI
      const enhancedError = new Error(detailedMessage)
      enhancedError.originalError = err
      throw enhancedError
    } finally {
      saving.value = false
    }
  }

  // Delete notification
  const deleteNotification = async (id) => {
    saving.value = true
    error.value = null

    try {
      await crudService.delete(id)
      // Remove from local array
      notifications.value = notifications.value.filter(n => n.id !== id)
    } catch (err) {
      const detailedMessage = extractErrorMessage(err)
      error.value = detailedMessage
      console.error('Error deleting notification:', err)
      // Create a new error with the detailed message for the UI
      const enhancedError = new Error(detailedMessage)
      enhancedError.originalError = err
      throw enhancedError
    } finally {
      saving.value = false
    }
  }

  // Computed property for message template options (for TagInput component)
  const messageTemplateOptions = computed(() => {
    return messageTemplates.value.map(template => ({
      name: template.title,
      label: template.title,
      value: template.title
    }))
  })

  return {
    notifications,
    messageTemplates,
    loading,
    saving,
    error,
    messageTemplateOptions,
    scheduleOptions,
    fetchAllNotifications,
    fetchNotification,
    fetchNotificationForView,
    fetchMessageTemplates,
    createNotification,
    updateNotification,
    deleteNotification
  }
})
