import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api.js'

export const useProductsStore = defineStore('products', () => {
  const products = ref([])
  const loading = ref(false)
  const adding = ref(false)
  const error = ref(null)

  const fetchProducts = async () => {
    loading.value = true
    error.value = null

    try {
      const res = await api().get('/products/')
      products.value = res.info
    } catch (err) {
      error.value = 'Failed to load products'
    } finally {
      loading.value = false
    }
  }

  const createProduct = async (productData) => {
    adding.value = true
    error.value = null

    try {
      const res = await api().post('/products/', productData)
      products.value.push(res.data)
      return res.data
    } catch (err) {
      error.value = 'Failed to create product'
      throw err
    } finally {
      adding.value = false
    }
  }

  const deleteProduct = async (productId) => {
    adding.value = true
    error.value = null

    try {
      await api().delete(`/products/${productId}`)
      products.value = products.value.filter(u => u.id !== productId)
    } catch (err) {
      error.value = 'Failed to delete product'
      throw err
    } finally {
      adding.value = false
    }
  }

  const updateProduct = async (productId, productData) => {
    adding.value = true
    error.value = null

    try {
      const res = await api().patch(`/products/${productId}`, productData)
      const index = products.value.findIndex(u => u.id === productId)
      if (index !== -1) {
        products.value[index] = res.data
      }
      return res.data
    } catch (err) {
      error.value = 'Failed to update product'
      throw err
    } finally {
      adding.value = false
    }
  }

  return {
    products,
    loading,
    adding,
    error,
    fetchProducts,
    createProduct,
    deleteProduct,
    updateProduct
  }
})
