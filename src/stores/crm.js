import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCrmStore = defineStore('crm', () => {
  // State
  const crmList = ref([
    {
      id: '1',
      otherNames: 'Reddington',
      surname: 'Raymond',
      gender: 'Male',
      dateOfBirth: '1990-05-12',
      idType: 'Passport',
      idNumber: '4949203239'
    },
    {
      id: '2',
      otherNames: 'Elizabeth',
      surname: 'Keen',
      gender: 'Female',
      dateOfBirth: '1985-10-25',
      idType: 'National ID',
      idNumber: '5678901234'
    },
    {
      id: '3',
      otherNames: 'Donald',
      surname: 'Ressler',
      gender: 'Male',
      dateOfBirth: '1978-09-18',
      idType: 'Driver\'s License',
      idNumber: '9876543210'
    }
  ])

  // Actions
  const fetchCrmList = async () => {
    // In a real app, this would make an API call
    // For demo purposes, we'll just return the local data
    return Promise.resolve(crmList.value)
  }

  const getCrmById = (id) => {
    return crmList.value.find(crm => crm.id === id)
  }

  const createCrm = async (crmData) => {
    // In a real app, this would make an API call
    // For demo, we'll just add to the local array
    crmList.value.push(crmData)
    return Promise.resolve(crmData)
  }

  const updateCrm = async (crmData) => {
    // In a real app, this would make an API call
    // For demo, we'll update the local array
    const index = crmList.value.findIndex(crm => crm.id === crmData.id)
    if (index !== -1) {
      crmList.value[index] = { ...crmList.value[index], ...crmData }
    }
    return Promise.resolve(crmData)
  }

  const deleteCrm = async (id) => {
    // In a real app, this would make an API call
    // For demo, we'll remove from the local array
    const index = crmList.value.findIndex(crm => crm.id === id)
    if (index !== -1) {
      crmList.value.splice(index, 1)
    }
    return Promise.resolve({ id })
  }

  return {
    crmList,
    fetchCrmList,
    getCrmById,
    createCrm,
    updateCrm,
    deleteCrm
  }
})
