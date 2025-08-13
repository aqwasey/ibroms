export const APP = {
  NAME: 'Pito iBROMS',
  TAGLINE: 'Insurance Broker Management System',
  COPYRIGHT: '© 2025 Pito Insurance. All rights reserved.',
  VERSION: '1.0.0'
}

export const NAVIGATION = {
  BUSINESS: {
    LABEL: 'Business',
    PROFILE: 'Profile',
    ACCOUNTS: 'Accounts',
    PERSONNEL: 'Personnel',
    USER_ACCOUNTS: 'User Accounts'
  },
  ADMIN: {
    LABEL: 'Admin',
    UNDERWRITERS: 'Underwriters',
    PACKAGES: 'Packages',
    PRODUCTS: 'Group Scheme'
  },
  SERVICES: {
    LABEL: 'Services',
    CRM: 'CRM',
    POLICY: 'Policy',
    PREMIUM: 'Premium'
  },
  TOOLS: {
    LABEL: 'Tools',
    IMPORT: 'Import',
    EXPORT: 'Export'
  },
  REPORTS: {
    LABEL: 'Reports & BI',
    SALES: 'Sales',
    CLAIMS: 'Claims',
    ANALYTICS: 'Analytics'
  },
  SETTINGS: {
    LABEL: 'Settings',
    TEMPLATES: 'Message Templates',
    NOTIFICATIONS: 'Notifications',
    RULES: 'Rules'
  }
}

export const AUTH = {
  LOGIN: {
    TITLE: 'Log in',
    SUBTITLE: 'Please enter your details.',
    EMAIL_PLACEHOLDER: 'Email',
    PASSWORD_PLACEHOLDER: 'Password',
    REMEMBER_ME: 'Remember me',
    FORGOT_PASSWORD: 'Forgot password?',
    SUBMIT_BUTTON: 'Sign in',
    NO_ACCOUNT: 'Don\'t have an account?',
    SIGN_UP: 'Sign up',
    ERRORS: {
      INVALID_CREDENTIALS: 'Invalid email or password',
      EMPTY_EMAIL: 'Email is required',
      EMPTY_PASSWORD: 'Password is required',
      INVALID_EMAIL_FORMAT: 'Invalid email format'
    }
  },
  LOGOUT: {
    CONFIRM: 'Are you sure you want to log out?',
    SUCCESS: 'You have been logged out successfully'
  },
  SIGNUP: {
    TITLE: 'Create an account',
    SUBTITLE: 'Get started with your account',
    NAME_PLACEHOLDER: 'Full name',
    EMAIL_PLACEHOLDER: 'Email',
    PASSWORD_PLACEHOLDER: 'Password',
    CONFIRM_PASSWORD_PLACEHOLDER: 'Confirm password',
    TERMS: 'I agree to the Terms and Conditions',
    SUBMIT_BUTTON: 'Create account',
    HAVE_ACCOUNT: 'Already have an account?',
    SIGN_IN: 'Sign in',
    ERRORS: {
      PASSWORDS_DONT_MATCH: 'Passwords do not match',
      EMPTY_NAME: 'Full name is required',
      EMPTY_EMAIL: 'Email is required',
      EMPTY_PASSWORD: 'Password is required',
      PASSWORD_TOO_SHORT: 'Password must be at least 8 characters',
      INVALID_EMAIL_FORMAT: 'Invalid email format',
      TERMS_REQUIRED: 'You must agree to the terms and conditions'
    }
  }
}

export const COMMON = {
  ACTIONS: {
    ADD: 'Add',
    EDIT: 'Edit',
    DELETE: 'Delete',
    VIEW: 'View',
    SAVE: 'Save',
    CANCEL: 'Cancel',
    CONFIRM: 'Confirm',
    CLOSE: 'Close',
    BACK: 'Back',
    NEXT: 'Next',
    SEARCH: 'Search',
    FILTER: 'Filter',
    EXPORT: 'Export',
    IMPORT: 'Import',
    DOWNLOAD: 'Download',
    UPLOAD: 'Upload',
    SUBMIT: 'Submit'
  },
  MESSAGES: {
    SUCCESS: 'Operation completed successfully',
    ERROR: 'An error occurred. Please try again',
    DELETE_CONFIRM: 'Are you sure you want to delete this item?',
    LOADING: 'Loading...',
    NO_DATA: 'No data available',
    REQUIRED_FIELD: 'This field is required'
  },
  STATUS: {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    PENDING: 'Pending',
    COMPLETED: 'Completed',
    FAILED: 'Failed',
    PROCESSING: 'Processing',
    APPROVED: 'Approved',
    REJECTED: 'Rejected'
  }
}

export const PEOPLE = {
  TITLE: 'Customer Relationship',
  SUBTITLE: 'People',
  ADD_PERSON: 'Add Person',
  VIEW_PERSON: 'View Person',
  EDIT_PERSON: 'Edit Person',
  DELETE_PERSON: 'Delete Person',
  ID_TYPES: {
    RSA_ID: 'RSA ID',
    RSA_ID_BOOK: 'RSA ID Book',
    ASYLUM: 'Asylum',
    REFUGEE: 'Refugee',
    PASSPORT: 'Passport',
    DRIVERS_LICENSE: 'RSA Drivers License',
    OTHER: 'Other'
  },
  FIELDS: {
    OTHERNAME: 'Othername',
    SURNAME: 'Surname',
    GENDER: 'Gender',
    ID_TYPE: 'ID Type',
    ID_NO: 'ID No.',
    BIRTHDATE: 'Birthdate',
    LIVENESS: 'Liveness'
  }
}

export const POLICY = {
  TITLE: 'Policy Management',
  ADD_POLICY: 'Add Policy',
  VIEW_POLICY: 'View Policy',
  EDIT_POLICY: 'Edit Policy',
  DELETE_POLICY: 'Delete Policy',
  FIELDS: {
    POLICY_NUMBER: 'Policy Number',
    POLICY_TYPE: 'Policy Type',
    START_DATE: 'Start Date',
    END_DATE: 'End Date',
    PREMIUM_AMOUNT: 'Premium Amount',
    STATUS: 'Status',
    CUSTOMER: 'Customer',
    UNDERWRITER: 'Underwriter'
  }
}

export const PREMIUM = {
  TITLE: 'Premium Management',
  ADD_PREMIUM: 'Add Premium',
  VIEW_PREMIUM: 'View Premium',
  EDIT_PREMIUM: 'Edit Premium',
  DELETE_PREMIUM: 'Delete Premium',
  FIELDS: {
    PREMIUM_ID: 'Premium ID',
    POLICY_ID: 'Policy ID',
    AMOUNT: 'Amount',
    FREQUENCY: 'Frequency',
    DUE_DATE: 'Due Date',
    PAYMENT_DATE: 'Payment Date',
    PAYMENT_METHOD: 'Payment Method',
    STATUS: 'Status'
  }
}

export const SETTINGS = {
  TEMPLATES: {
    TITLE: 'Message Templates',
    ADD_TEMPLATE: 'Add Template',
    VIEW_TEMPLATE: 'View Template',
    EDIT_TEMPLATE: 'Edit Template',
    DELETE_TEMPLATE: 'Delete Template',
    FIELDS: {
      TEMPLATE_NAME: 'Template Name',
      SUBJECT: 'Subject',
      CONTENT: 'Content',
      VARIABLES: 'Variables',
      TYPE: 'Type'
    }
  },
  NOTIFICATIONS: {
    TITLE: 'Notifications',
    ADD_NOTIFICATION: 'Add Notification',
    VIEW_NOTIFICATION: 'View Notification',
    EDIT_NOTIFICATION: 'Edit Notification',
    DELETE_NOTIFICATION: 'Delete Notification',
    FIELDS: {
      NOTIFICATION_NAME: 'Notification Name',
      TYPE: 'Type',
      TEMPLATE: 'Template',
      TRIGGER: 'Trigger',
      STATUS: 'Status'
    }
  },
  RULES: {
    TITLE: 'Business Rules',
    ADD_RULE: 'Add Rule',
    VIEW_RULE: 'View Rule',
    EDIT_RULE: 'Edit Rule',
    DELETE_RULE: 'Delete Rule',
    FIELDS: {
      RULE_NAME: 'Rule Name',
      DESCRIPTION: 'Description',
      CONDITION: 'Condition',
      ACTION: 'Action',
      PRIORITY: 'Priority',
      STATUS: 'Status'
    }
  }
}

export default {
  APP,
  NAVIGATION,
  AUTH,
  COMMON,
  PEOPLE,
  POLICY,
  PREMIUM,
  SETTINGS
};
