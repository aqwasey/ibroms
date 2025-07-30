import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createCrudService } from '@/services/crudService'

export const useBankAccountsStore = defineStore('bankAccounts', () => {
  // Create CRUD service for bank-accounts endpoint
  const bankAccountService = createCrudService('/bank-accounts')
  
  const bankAccounts = ref([])
  const loading = ref(false)
  const saving = ref(false) // renamed from 'adding' for consistency
  const error = ref(null)

  const fetchAllBankAccounts = async () => {
    loading.value = true
    error.value = null
    try {
      // Get all bank accounts without filtering by company
      const response = await bankAccountService.getAll()
      // API returns { data: [...accounts], info: string, status: number }
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
      // Get the company ID from local storage (where the user info is stored)
      const companyId = JSON.parse(localStorage.getItem('user'))?.company_id || ''
      if (!companyId) {
        error.value = 'Company ID not found'
        return
      }
      
      // Use the /company/{id} endpoint to get accounts for this company
      const response = await bankAccountService.custom('get', `/company/${companyId}`)
      // API returns { data: [...accounts], info: string, status: number }
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
      // Ensure company_id is set if not provided in bankData
      if (!bankData.company_id) {
        const user = JSON.parse(localStorage.getItem('user'))
        if (user?.company_id) {
          bankData.company_id = user.company_id
        }
      }
      
      const newBankAccount = await bankAccountService.create(bankData)
      bankAccounts.value.push(newBankAccount)
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
      // Ensure company_id is set if not provided in bankAccountData
      if (!bankAccountData.company_id) {
        const user = JSON.parse(localStorage.getItem('user'))
        if (user?.company_id) {
          bankAccountData.company_id = user.company_id
        }
      }

      // First get the current account to ensure we have all required fields
      const currentAccount = bankAccounts.value.find(a => a.id === accountId)
      if (!currentAccount) {
        throw new Error('Account not found')
      }

      // Create payload with only updatable fields from the form
      // The API only accepts PATCH with specific fields
      const updatePayload = {
        bank_name: bankAccountData.bank_name,
        account_no: bankAccountData.account_no,
        account_type: bankAccountData.account_type,
        email: bankAccountData.email,
        purpose: bankAccountData.purpose,
        reference: bankAccountData.reference || '',
        company_id: bankAccountData.company_id
      }
      
      console.log('Sending update payload:', updatePayload)
      // Use patch for partial updates
      const updated = await bankAccountService.patch(accountId, updatePayload)
      console.log('Update response:', updated)
      
      // Update the item in the local state
      // API returns { data: updatedItem, info: string, status: number }
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
    saving, // renamed from 'adding' for consistency
    error,
    fetchAllBankAccounts,
    fetchBankAccounts,
    createBankAccount,
    deleteBankAccount,
    updateBankAccount
  }
})
