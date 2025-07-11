import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api.js'

export const usePackagesStore = defineStore('packages', () => {
  const items = ref([])
  const loading = ref(false)
  const adding = ref(false)
  const error = ref(null)

  const fetchPackages = async () => {
    loading.value = true
    error.value = null

    try {
      const res = await api().get('/packages/')
      items.value = res.info
    } catch (err) {
      // Add dummy data for development
      items.value = [
        {
          id: 1,
          title: 'Standard Family',
          ageBegin: '18',
          ageEnd: '60',
          relationship: 'Family',
          price: '500'
        },
        {
          id: 2,
          title: 'Premium Individual',
          ageBegin: '25',
          ageEnd: '45',
          relationship: 'Individual',
          price: '300'
        },
        {
          id: 3,
          title: 'Group Enterprise',
          ageBegin: '20',
          ageEnd: '55',
          relationship: 'Group',
          price: '1200'
        }
      ]
      error.value = 'Using dummy data for development'
      console.warn('API call failed, using dummy data for packages')
    } finally {
      loading.value = false
    }
  }

  const createPackage = async (packageData) => {
    adding.value = true
    error.value = null

    try {
      const res = await api().post('/packages/', packageData)
      items.value.push(res.data)
      return res.data
    } catch (err) {
      error.value = 'Failed to create package'
      throw err
    } finally {
      adding.value = false
    }
  }

  const deletePackage = async (packageId) => {
    adding.value = true
    error.value = null

    try {
      await api().delete(`/packages/${packageId}`)
      items.value = items.value.filter(u => u.id !== packageId)
    } catch (err) {
      error.value = 'Failed to delete package'
      throw err
    } finally {
      adding.value = false
    }
  }

  const updatePackage = async (packageId, packageData) => {
    adding.value = true
    error.value = null

    try {
      const res = await api().patch(`/packages/${packageId}`, packageData)
      const index = items.value.findIndex(u => u.id === packageId)
      if (index !== -1) {
        items.value[index] = res.data
      }
      return res.data
    } catch (err) {
      error.value = 'Failed to update package'
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
    fetchPackages,
    createPackage,
    deletePackage,
    updatePackage
  }
})
