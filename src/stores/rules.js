import { defineStore } from 'pinia'
import axios from 'axios'

export const useRulesStore = defineStore('rules', {
  state: () => ({
    rules: [],
    currentRule: null,
    loading: false,
    error: null,
  }),

  actions: {
    async createRule(payload) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.post('/rules', payload)
        return response.data
      } catch (err) {
        this.error = err.response?.data?.detail || err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchRuleById(ruleId) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`/rules/${ruleId}`)
        this.currentRule = response.data
        return response.data
      } catch (err) {
        this.error = err.response?.data?.detail || err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchRulesByCompanyId(companyId) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`/rules/company/${companyId}`)
        this.rules = response.data
        return response.data
      } catch (err) {
        this.error = err.response?.data?.detail || err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteRuleById(ruleId) {
      this.loading = true
      this.error = null
      try {
        await axios.delete(`/rules/${ruleId}`)
        this.rules = this.rules.filter(rule => rule.id !== ruleId)
      } catch (err) {
        this.error = err.response?.data?.detail || err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateRuleById(ruleId, payload) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.patch(`/rules/${ruleId}`, payload)
        this.currentRule = response.data
        return response.data
      } catch (err) {
        this.error = err.response?.data?.detail || err.message
        throw err
      } finally {
        this.loading = false
      }
    }
  }
})
