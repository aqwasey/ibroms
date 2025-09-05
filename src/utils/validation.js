/**
 * Utility functions for input validation and sanitization
 */

/**
 * Validates an email address format
 * @param {string} email - Email to validate
 * @returns {boolean} True if email format is valid
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Validates if a South African phone number is valid
 * @param {string} phone - Phone number to validate (without country code)
 * @returns {boolean} True if phone format is valid
 */
export const isValidSAPhoneNumber = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  
  // South African mobile numbers are typically 10 digits
  // Remove any spaces or special characters for validation
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Check if it's 10 digits and starts with 0
  if (cleanPhone.length === 10 && cleanPhone.startsWith('0')) {
    return true;
  }
  
  // If it's 9 digits, it might be missing the leading 0
  if (cleanPhone.length === 9 && !cleanPhone.startsWith('0')) {
    return true;
  }
  
  return false;
};

/**
 * Sanitizes input to prevent XSS attacks
 * @param {string} input - String to sanitize
 * @returns {string} Sanitized string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  // Basic sanitization - escaping HTML special chars
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Validates if all required fields in an object have values
 * @param {object} data - Object with field values
 * @param {array} requiredFields - Array of required field names
 * @returns {object} { isValid: boolean, missingFields: string[] }
 */
export const validateRequiredFields = (data, requiredFields) => {
  if (!data || typeof data !== 'object') {
    return { isValid: false, missingFields: requiredFields };
  }

  const missingFields = requiredFields.filter(field => {
    const value = data[field];
    if (value === undefined || value === null) return true;
    if (typeof value === 'string' && value.trim() === '') return true;
    return false;
  });

  return {
    isValid: missingFields.length === 0,
    missingFields
  };
};

/**
 * Checks if a password meets minimum security requirements
 * @param {string} password - Password to validate
 * @param {object} options - Options for validation
 * @param {number} options.minLength - Minimum length (default: 6)
 * @param {boolean} options.requireNumbers - Require at least one number (default: false)
 * @param {boolean} options.requireSpecialChars - Require at least one special character (default: false)
 * @returns {object} { isValid: boolean, errors: string[] }
 */
export const validatePassword = (password, options = {}) => {
  const errors = [];
  const minLength = options.minLength || 6;

  if (typeof password !== 'string') {
    return { isValid: false, errors: ['Invalid password type'] };
  }

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }

  if (options.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (options.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates account number format and requirements
 * @param {string} accountNumber - Account number to validate
 * @param {object} options - Validation options
 * @param {number} options.minLength - Minimum length (default: 8)
 * @param {number} options.maxLength - Maximum length (default: 20)
 * @returns {object} { isValid: boolean, errors: string[] }
 */
export const validateAccountNumber = (accountNumber, options = {}) => {
  const errors = [];
  const minLength = options.minLength || 8;
  const maxLength = options.maxLength || 20;

  if (!accountNumber || typeof accountNumber !== 'string') {
    return { isValid: false, errors: ['Account number is required'] };
  }

  // Remove any spaces or special characters for validation
  const cleanAccountNo = accountNumber.replace(/\D/g, '');

  if (cleanAccountNo.length === 0) {
    errors.push('Account number is required');
  } else {
    // Check if it contains only numbers
    if (!/^\d+$/.test(cleanAccountNo)) {
      errors.push('Account number must contain only numbers');
    }

    // Check minimum length
    if (cleanAccountNo.length < minLength) {
      errors.push(`Account number must be at least ${minLength} digits`);
    }

    // Check maximum length
    if (cleanAccountNo.length > maxLength) {
      errors.push(`Account number cannot exceed ${maxLength} digits`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
