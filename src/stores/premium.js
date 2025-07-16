import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api.js'

export const usePremiumStore = defineStore('premium', () => {
  const items = ref([])
  const loading = ref(false)
  const adding = ref(false)
  const error = ref(null)

  const fetchPremiums = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await api().get('/premium/')
      items.value = res.info
    } catch (err) {
      items.value = [
        { id: 1, policyNo: 'POL001', paymentOption: 'Monthly', reason: 'Renewal', amount: '1000' },
        { id: 2, policyNo: 'POL002', paymentOption: 'Quarterly', reason: 'Upgrade', amount: '2500' }
      ]
      error.value = 'Using dummy data for development'
      console.warn('API call failed, using dummy data for premium')
    } finally {
      loading.value = false
    }
  }

  const createPremium = async (premiumData) => {
    adding.value = true
    error.value = null
    try {
      const res = await api().post('/premium/', premiumData)
      items.value.push(res.data)
      return res.data
    } catch (err) {
      error.value = 'Failed to create premium'
      throw err
    } finally {
      adding.value = false
    }
  }

  const deletePremium = async (premiumId) => {
    adding.value = true
    error.value = null
    try {
      await api().delete(`/premium/${premiumId}`)
      items.value = items.value.filter(u => u.id !== premiumId)
    } catch (err) {
      error.value = 'Failed to delete premium'
      throw err
    } finally {
      adding.value = false
    }
  }

  const updatePremium = async (premiumId, premiumData) => {
    adding.value = true
    error.value = null
    try {
      const res = await api().patch(`/premium/${premiumId}`, premiumData)
      const index = items.value.findIndex(u => u.id === premiumId)
      if (index !== -1) {
        items.value[index] = res.data
      }
      return res.data
    } catch (err) {
      error.value = 'Failed to update premium'
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
    fetchPremiums,
    createPremium,
    deletePremium,
    updatePremium
  }
})
