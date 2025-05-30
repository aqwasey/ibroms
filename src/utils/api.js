// api.js
import axios from 'axios';

class Api {
  static _instances = {};

  constructor(baseURL) {
    if (Api._instances[baseURL]) {
      return Api._instances[baseURL];
    }

    this.http = axios.create({
      baseURL,
      timeout: 10000,
    });

    this.http.interceptors.request.use(this.attachAuthToken);
    this.http.interceptors.response.use(
      (response) => response,
      this.handleError
    );

    Api._instances[baseURL] = this;
  }

  // Request methods that return only response.data
  get(url, config) {
    return this.http.get(url, config).then(this.unwrap);
  }

  post(url, data, config) {
    return this.http.post(url, data, config).then(this.unwrap);
  }

  put(url, data, config) {
    return this.http.put(url, data, config).then(this.unwrap);
  }

  patch(url, data, config) {
    return this.http.patch(url, data, config).then(this.unwrap);
  }

  delete(url, config) {
    return this.http.delete(url, config).then(this.unwrap);
  }

  // Private helpers
  unwrap(response) {
    return response.data;
  }

  attachAuthToken(config) {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  }

  handleError(error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.warn('[Api] 401 Unauthorized');
    }
    return Promise.reject(error);
  }
}

// Factory method to get instance based on name
const api = (service = 'business') => {
  const baseUrls = {
    business: import.meta.env.VITE_BUSINESS_BASE_API,
    people: import.meta.env.VITE_PEOPLE_BASE_API,
    // Add more services here
  };

  const baseURL = baseUrls[service];
  if (!baseURL) {
    throw new Error(`[Api] Unknown service: ${service}`);
  }

  return new Api(baseURL);
};

export default api;
