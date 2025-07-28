import axios from 'axios';

// Base API configuration
const api = axios.create({
  baseURL: 'https://business-api-service.onrender.com',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor for adding auth token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Response interceptor for handling errors
api.interceptors.response.use(
  response => {
    // Return just the data portion if successful
    return response.data;
  },
  error => {
    // Handle errors (can customize error handling here)
    if (error.response) {
      // Server returned an error response
      console.error('API Error:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('API Request Error:', error.request);
      return Promise.reject({ message: 'No response from server' });
    } else {
      // Something else happened while setting up the request
      console.error('API Setup Error:', error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

export default api;
