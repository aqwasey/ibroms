import axios from 'axios';
import authService from './authService';

// Duty API configuration using OTHER_SERVICE_URL
const dutyApi = axios.create({
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
dutyApi.interceptors.request.use(async config => {
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
dutyApi.interceptors.response.use(
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
      console.error('Duty API Error:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Duty API Request Error:', error.request);
      return Promise.reject({ message: 'No response from server' });
    } else {
      // Something else happened while setting up the request
      console.error('Duty API Setup Error:', error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

// Duty API Methods
export const dutyApiService = {
  // CREATE Operations
  
  // Add new duty
  async addDuty(dutyData) {
    return await dutyApi.post('/duty/', dutyData);
  },

  // READ Operations
  
  // Get all duties
  async getAllDuties() {
    return await dutyApi.get('/duty/');
  },

  // Get duty by ID
  async getDutyById(dutyId) {
    return await dutyApi.get(`/duty/id/${dutyId}`);
  },

  // Get all duty titles
  async getDutyTitles() {
    return await dutyApi.get('/duty/title/');
  },

  // UPDATE Operations
  
  // Update duty
  async updateDuty(dutyId, dutyData) {
    return await dutyApi.patch(`/duty/${dutyId}`, dutyData);
  },

  // DELETE Operations
  
  // Delete duty by ID
  async deleteDuty(dutyId) {
    return await dutyApi.delete(`/duty/${dutyId}`);
  }
};

export default dutyApi;
