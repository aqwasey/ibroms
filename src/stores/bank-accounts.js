import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createCrudService } from '@/services/crudService'

export const useBankAccountsStore = defineStore('bankAccounts', () => {
  const bankAccountService = createCrudService('/bank-accounts')

  const bankAccounts = ref([])
  const loading = ref(false)
  const saving = ref(false)
  const error = ref(null)

  const fetchAllBankAccounts = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await bankAccountService.getAll()
      bankAccounts.value = response.data || []
    } catch (err) {
      error.value = err.message || 'Failed to load bank accounts'
      console.error('Fetch error:', err)
      bankAccounts.value = []
    } finally {
      loading.value = false
    }
  }

  const fetchBankAccounts = async () => {
    loading.value = true
    error.value = null
    try {
      const companyId = JSON.parse(localStorage.getItem('user'))?.company_id || ''
      if (!companyId) {
        error.value = 'Company ID not found'
        return
      }

      const response = await bankAccountService.custom('get', `/company/${companyId}`)
      bankAccounts.value = response.data || []
    } catch (err) {
      error.value = err.message || 'Failed to load bank accounts'
      console.error('Fetch error:', err)
      bankAccounts.value = []
    } finally {
      loading.value = false
    }
  }

  const createBankAccount = async (bankData) => {
    saving.value = true
    error.value = null

    try {
      if (!bankData.company_id) {
        const user = JSON.parse(localStorage.getItem('user'))
        if (user?.company_id) {
          bankData.company_id = user.company_id
        }
      }

      const response = await bankAccountService.create(bankData)
      // Handle API response structure - extract the actual account data
      const newBankAccount = response.data || response
      console.log('Created bank account response:', response)
      console.log('New bank account data:', newBankAccount)
      
      // Add to the beginning of the array so it appears at the top
      bankAccounts.value.unshift(newBankAccount)
      return newBankAccount
    } catch (err) {
      error.value = err
      console.error('[createBankAccount]', err.message)
      throw err
    } finally {
      saving.value = false
    }
  }

  const deleteBankAccount = async (accountId) => {
    saving.value = true
    error.value = null

    try {
      await bankAccountService.delete(accountId)
      bankAccounts.value = bankAccounts.value.filter(a => a.id !== accountId)
    } catch (err) {
      error.value = err
      console.error('[deleteBankAccount]', err.message)
      throw err
    } finally {
      saving.value = false
    }
  }

  const updateBankAccount = async (accountId, bankAccountData) => {
    saving.value = true
    error.value = null

    try {
      if (!bankAccountData.company_id) {
        const user = JSON.parse(localStorage.getItem('user'))
        if (user?.company_id) {
          bankAccountData.company_id = user.company_id
        }
      }

      const currentAccount = bankAccounts.value.find(a => a.id === accountId)
      if (!currentAccount) {
        throw new Error('Account not found')
      }

      const updatePayload = {
        bank_name: bankAccountData.bank_name,
        account_no: bankAccountData.account_no,
        account_type: bankAccountData.account_type,
        email: bankAccountData.email,
        purpose: bankAccountData.purpose,
        reference: bankAccountData.reference || '',
        id: accountId, // Required by API
        assigned: currentAccount.assigned || 'UNASSIGNED' // Required by API
      }

      console.log('Sending update payload:', updatePayload)
      const updated = await bankAccountService.patch(accountId, updatePayload)
      console.log('Update response:', updated)

      const updatedAccount = updated.data || updated
      const index = bankAccounts.value.findIndex(a => a.id === accountId)
      if (index !== -1) {
        bankAccounts.value[index] = updatedAccount
      }
      return updatedAccount
    } catch (err) {
      error.value = err
      console.error('[updateBankAccount]', err.message)
      throw err
    } finally {
      saving.value = false
    }
  }

  return {
    bankAccounts,
    loading,
    saving,
    error,
    fetchAllBankAccounts,
    fetchBankAccounts,
    createBankAccount,
    deleteBankAccount,
    updateBankAccount
  }
})
