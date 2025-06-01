import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api.js'

export const usePersonnelStore = defineStore('personnel', () => {
  const person = ref([])
  const loading = ref(false)
  const adding = ref(false)
  const error = ref(null)

  const fetchPersonnel = async () => {
    loading.value = true
    error.value = null

    try {
      const res = await api("people").get('/person/period/today')
      person.value = res.info
    } catch (err) {
      error.value = 'Failed to load personnel'
    } finally {
      loading.value = false
    }
  }

  const createPerson = async (personData) => {
    adding.value = true
    error.value = null

    try {
      const res = await api("people").post('/person/', personData)
      person.value.push(res.data)
      return res.data
    } catch (err) {
      error.value = 'Failed to create person'
      throw err
    } finally {
      adding.value = false
    }
  }

  const deletePerson = async (personId) => {
    adding.value = true
    error.value = null

    try {
      await api("people").delete(`/person/${personId}`)
      person.value = person.value.filter(u => u.id !== personId)
    } catch (err) {
      error.value = 'Failed to delete person'
      throw err
    } finally {
      adding.value = false
    }
  }

  const updatePerson = async (personId, personData) => {
    adding.value = true
    error.value = null

    try {
      const res = await api("people").patch(`/person/${personId}`, personData)
      const index = person.value.findIndex(u => u.id === personId)

      if (index !== -1) {
        person.value[index] = res.data
      }

      return res.data
    } catch (err) {
      error.value = 'Failed to update person'
      throw err
    } finally {
      adding.value = false
    }
  }

  return {
    person,
    loading,
    adding,
    error,
    fetchPersonnel,
    createPerson,
    deletePerson,
    updatePerson
  }
})
