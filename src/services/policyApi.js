import axios from 'axios';
import { API_BASE_URL } from '@/constants/api';
import authService from './authService';

const policyApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

let isRefreshing = false;
let failedQueue = [];

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

policyApi.interceptors.request.use(async config => {
  const token = localStorage.getItem('token');

  if (token && authService.isTokenExpired()) {
    console.log('Token expired, attempting to refresh...');

    if (!isRefreshing) {
      isRefreshing = true;

      try {
        const success = await authService.refreshToken();

        if (success) {
          const newToken = localStorage.getItem('token');
          config.headers.Authorization = `Bearer ${newToken}`;
          processQueue(null, newToken);
        } else {
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

  const currentToken = localStorage.getItem('token');
  if (currentToken) {
    config.headers.Authorization = `Bearer ${currentToken}`;
  }

  return config;
}, error => {
  return Promise.reject(error);
});

// Response interceptor for handling errors
policyApi.interceptors.response.use(
  response => {
    return response.data;
  },
  async error => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
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

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshed = await authService.refreshToken();

        if (refreshed) {
          const token = localStorage.getItem('token');
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          originalRequest.headers['Authorization'] = `Bearer ${token}`;

          processQueue(null, token);
          return axios(originalRequest);
        } else {
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

    if (error.response) {
      console.error('Policy API Error:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      console.error('Policy API Request Error:', error.request);
      return Promise.reject({ message: 'No response from server' });
    } else {
      console.error('Policy API Setup Error:', error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

// Policy API Methods
export const policyApiService = {
  // CREATE Operations

  // Create new policy
  async createPolicy(policyData) {
    return await policyApi.post('/policy/', policyData);
  },

  // READ Operations

  // Get policy by ID
  async getPolicy(policyId) {
    return await policyApi.get(`/policy/${policyId}`);
  },

  // Get all policies
  async getAllPolicies() {
    return await policyApi.get('/policy/');
  },

  // UPDATE Operations

  // Update policy
  async updatePolicy(policyData) {
    return await policyApi.patch('/policy/', policyData);
  },

  // DELETE Operations

  // Delete policy by ID
  async deletePolicy(policyId) {
    return await policyApi.delete(`/policy/${policyId}`);
  }
};

export default policyApi;
