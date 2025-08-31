import axios from 'axios';
import authService from './authService';

// People API configuration using separate service URL
const peopleApi = axios.create({
  baseURL: import.meta.env.OTHER_SERVICE_URL || 'https://people-api-service.onrender.com',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Flag to prevent multiple refreshes at once
let isRefreshing = false;
let failedQueue = [];

// Process failed requests queue
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor for adding auth token
peopleApi.interceptors.request.use(async config => {
  // For all routes, ensure we have a valid token
  const token = localStorage.getItem('token');
  
  // If token exists, check if it's expired
  if (token && authService.isTokenExpired()) {
    console.log('Token expired, attempting to refresh...');
    
    // Don't try to refresh if already in progress
    if (!isRefreshing) {
      isRefreshing = true;
      
      try {
        // Try to refresh the token
        const success = await authService.refreshToken();
        
        if (success) {
          // If refresh succeeded, update the token
          const newToken = localStorage.getItem('token');
          config.headers.Authorization = `Bearer ${newToken}`;
          processQueue(null, newToken);
        } else {
          // If refresh failed, redirect to login
          console.error('Token refresh failed, logging out');
          authService.logout();
          processQueue(new Error('Token refresh failed'));
          window.location.href = '/login';
        }
      } catch (error) {
        processQueue(error);
      } finally {
        isRefreshing = false;
      }
    }
  }
  
  // Set the current token (original or refreshed)
  const currentToken = localStorage.getItem('token');
  if (currentToken) {
    config.headers.Authorization = `Bearer ${currentToken}`;
  }
  
  return config;
}, error => {
  return Promise.reject(error);
});

// Response interceptor for handling errors
peopleApi.interceptors.response.use(
  response => {
    // Return just the data portion if successful
    return response.data;
  },
  async error => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors specifically
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Wait for the refresh to complete
        try {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
          .then(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
      
      // Mark this request as retried to prevent infinite loops
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        // Try to refresh the token
        const refreshed = await authService.refreshToken();
        
        if (refreshed) {
          // If refresh succeeded, retry the original request
          const token = localStorage.getItem('token');
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          
          processQueue(null, token);
          return axios(originalRequest);
        } else {
          // If refresh failed, redirect to login
          authService.logout();
          processQueue(new Error('Token refresh failed'));
          window.location.href = '/login';
          return Promise.reject({ message: 'Authentication session expired' });
        }
      } catch (refreshError) {
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // Handle other errors
    if (error.response) {
      // Server returned an error response
      console.error('People API Error:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('People API Request Error:', error.request);
      return Promise.reject({ message: 'No response from server' });
    } else {
      // Something else happened while setting up the request
      console.error('People API Setup Error:', error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

// People API Methods
export const peopleApiService = {
  // CREATE Operations
  
  // Add basic person
  async addPerson(personData) {
    return await peopleApi.post('/person/', personData);
  },

  // Add person with contact
  async addPersonWithContact(personData, contactData) {
    return await peopleApi.post('/person/with-contact', {
      person: personData,
      contact: contactData
    });
  },

  // Add person with documents
  async addPersonWithDocs(personData, docsData) {
    return await peopleApi.post('/person/with-docs', {
      person: personData,
      docs: docsData
    });
  },

  // Add person with full details
  async addPersonFull(personData, contactData, documentsData) {
    return await peopleApi.post('/person/full', {
      person: personData,
      contact: contactData,
      documents: documentsData
    });
  },

  // READ Operations
  
  // Get person by ID or ID number
  async getPerson(param, value) {
    // param should be 'id' or 'idno'
    return await peopleApi.get(`/person/by/${param}/${value}`);
  },

  // Get person full profile by ID number (direct endpoint)
  async getPersonFull(idno) {
    return await peopleApi.get(`/person/${idno}`);
  },

  // Get person by ID number (simplified for search)
  async getPersonByIdno(idno) {
    return await peopleApi.get(`/person/${idno}`);
  },


  // UPDATE Operations
  
  // Update person
  async updatePerson(personData) {
    return await peopleApi.patch('/person/', personData);
  },

  // DELETE Operations
  
  // Delete person by ID
  async deletePerson(personId) {
    return await peopleApi.delete(`/person/${personId}`);
  },

  // UTILITY Methods for common operations
  
  // Search people by name with limit
  async searchByName(name, limit = 50) {
    return await peopleApi.get(`/person/search/by-name/${encodeURIComponent(name)}/limit/${limit}`);
  },

  // Search people by contact
  async searchByContact(item, value) {
    return await peopleApi.get(`/person/search/by-contact/${encodeURIComponent(item)}/${encodeURIComponent(value)}`);
  },

  // Get people by period
  async getByPeriod(period) {
    return await peopleApi.get(`/person/search/by-period/${period}`);
  },

  // Get all people (using period search as fallback)
  async getAllPeople() {
    try {
      // Use 'all' period to get all people
      return await this.getByPeriod('all');
    } catch (error) {
      console.error('Error fetching all people:', error);
      return { data: [] };
    }
  },

  // Search people by various criteria
  searchPeople: async (query, searchType = 'name') => {
    try {
      let endpoint;
      
      switch (searchType) {
        case 'idno':
          endpoint = `/person/${query}`;
          break;
        case 'email':
          endpoint = `/person/search/by-email/${query}`;
          break;
        case 'mobile':
          endpoint = `/person/search/by-mobile/${query}`;
          break;
        case 'whatsapp':
          endpoint = `/person/search/by-whatsapp/${query}`;
          break;
        case 'phone':
          endpoint = `/person/search/by-phone/${query}`;
          break;
        case 'landline':
          endpoint = `/person/search/by-landline/${query}`;
          break;
        default:
          break;
      }

      const response = await peopleApi.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error searching people:', error);
      throw error;
    }
  },

  // Create a new policy
  async createPolicy(policyData) {
    try {
      const response = await peopleApi.post('/policy/', policyData);
      console.log('Raw API Response:', response);
      console.log('Response Data:', response.data);
      console.log('Response Status:', response.status);
      
      // The API returns the response directly, not wrapped in axios response
      // Based on console: response = {message: 'Policy created successful', status: 1}
      if (response && (response.status === 1 || response.message)) {
        return response;
      }
      
      return response.data || response;
    } catch (error) {
      console.error('Error creating policy:', error);
      console.log('Error Response:', error.response);
      
      // Check if it's actually a success response in error
      if (error.response && error.response.data) {
        return error.response.data;
      }
      
      throw error;
    }
  },

  // Get policies created this week
  async getPoliciesThisWeek() {
    try {
      const response = await peopleApi.get('/policy/created/this-week');
      console.log('Policies API Response:', response);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching policies:', error);
      throw error;
    }
  }
};

export default peopleApi;
