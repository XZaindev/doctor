// src/utils/validators.js
import { APP_CONFIG } from '../config/constants';

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  if (!password) return { valid: false, error: 'Password is required' };

  if (password.length < APP_CONFIG.VALIDATION.PASSWORD_MIN_LENGTH) {
    return {
      valid: false,
      error: `Password must be at least ${APP_CONFIG.VALIDATION.PASSWORD_MIN_LENGTH} characters`,
    };
  }

  return { valid: true, error: null };
};

/**
 * Validate passwords match
 */
export const validatePasswordsMatch = (password1, password2) => {
  return password1 === password2;
};

/**
 * Validate full name
 */
export const validateFullName = (name) => {
  if (!name || name.trim().length < APP_CONFIG.VALIDATION.FULL_NAME_MIN_LENGTH) {
    return {
      valid: false,
      error: `Name must be at least ${APP_CONFIG.VALIDATION.FULL_NAME_MIN_LENGTH} characters`,
    };
  }

  if (name.trim().length > APP_CONFIG.VALIDATION.FULL_NAME_MAX_LENGTH) {
    return {
      valid: false,
      error: `Name must not exceed ${APP_CONFIG.VALIDATION.FULL_NAME_MAX_LENGTH} characters`,
    };
  }

  return { valid: true, error: null };
};

/**
 * Validate patient ID
 */
export const validatePatientID = (patientID) => {
  if (!patientID || patientID.trim().length < APP_CONFIG.VALIDATION.PATIENT_ID_MIN_LENGTH) {
    return {
      valid: false,
      error: `Patient ID must be at least ${APP_CONFIG.VALIDATION.PATIENT_ID_MIN_LENGTH} characters`,
    };
  }

  if (patientID.trim().length > APP_CONFIG.VALIDATION.PATIENT_ID_MAX_LENGTH) {
    return {
      valid: false,
      error: `Patient ID must not exceed ${APP_CONFIG.VALIDATION.PATIENT_ID_MAX_LENGTH} characters`,
    };
  }

  return { valid: true, error: null };
};

/**
 * Validate age
 */
export const validateAge = (age) => {
  const ageNum = parseInt(age);

  if (isNaN(ageNum) || ageNum < APP_CONFIG.MIN_AGE) {
    return {
      valid: false,
      error: `Age must be at least ${APP_CONFIG.MIN_AGE} years`,
    };
  }

  if (ageNum > APP_CONFIG.MAX_AGE) {
    return {
      valid: false,
      error: `Age must not exceed ${APP_CONFIG.MAX_AGE} years`,
    };
  }

  return { valid: true, error: null };
};

/**
 * Validate weight
 */
export const validateWeight = (weight) => {
  const w = parseFloat(weight);

  if (isNaN(w) || w < APP_CONFIG.ANTHROPOMETRY.WEIGHT_MIN) {
    return {
      valid: false,
      error: `Weight must be at least ${APP_CONFIG.ANTHROPOMETRY.WEIGHT_MIN} kg`,
    };
  }

  if (w > APP_CONFIG.ANTHROPOMETRY.WEIGHT_MAX) {
    return {
      valid: false,
      error: `Weight must not exceed ${APP_CONFIG.ANTHROPOMETRY.WEIGHT_MAX} kg`,
    };
  }

  return { valid: true, error: null };
};

/**
 * Validate height
 */
export const validateHeight = (height) => {
  const h = parseFloat(height);

  if (isNaN(h) || h < APP_CONFIG.ANTHROPOMETRY.HEIGHT_MIN) {
    return {
      valid: false,
      error: `Height must be at least ${APP_CONFIG.ANTHROPOMETRY.HEIGHT_MIN} cm`,
    };
  }

  if (h > APP_CONFIG.ANTHROPOMETRY.HEIGHT_MAX) {
    return {
      valid: false,
      error: `Height must not exceed ${APP_CONFIG.ANTHROPOMETRY.HEIGHT_MAX} cm`,
    };
  }

  return { valid: true, error: null };
};

/**
 * Validate hemoglobin value
 */
export const validateHemoglobin = (hemoglobin) => {
  const hb = parseFloat(hemoglobin);

  if (isNaN(hb) || hb <= 0) {
    return {
      valid: false,
      error: 'Hemoglobin must be a positive number',
    };
  }

  if (hb < 5 || hb > 20) {
    return {
      valid: false,
      error: 'Hemoglobin value seems invalid. Check if entered correctly.',
    };
  }

  return { valid: true, error: null };
};

/**
 * Validate ferritin value
 */
export const validateFerritin = (ferritin) => {
  if (!ferritin) return { valid: true, error: null }; // Optional field

  const f = parseFloat(ferritin);

  if (isNaN(f) || f < APP_CONFIG.LAB_VALUES.FERRITIN_MIN) {
    return {
      valid: false,
      error: `Ferritin must be at least ${APP_CONFIG.LAB_VALUES.FERRITIN_MIN}`,
    };
  }

  if (f > APP_CONFIG.LAB_VALUES.FERRITIN_MAX) {
    return {
      valid: false,
      error: `Ferritin must not exceed ${APP_CONFIG.LAB_VALUES.FERRITIN_MAX}`,
    };
  }

  return { valid: true, error: null };
};

/**
 * Validate TSAT percentage
 */
export const validateTSAT = (tsat) => {
  if (!tsat) return { valid: true, error: null }; // Optional field

  const t = parseFloat(tsat);

  if (isNaN(t) || t < APP_CONFIG.LAB_VALUES.TSAT_MIN) {
    return {
      valid: false,
      error: `TSAT must be at least ${APP_CONFIG.LAB_VALUES.TSAT_MIN}%`,
    };
  }

  if (t > APP_CONFIG.LAB_VALUES.TSAT_MAX) {
    return {
      valid: false,
      error: `TSAT must not exceed ${APP_CONFIG.LAB_VALUES.TSAT_MAX}%`,
    };
  }

  return { valid: true, error: null };
};

/**
 * Validate CKD duration
 */
export const validateCKDDuration = (duration) => {
  if (!duration) return { valid: true, error: null }; // Optional

  const d = parseFloat(duration);

  if (isNaN(d) || d < 0) {
    return {
      valid: false,
      error: 'CKD duration must be a positive number',
    };
  }

  if (d > 60) {
    return {
      valid: false,
      error: 'CKD duration seems too long. Check if entered correctly.',
    };
  }

  return { valid: true, error: null };
};

/**
 * Validate dialysis duration
 */
export const validateDialysisDuration = (value, unit) => {
  if (!value) return { valid: true, error: null }; // Optional

  const v = parseFloat(value);

  if (isNaN(v) || v < 0) {
    return {
      valid: false,
      error: 'Dialysis duration must be a positive number',
    };
  }

  if (unit === 'Months' && v < APP_CONFIG.DIALYSIS.MIN_DURATION_MONTHS) {
    return {
      valid: false,
      error: `Dialysis duration must be at least ${APP_CONFIG.DIALYSIS.MIN_DURATION_MONTHS} months`,
    };
  }

  if (unit === 'Years' && v < APP_CONFIG.DIALYSIS.MIN_DURATION_YEARS) {
    return {
      valid: false,
      error: `Dialysis duration must be at least ${APP_CONFIG.DIALYSIS.MIN_DURATION_YEARS} years`,
    };
  }

  return { valid: true, error: null };
};

/**
 * Validate Kt/V
 */
export const validateKtV = (ktv) => {
  if (!ktv) return { valid: true, error: null }; // Optional field

  const k = parseFloat(ktv);

  if (isNaN(k) || k < 0) {
    return {
      valid: false,
      error: 'Kt/V must be a positive number',
    };
  }

  if (k > 5) {
    return {
      valid: false,
      error: 'Kt/V value seems too high. Check if entered correctly.',
    };
  }

  return { valid: true, error: null };
};

/**
 * Validate date format (YYYY-MM-DD)
 */
export const validateDate = (dateString) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!dateRegex.test(dateString)) {
    return {
      valid: false,
      error: 'Date must be in YYYY-MM-DD format',
    };
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return {
      valid: false,
      error: 'Invalid date',
    };
  }

  // Check if date is not in future
  if (date > new Date()) {
    return {
      valid: false,
      error: 'Collection date cannot be in the future',
    };
  }

  return { valid: true, error: null };
};

/**
 * Validate all form data for a step
 */
export const validateFormStep = (stepNumber, formData) => {
  const errors = {};

  switch (stepNumber) {
    case 0: // Patient ID & Date
      {
        const patientIDValidation = validatePatientID(formData.patient_id);
        if (!patientIDValidation.valid) errors.patient_id = patientIDValidation.error;

        const dateValidation = validateDate(formData.data_collection_date);
        if (!dateValidation.valid) errors.data_collection_date = dateValidation.error;
      }
      break;

    case 2: // Demographics
      {
        const ageValidation = validateAge(formData.age_years);
        if (!ageValidation.valid) errors.age_years = ageValidation.error;

        if (formData.weight_kg) {
          const weightValidation = validateWeight(formData.weight_kg);
          if (!weightValidation.valid) errors.weight_kg = weightValidation.error;
        }

        if (formData.height_cm) {
          const heightValidation = validateHeight(formData.height_cm);
          if (!heightValidation.valid) errors.height_cm = heightValidation.error;
        }
      }
      break;

    case 3: // Medical History
      {
        if (formData.ckd_duration_years) {
          const ckdValidation = validateCKDDuration(formData.ckd_duration_years);
          if (!ckdValidation.valid) errors.ckd_duration_years = ckdValidation.error;
        }
      }
      break;

    case 4: // Dialysis Parameters
      {
        if (formData.dialysis_duration_value) {
          const dialysisValidation = validateDialysisDuration(
            formData.dialysis_duration_value,
            formData.dialysis_duration_unit
          );
          if (!dialysisValidation.valid) {
            errors.dialysis_duration_value = dialysisValidation.error;
          }
        }

        if (formData.kt_v) {
          const ktvValidation = validateKtV(formData.kt_v);
          if (!ktvValidation.valid) errors.kt_v = ktvValidation.error;
        }
      }
      break;

    case 5: // Laboratory Tests
      {
        const hbValidation = validateHemoglobin(formData.hemoglobin_g_dl);
        if (!hbValidation.valid) errors.hemoglobin_g_dl = hbValidation.error;

        if (formData.ferritin_ng_ml) {
          const ferritinValidation = validateFerritin(formData.ferritin_ng_ml);
          if (!ferritinValidation.valid) errors.ferritin_ng_ml = ferritinValidation.error;
        }

        if (formData.tsat_percent) {
          const tsatValidation = validateTSAT(formData.tsat_percent);
          if (!tsatValidation.valid) errors.tsat_percent = tsatValidation.error;
        }
      }
      break;

    default:
      break;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  validateEmail,
  validatePassword,
  validatePasswordsMatch,
  validateFullName,
  validatePatientID,
  validateAge,
  validateWeight,
  validateHeight,
  validateHemoglobin,
  validateFerritin,
  validateTSAT,
  validateCKDDuration,
  validateDialysisDuration,
  validateKtV,
  validateDate,
  validateFormStep,
};
