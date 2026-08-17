// src/config/constants.js

export const APP_CONFIG = {
  APP_NAME: 'Anemia Research Study',
  APP_VERSION: '1.0.0',
  SUPPORT_EMAIL: 'support@anemiaresearch.org',
  
  // Dialysis center info
  DIALYSIS_CENTER: {
    NAME: 'Ibn Sina Center for Kidney Dialysis',
    LOCATION: 'Basra, Iraq',
  },

  // Study information
  STUDY_INFO: {
    TITLE: 'Anemia in Dialysis Patients - Research Study',
    DESCRIPTION: 'A comprehensive study on anemia management in chronic kidney disease patients undergoing hemodialysis',
    YEARS: '2024-2026',
  },

  // Form validation rules
  VALIDATION = {
    PATIENT_ID_MIN_LENGTH: 3,
    PATIENT_ID_MAX_LENGTH: 50,
    PASSWORD_MIN_LENGTH: 6,
    PASSWORD_REQUIRE_UPPERCASE: false,
    PASSWORD_REQUIRE_NUMBERS: false,
    FULL_NAME_MIN_LENGTH: 3,
    FULL_NAME_MAX_LENGTH: 100,
  },

  // Age restrictions
  MIN_AGE: 18,
  MAX_AGE: 120,

  // Weight and height ranges
  ANTHROPOMETRY = {
    WEIGHT_MIN: 30,  // kg
    WEIGHT_MAX: 200, // kg
    HEIGHT_MIN: 80,  // cm
    HEIGHT_MAX: 230, // cm
  },

  // Hemoglobin thresholds (g/dL)
  HEMOGLOBIN_THRESHOLDS = {
    FEMALE: {
      SEVERE: 8.0,
      MODERATE_MIN: 8.0,
      MODERATE_MAX: 9.9,
      MILD_MIN: 10.0,
      MILD_MAX: 11.9,
      NORMAL: 12.0,
    },
    MALE: {
      SEVERE: 8.0,
      MODERATE_MIN: 8.0,
      MODERATE_MAX: 9.9,
      MILD_MIN: 10.0,
      MILD_MAX: 12.9,
      NORMAL: 13.0,
    },
  },

  // Dialysis parameters
  DIALYSIS = {
    MIN_DURATION_MONTHS: 3,
    MIN_DURATION_YEARS: 0.25,
    MAX_SESSIONS_PER_WEEK: 6,
    MIN_SESSION_DURATION_HOURS: 2,
    MAX_SESSION_DURATION_HOURS: 5,
  },

  // Laboratory value ranges
  LAB_VALUES = {
    FERRITIN_MIN: 0,
    FERRITIN_MAX: 2000,
    TSAT_MIN: 0,
    TSAT_MAX: 100,
    ALBUMIN_MIN: 0,
    ALBUMIN_MAX: 10,
    CRP_MIN: 0,
    CRP_MAX: 1000,
    IPTH_MIN: 0,
    IPTH_MAX: 10000,
  },

  // API timeout
  API_TIMEOUT: 30000, // 30 seconds

  // Storage keys
  STORAGE_KEYS = {
    USER_TOKEN: 'userToken',
    USER_ID: 'userId',
    DOCTOR_ID: 'doctorId',
    DOCTOR_NAME: 'doctorName',
    LAST_LOGIN: 'lastLogin',
    APP_PREFERENCES: 'appPreferences',
  },

  // Step names
  WIZARD_STEPS = {
    0: 'Patient Identification',
    1: 'Eligibility Criteria',
    2: 'Demographics & Anthropometry',
    3: 'Medical History & Comorbidities',
    4: 'Dialysis Parameters',
    5: 'Laboratory Tests',
    6: 'Treatments & Transfusion',
  },

  // Error messages
  ERROR_MESSAGES = {
    INVALID_EMAIL: 'Please enter a valid email address',
    PASSWORD_TOO_SHORT: 'Password must be at least 6 characters',
    PASSWORDS_DONT_MATCH: 'Passwords do not match',
    FILL_REQUIRED_FIELDS: 'Please fill in all required fields',
    ANSWER_ALL_QUESTIONS: 'Please answer all eligibility questions',
    NETWORK_ERROR: 'Check your internet connection',
    SERVER_ERROR: 'Server error. Please try again later',
    UNAUTHORIZED: 'Invalid credentials. Please try again',
    PERMISSION_DENIED: 'You do not have permission to perform this action',
  },

  // Success messages
  SUCCESS_MESSAGES = {
    SIGN_UP_SUCCESS: 'Sign up successful. Check your email for verification.',
    SIGN_IN_SUCCESS: 'Welcome back!',
    SIGN_OUT_SUCCESS: 'You have been signed out',
    RECORD_SAVED: 'Patient record saved successfully',
    PDF_GENERATED: 'PDF generated successfully',
    PDF_SHARED: 'PDF shared successfully',
  },

  // Feature flags
  FEATURES = {
    ENABLE_OFFLINE_MODE: false,
    ENABLE_STATISTICS: true,
    ENABLE_MULTI_LANGUAGE: false,
    ENABLE_NOTIFICATIONS: true,
    ENABLE_DARK_MODE: false,
  },
};

export default APP_CONFIG;
