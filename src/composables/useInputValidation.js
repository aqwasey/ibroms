/**
 * Reusable input validation composable
 * Provides validation functions for different input types
 */
export function useInputValidation() {
  
  /**
   * Validates and formats numeric input (integers and decimals)
   * @param {string} value - Input value
   * @param {Object} options - Validation options
   * @returns {string} - Cleaned numeric value
   */
  const validateNumber = (value, options = {}) => {
    const { 
      allowDecimals = true, 
      maxDecimals = 2, 
      min = null, 
      max = null,
      allowNegative = false 
    } = options
    
    if (!value) return ''
    
    // Remove all non-numeric characters except decimal point and minus
    let cleaned = value.toString().replace(/[^\d.-]/g, '')
    
    // Handle negative numbers
    if (!allowNegative) {
      cleaned = cleaned.replace(/-/g, '')
    } else {
      // Only allow minus at the beginning
      const minusCount = (cleaned.match(/-/g) || []).length
      if (minusCount > 1) {
        cleaned = cleaned.replace(/-/g, '')
        if (value.startsWith('-')) cleaned = '-' + cleaned
      }
    }
    
    // Handle decimals
    if (!allowDecimals) {
      cleaned = cleaned.replace(/\./g, '')
    } else {
      // Only allow one decimal point
      const parts = cleaned.split('.')
      if (parts.length > 2) {
        cleaned = parts[0] + '.' + parts.slice(1).join('')
      }
      
      // Limit decimal places
      if (parts.length === 2 && parts[1].length > maxDecimals) {
        cleaned = parts[0] + '.' + parts[1].substring(0, maxDecimals)
      }
    }
    
    // Apply min/max constraints
    const numValue = parseFloat(cleaned)
    if (!isNaN(numValue)) {
      if (min !== null && numValue < min) return min.toString()
      if (max !== null && numValue > max) return max.toString()
    }
    
    return cleaned
  }
  
  /**
   * Validates and formats phone number input
   * @param {string} value - Input value
   * @param {Object} options - Validation options
   * @returns {string} - Cleaned phone number
   */
  const validatePhone = (value, options = {}) => {
    const { 
      maxLength = 15,
      allowCountryCode = true,
      format = 'international' // 'international', 'local', 'none'
    } = options
    
    if (!value) return ''
    
    // Remove all non-numeric characters except + for country code
    let cleaned = value.toString().replace(/[^\d+]/g, '')
    
    // Handle country code
    if (!allowCountryCode) {
      cleaned = cleaned.replace(/\+/g, '')
    } else {
      // Only allow + at the beginning
      if (cleaned.includes('+') && !cleaned.startsWith('+')) {
        cleaned = cleaned.replace(/\+/g, '')
      }
      // Only allow one +
      const plusCount = (cleaned.match(/\+/g) || []).length
      if (plusCount > 1) {
        cleaned = '+' + cleaned.replace(/\+/g, '')
      }
    }
    
    // Limit length
    if (cleaned.length > maxLength) {
      cleaned = cleaned.substring(0, maxLength)
    }
    
    // Apply formatting
    if (format === 'local' && cleaned.length >= 10) {
      // Format as (XXX) XXX-XXXX
      const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})/)
      if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`
      }
    }
    
    return cleaned
  }
  
  /**
   * Validates email input
   * @param {string} value - Input value
   * @returns {Object} - { value, isValid }
   */
  const validateEmail = (value) => {
    if (!value) return { value: '', isValid: true }
    
    // Basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isValid = emailRegex.test(value)
    
    return {
      value: value.toLowerCase().trim(),
      isValid
    }
  }
  
  /**
   * Validates text input with various constraints
   * @param {string} value - Input value
   * @param {Object} options - Validation options
   * @returns {Object} - { value: cleaned text, isValid: boolean, errors: string[] }
   */
  const validateText = (value, options = {}) => {
    const {
      maxLength = null,
      minLength = null,
      allowNumbers = true,
      allowSpecialChars = true,
      capitalizeWords = false,
      trim = true
    } = options
    
    if (!value) {
      return {
        value: '',
        isValid: minLength ? false : true,
        errors: minLength ? [`Minimum length is ${minLength} characters`] : []
      }
    }
    
    let cleaned = value.toString()
    const errors = []
    
    // Trim if requested
    if (trim) {
      cleaned = cleaned.trim()
    }
    
    // Remove numbers if not allowed
    if (!allowNumbers) {
      cleaned = cleaned.replace(/\d/g, '')
    }
    
    // Remove special characters if not allowed
    if (!allowSpecialChars) {
      cleaned = cleaned.replace(/[^a-zA-Z0-9\s]/g, '')
    }
    
    // Capitalize words if requested
    if (capitalizeWords) {
      cleaned = cleaned.replace(/\b\w/g, l => l.toUpperCase())
    }
    
    // Apply length constraints
    if (maxLength && cleaned.length > maxLength) {
      cleaned = cleaned.substring(0, maxLength)
    }
    
    // Validate length constraints
    if (minLength && cleaned.length < minLength) {
      errors.push(`Minimum length is ${minLength} characters`)
    }
    
    if (maxLength && cleaned.length > maxLength) {
      errors.push(`Maximum length is ${maxLength} characters`)
    }
    
    return {
      value: cleaned,
      isValid: errors.length === 0,
      errors
    }
  }
  
  /**
   * Validates currency input
   * @param {string} value - Input value
   * @param {Object} options - Validation options
   * @returns {string} - Cleaned currency value
   */
  const validateCurrency = (value, options = {}) => {
    const { 
      maxDecimals = 2,
      min = 0,
      max = null,
      prefix = '',
      suffix = ''
    } = options
    
    // Use number validation for the core logic
    const cleaned = validateNumber(value, {
      allowDecimals: true,
      maxDecimals,
      min,
      max,
      allowNegative: false
    })
    
    if (!cleaned) return ''
    
    // Add prefix/suffix if value exists
    return prefix + cleaned + suffix
  }
  
  /**
   * Creates an input handler function for a specific validation type
   * @param {string} type - Validation type ('number', 'phone', 'email', 'text', 'currency')
   * @param {Object} options - Validation options
   * @returns {Function} - Input handler function
   */
  const createInputHandler = (type, options = {}) => {
    return (event) => {
      const value = event.target.value
      let validatedValue
      
      switch (type) {
        case 'number':
          validatedValue = validateNumber(value, options)
          break
        case 'phone':
          validatedValue = validatePhone(value, options)
          break
        case 'email': {
          const emailResult = validateEmail(value)
          validatedValue = emailResult.value
          break
        }
        case 'text': {
          const textResult = validateText(value, options)
          validatedValue = textResult.value
          break
        }
        case 'currency':
          validatedValue = validateCurrency(value, options)
          break
        default:
          validatedValue = value
      }
      
      // Update the input value if it changed
      if (event.target.value !== validatedValue) {
        event.target.value = validatedValue
        // Trigger input event to update v-model
        event.target.dispatchEvent(new Event('input', { bubbles: true }))
      }
      
      return validatedValue
    }
  }
  
  return {
    validateNumber,
    validatePhone,
    validateEmail,
    validateText,
    validateCurrency,
    createInputHandler
  }
}
