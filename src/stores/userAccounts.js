import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api.js'

export const useUserAccountStore = defineStore('userAccounts', () => {
  const users = ref([])
  const loading = ref(false)
  const adding = ref(false)
  const error = ref(null)

  const fetchUsers = async () => {
    loading.value = true
    error.value = null

    try {
      const res = await api("users").get('/user-accounts')
      users.value = res.info
    } catch (err) {
      error.value = 'Failed to load user accounts'
      console.error('Error fetching user accounts:', err)
    } finally {
      loading.value = false
    }
  }

  const createUser = async (userData) => {
    adding.value = true
    error.value = null

    try {
      const res = await api("users").post('/user-accounts', userData)
      users.value.push(res.data || userData) // Fallback to userData for testing
      return res.data || userData
    } catch (err) {
      error.value = 'Failed to create user account'
      console.error('Error creating user account:', err)
      throw err
    } finally {
      adding.value = false
    }
  }

  const deleteUser = async (userId) => {
    loading.value = true
    error.value = null

    try {
      await api("users").delete(`/user-accounts/${userId}`)
      users.value = users.value.filter(u => u.id !== userId)
    } catch (err) {
      error.value = 'Failed to delete user account'
      console.error('Error deleting user account:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (userId, userData) => {
    loading.value = true
    error.value = null

    try {
      const res = await api("users").patch(`/user-accounts/${userId}`, userData)
      const index = users.value.findIndex(u => u.id === userId)

      if (index !== -1) {
        users.value[index] = res.data || { ...users.value[index], ...userData } // Fallback for testing
      }

      return res.data || { ...users.value[index] }
    } catch (err) {
      error.value = 'Failed to update user account'
      console.error('Error updating user account:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const getUserById = (userId) => {
    return users.value.find(user => user.id === userId)
  }

  return {
    users,
    loading,
    adding,
    error,
    fetchUsers,
    createUser,
    deleteUser,
    updateUser,
    getUserById
  }
})
