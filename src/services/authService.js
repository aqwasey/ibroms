import api from './api';

/**
 * Authentication service for handling login, registration, and other auth-related operations
 */
export const authService = {
  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<object>} Response with JWT token and user info
   */
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      // Store the JWT token for future authenticated requests
      if (response.data && response.status === 1) {
        localStorage.setItem('token', response.data);
        
        // Parse the JWT to extract user info (company_id, email, bin)
        const tokenPayload = parseJwt(response.data);
        if (tokenPayload) {
          localStorage.setItem('user', JSON.stringify({
            email: tokenPayload.email,
            company_id: tokenPayload.company_id,
            bin: tokenPayload.bin,
            last_login: tokenPayload.last_login
          }));
        }
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Register a new business account
   * @param {object} businessData - Business registration data
   * @returns {Promise<object>} Response with registration status
   */
  async register(businessData) {
    return await api.post('/auth/register', businessData);
  },
  
  /**
   * Reset password with email
   * @param {string} email - User email
   * @returns {Promise<object>} Response with reset password status
   */
  async forgotPassword(email) {
    return await api.post('/auth/forgot-password', { email });
  },
  
  /**
   * Verify user's email with OTP code
   * @param {string} email - User email
   * @param {string} otp - OTP verification code
   * @returns {Promise<object>} Response with verification status
   */
  async verifyEmail(email, otp) {
    return await api.post('/auth/verify-email', { email, otp });
  },
  
  /**
   * Logout the current user
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Additional logout logic can be added here
  },
  
  /**
   * Check if user is logged in
   * @returns {boolean} True if user is logged in
   */
  isLoggedIn() {
    const token = localStorage.getItem('token');
    return !!token;
  },
  
  /**
   * Get current user information
   * @returns {object|null} User info or null if not logged in
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

/**
 * Parse JWT token to extract payload
 * @param {string} token - JWT token
 * @returns {object|null} Decoded token payload or null if invalid
 */
function parseJwt(token) {
  try {
    // Split the token and get the payload part
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error parsing JWT token:', e);
    return null;
  }
}

export default authService;
