import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api.js'

export const usePersonStore = defineStore('person', () => {
  const persons = ref([])
  const loading = ref(false)
  const adding = ref(false)
  const error = ref(null)
  const idtypes = [
    'RSA ID', 'RSA ID Book', 'Asylum', 'Refugee', 'Passport', 'RSA Drivers License', 'Other'
  ]

  const fetchCurrentPersons = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await api("people").get('/person/period/today')
      persons.value = res.info
    } catch (err) {
      error.value = 'Failed to load persons'
    } finally {
      loading.value = false
    }
  }

  const fetchPersonByID = async (id) => {
    loading.value = true
    error.value = null
    try {
      const res = await api("people").get(`/person/token/${id}`)
      persons.value = [res.info]
    } catch (err) {
      error.value = `Failed to load person using an ID token ${id}`
    } finally {
      loading.value = false
    }
  }

  const fetchPersons = async (period) => {
    loading.value = true
    error.value = null
    try {
      const res = await api("people").get(`/person/period/${period}`)
      persons.value = res.info
    } catch (err) {
      error.value = `Failed to load persons for ${period}`
    } finally {
      loading.value = false
    }
  }

  const createPerson = async (person) => {
    adding.value = true
    error.value = null

    try {
      console.log(person)
      const res = await api("people").post('/person/', person)
      persons.value.push(res.data)
      return res
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
      persons.value = persons.value.filter(u => u.id !== personId)
    } catch (err) {
      error.value = 'Failed to delete person profile'
      throw err
    } finally {
      adding.value = false
    }
  }

  const updatePerson = async (personData) => {
    adding.value = true
    error.value = null

    try {
      const res = await api("people").patch('/person/', personData)
      const index = persons.value.findIndex(u => u.id === personData.id)

      if (index !== -1) {
        persons.value[index] = res.data
      }

      return res.data
    } catch (err) {
      error.value = 'Failed to update person profile'
      throw err
    } finally {
      adding.value = false
    }
  }

  return {
    persons,
    loading,
    adding,
    error,
    idtypes,
    fetchPersonByID,
    fetchPersons,
    fetchCurrentPersons,
    createPerson,
    deletePerson,
    updatePerson
  }
})
