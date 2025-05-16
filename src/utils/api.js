// • Singleton pattern → one configured Axios instance everywhere
// • Automatic baseURL & timeout (override via env variable)
// • Request interceptor injects JWT from localStorage (customize as needed)
// • Response interceptor hooks for global error handling / refresh-token logic
// • Helper methods return the response data directly (less boilerplate)
// ------------------------------------------------------------

import axios from 'axios';

class Api {
  static _instance;

  constructor() {
    if (Api._instance) {
      return Api._instance;
    }

    const baseURL = import.meta.env.VITE_BUSINESS_BASE_API;

    this.http = axios.create({
      baseURL,
      timeout: 10000,
    });

    this.http.interceptors.request.use(this.attachAuthToken);
    this.http.interceptors.response.use(
      (response) => response,
      this.handleError
    );

    Api._instance = this;
  }

  // ---------------------------------------------
  // Public request helpers → always return data
  // ---------------------------------------------
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

  // ---------------------------------------------
  // Private helpers
  // ---------------------------------------------
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

export default new Api();
