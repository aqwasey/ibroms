import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api'

export const useNotifyStore = defineStore('notify', () => {
  const items = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Template message options for TagInput component
  const messageTemplateOptions = ref([
    { name: 'Welcome Message', label: 'Welcome Message', type: 'text', description: 'Welcome message for new users' },
    { name: 'Reminder', label: 'Reminder', type: 'text', description: 'Reminder notification' },
    { name: 'Alert', label: 'Alert', type: 'text', description: 'Alert notification' },
    { name: 'Update', label: 'Update', type: 'text', description: 'Update notification' },
    { name: 'Confirmation', label: 'Confirmation', type: 'text', description: 'Confirmation message' },
    { name: 'Newsletter', label: 'Newsletter', type: 'text', description: 'Newsletter notification' },
    { name: 'Promotional', label: 'Promotional', type: 'text', description: 'Promotional message' }
  ])

  // Available schedule options
  const scheduleOptions = ref([
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'once', label: 'One-time' }
  ])

  // Fetch all notifications
  const fetchNotifications = async () => {
    loading.value = true
    error.value = null
    try {
      // Call API to fetch notifications
      // For development, using placeholder data
      if (import.meta.env.DEV) {
        // Dummy data for development
        items.value = [
          {
            id: '1',
            title: 'System Maintenance',
            description: 'System will be down for maintenance',
            message_templates: ['Alert', 'Reminder'],
            begin: '2025-07-20T08:00:00Z',
            end: '2025-07-20T16:00:00Z',
            schedule: 'once'
          },
          {
            id: '2',
            title: 'Weekly Newsletter',
            description: 'Weekly newsletter for subscribers',
            message_templates: ['Newsletter', 'Promotional'],
            begin: '2025-07-18T09:00:00Z',
            end: '2025-08-18T09:00:00Z',
            schedule: 'weekly'
          },
          {
            id: '3',
            title: 'New Feature Announcement',
            description: 'Announcing new platform features',
            message_templates: ['Update', 'Promotional'],
            begin: '2025-07-25T10:00:00Z',
            end: '2025-07-25T18:00:00Z',
            schedule: 'once'
          }
        ]
      } else {
        // In group schemeion, fetch from API
        const response = await api.get('/notifications')
        items.value = response.data
      }
    } catch (err) {
      console.error('Error fetching notifications:', err)
      error.value = err.message || 'Failed to fetch notifications'
    } finally {
      loading.value = false
    }
  }

  // Create new notification
  const createNotification = async (notification) => {
    loading.value = true
    error.value = null
    try {
      // Call API to create notification
      if (import.meta.env.DEV) {
        // Simulate API call for development
        const newNotification = {
          id: String(items.value.length + 1),
          ...notification
        }
        items.value.push(newNotification)
        return newNotification
      } else {
        // In group schemeion, send to API
        const response = await api.post('/notifications', notification)
        return response.data
      }
    } catch (err) {
      console.error('Error creating notification:', err)
      error.value = err.message || 'Failed to create notification'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update existing notification
  const updateNotification = async (id, notification) => {
    loading.value = true
    error.value = null
    try {
      // Call API to update notification
      if (import.meta.env.DEV) {
        // Simulate API call for development
        const index = items.value.findIndex(item => item.id === id)
        if (index !== -1) {
          items.value[index] = { ...items.value[index], ...notification }
          return items.value[index]
        }
        throw new Error('Notification not found')
      } else {
        // In group schemeion, send to API
        const response = await api.put(`/notifications/${id}`, notification)
        return response.data
      }
    } catch (err) {
      console.error('Error updating notification:', err)
      error.value = err.message || 'Failed to update notification'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete notification
  const deleteNotification = async (id) => {
    loading.value = true
    error.value = null
    try {
      // Call API to delete notification
      if (import.meta.env.DEV) {
        // Simulate API call for development
        const index = items.value.findIndex(item => item.id === id)
        if (index !== -1) {
          items.value.splice(index, 1)
          return true
        }
        throw new Error('Notification not found')
      } else {
        // In group schemeion, send to API
        await api.delete(`/notifications/${id}`)
        return true
      }
    } catch (err) {
      console.error('Error deleting notification:', err)
      error.value = err.message || 'Failed to delete notification'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    items,
    loading,
    error,
    messageTemplateOptions,
    scheduleOptions,
    fetchNotifications,
    createNotification,
    updateNotification,
    deleteNotification
  }
})
