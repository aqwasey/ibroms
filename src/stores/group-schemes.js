import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api.js'

export const useGroupSchemesStore = defineStore('groupSchemes', () => {
  const groupSchemes = ref([])
  const loading = ref(false)
  const adding = ref(false)
  const error = ref(null)

  const fetchGroupSchemes = async () => {
    loading.value = true
    error.value = null

    try {
      const res = await api().get('/group-schemes/')
      groupSchemes.value = res.info
    } catch (err) {
      error.value = 'Failed to load group schemes'
    } finally {
      loading.value = false
    }
  }

  const createGroupScheme = async (groupSchemeData) => {
    adding.value = true
    error.value = null

    try {
      const res = await api().post('/group-schemes/', groupSchemeData)
      groupSchemes.value.push(res.data)
      return res.data
    } catch (err) {
      error.value = 'Failed to create group scheme'
      throw err
    } finally {
      adding.value = false
    }
  }

  const deleteGroupScheme = async (groupSchemeId) => {
    adding.value = true
    error.value = null

    try {
      await api().delete(`/group-schemes/${groupSchemeId}`)
      groupSchemes.value = groupSchemes.value.filter(u => u.id !== groupSchemeId)
    } catch (err) {
      error.value = 'Failed to delete group scheme'
      throw err
    } finally {
      adding.value = false
    }
  }

  const updateGroupScheme = async (groupSchemeId, groupSchemeData) => {
    adding.value = true
    error.value = null

    try {
      const res = await api().patch(`/group-schemes/${groupSchemeId}`, groupSchemeData)
      const index = groupSchemes.value.findIndex(u => u.id === groupSchemeId)
      if (index !== -1) {
        groupSchemes.value[index] = res.data
      }
      return res.data
    } catch (err) {
      error.value = 'Failed to update group scheme'
      throw err
    } finally {
      adding.value = false
    }
  }

  return {
    groupSchemes,
    loading,
    adding,
    error,
    fetchGroupSchemes,
    createGroupScheme,
    deleteGroupScheme,
    updateGroupScheme
  }
})
