import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePolicyStore = defineStore('policy', () => {
  // State
  const policies = ref([
    {
      id: '1',
      otherNames: 'John',
      surname: 'Doe',
      gender: 'Male',
      dateOfBirth: '1985-07-15',
      idType: 'Passport',
      idNumber: 'AB123456'
    },
    {
      id: '2',
      otherNames: 'Jane',
      surname: 'Smith',
      gender: 'Female',
      dateOfBirth: '1990-03-22',
      idType: 'National ID',
      idNumber: 'ID78901234'
    },
    {
      id: '3',
      otherNames: 'Michael',
      surname: 'Johnson',
      gender: 'Male',
      dateOfBirth: '1978-11-08',
      idType: "Driver's License",
      idNumber: 'DL5678901'
    }
  ])
  
  const loading = ref(false)
  const error = ref(null)

  // Actions
  const fetchPolicies = async () => {
    // In a real app, this would make an API call
    // For demo purposes, we'll just return the local data
    loading.value = true
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      return Promise.resolve(policies.value)
    } catch (err) {
      error.value = err
      return Promise.reject(err)
    } finally {
      loading.value = false
    }
  }

  const fetchPolicyById = async (id) => {
    loading.value = true
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      const policy = policies.value.find(policy => policy.id === id)
      if (!policy) {
        throw new Error('Policy not found')
      }
      return Promise.resolve(policy)
    } catch (err) {
      error.value = err
      return Promise.reject(err)
    } finally {
      loading.value = false
    }
  }

  const createPolicy = async (policyData) => {
    loading.value = true
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      const newPolicy = {
        id: Date.now().toString(),
        ...policyData
      }
      policies.value.push(newPolicy)
      return Promise.resolve(newPolicy)
    } catch (err) {
      error.value = err
      return Promise.reject(err)
    } finally {
      loading.value = false
    }
  }

  const updatePolicy = async (id, policyData) => {
    loading.value = true
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      const index = policies.value.findIndex(policy => policy.id === id)
      if (index === -1) {
        throw new Error('Policy not found')
      }
      
      const updatedPolicy = {
        ...policies.value[index],
        ...policyData
      }
      policies.value[index] = updatedPolicy
      return Promise.resolve(updatedPolicy)
    } catch (err) {
      error.value = err
      return Promise.reject(err)
    } finally {
      loading.value = false
    }
  }

  const deletePolicy = async (id) => {
    loading.value = true
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      const index = policies.value.findIndex(policy => policy.id === id)
      if (index === -1) {
        throw new Error('Policy not found')
      }
      policies.value.splice(index, 1)
      return Promise.resolve({ id })
    } catch (err) {
      error.value = err
      return Promise.reject(err)
    } finally {
      loading.value = false
    }
  }

  return {
    policies,
    loading,
    error,
    fetchPolicies,
    fetchPolicyById,
    createPolicy,
    updatePolicy,
    deletePolicy
  }
})
