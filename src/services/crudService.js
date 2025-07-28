import api from './api';

/**
 * Generic CRUD service for handling common data operations
 * @param {string} endpoint - The base API endpoint for the resource
 */
export const createCrudService = (endpoint) => {
  return {
    /**
     * Get a list of items
     * @param {object} params - Optional query parameters
     * @returns {Promise<object>} Response with list of items
     */
    async getAll(params = {}) {
      return await api.get(endpoint, { params });
    },

    /**
     * Get a single item by ID
     * @param {string} id - Item ID
     * @returns {Promise<object>} Response with item details
     */
    async getById(id) {
      return await api.get(`${endpoint}/${id}`);
    },

    /**
     * Create a new item
     * @param {object} data - Item data
     * @returns {Promise<object>} Response with created item
     */
    async create(data) {
      return await api.post(endpoint, data);
    },

    /**
     * Update an existing item
     * @param {string} id - Item ID
     * @param {object} data - Updated item data
     * @returns {Promise<object>} Response with updated item
     */
    async update(id, data) {
      return await api.put(`${endpoint}/${id}`, data);
    },

    /**
     * Patch an existing item (partial update)
     * @param {string} id - Item ID
     * @param {object} data - Partial item data
     * @returns {Promise<object>} Response with updated item
     */
    async patch(id, data) {
      return await api.patch(`${endpoint}/${id}`, data);
    },

    /**
     * Delete an item
     * @param {string} id - Item ID
     * @returns {Promise<object>} Response with deletion status
     */
    async delete(id) {
      return await api.delete(`${endpoint}/${id}`);
    },

    /**
     * Custom API call for non-standard operations
     * @param {string} method - HTTP method (get, post, put, delete)
     * @param {string} url - URL path to append to endpoint
     * @param {object} data - Request data (for POST, PUT, PATCH)
     * @param {object} params - Query parameters (for GET)
     * @returns {Promise<object>} API response
     */
    async custom(method, url, data = null, params = null) {
      const config = {};
      if (params) {
        config.params = params;
      }
      
      return await api[method.toLowerCase()](`${endpoint}${url}`, data, config);
    }
  };
};

export default createCrudService;
