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
    if (!token) return false;
    
    // Check if token is expired
    const tokenData = this.parseJwt(token);
    if (!tokenData) return false;
    
    // Check expiration (exp is in seconds since epoch)
    const currentTime = Math.floor(Date.now() / 1000);
    return tokenData.exp > currentTime;
  },
  
  /**
   * Get current user information
   * @returns {object|null} User info or null if not logged in
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  /**
   * Check if the current token is expired
   * @returns {boolean} True if token is expired or invalid
   */
  isTokenExpired() {
    const token = localStorage.getItem('token');
    if (!token) return true;
    
    const tokenData = this.parseJwt(token);
    if (!tokenData || !tokenData.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return tokenData.exp <= currentTime;
  },
  
  /**
   * Attempt to refresh the access token
   * @returns {Promise<boolean>} True if refresh was successful
   */
  async refreshToken() {
    try {
      // Get the current token for the refresh request
      const currentToken = localStorage.getItem('token');
      if (!currentToken) return false;
      
      // Call the refresh endpoint
      const response = await api.post('/auth/refresh', { token: currentToken });
      
      // Store the new token if successful
      if (response && response.data) {
        localStorage.setItem('token', response.data);
        
        // Update user info from new token
        const tokenPayload = this.parseJwt(response.data);
        if (tokenPayload) {
          localStorage.setItem('user', JSON.stringify({
            email: tokenPayload.email,
            company_id: tokenPayload.company_id,
            bin: tokenPayload.bin,
            last_login: tokenPayload.last_login
          }));
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  },
  
  /**
   * Check token and refresh if needed
   * @returns {Promise<boolean>} True if valid token is available (either existing or refreshed)
   */
  async ensureValidToken() {
    // If token is not expired, we're good
    if (!this.isTokenExpired()) {
      return true;
    }
    
    // Try to refresh token
    const refreshed = await this.refreshToken();
    if (refreshed) {
      return true;
    }
    
    // If refresh failed, log user out
    this.logout();
    return false;
  }
};

/**
 * Parse JWT token to extract payload
 * @param {string} token - JWT token
 * @returns {object|null} Decoded token payload or null if invalid
 */
// Export parseJwt for use within the authService object
export function parseJwt(token) {
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

// Add parseJwt to authService for internal use
authService.parseJwt = parseJwt;

export default authService;
