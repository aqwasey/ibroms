import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api.js'

export const useBankAccountsStore = defineStore('bankAccounts', () => {
  const bankAccounts = ref([])
  const loading = ref(false)
  const adding = ref(false)
  const error = ref(null)

  const fetchBankAccounts = async () => {
    loading.value = true
    error.value = null
    // b45cffe0-84dd-3d20-d928-bee85e7b0f21
    try {
      const res = await api.get('/bank-accounts/b45cffe0-84dd-3d20-d928-bee85e7b0f21')
      bankAccounts.value = res.info
    } catch (err) {
      error.value = 'Failed to load bankAccounts'
    } finally {
      loading.value = false
    }
  }

  const createBankAccount = async (bankAccountData) => {
    adding.value = true
    error.value = null

    try {
      const res = await api.post('/bank-accounts/', bankAccountData)
      bankAccounts.value.push(res.data)
      return res.data
    } catch (err) {
      error.value = 'Failed to create bank account'
      throw err
    } finally {
      adding.value = false
    }
  }

  const deleteBankAccount = async (bankAccountId) => {
    adding.value = true
    error.value = null

    try {
      await api.delete(`/bank-accounts/${bankAccountId}`)
      bankAccounts.value = bankAccounts.value.filter(u => u.id !== bankAccountId)
    } catch (err) {
      error.value = 'Failed to delete bankAccount'
      throw err
    } finally {
      adding.value = false
    }
  }

  const updateBankAccount = async (bankAccountId, bankAccountData) => {
    adding.value = true
    error.value = null

    try {
      const res = await api.patch(`/bank-accounts/${bankAccountId}`, bankAccountData)
      const index = bankAccounts.value.findIndex(u => u.id === bankAccountId)
      if (index !== -1) {
        bankAccounts.value[index] = res.data
      }
      return res.data
    } catch (err) {
      error.value = 'Failed to update bank account'
      throw err
    } finally {
      adding.value = false
    }
  }

  return {
    bankAccounts,
    loading,
    adding,
    error,
    fetchBankAccounts,
    createBankAccount,
    deleteBankAccount,
    updateBankAccount
  }
})
