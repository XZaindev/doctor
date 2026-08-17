// src/utils/calculations.js

/**
 * Calculate anemia severity based on hemoglobin level and gender
 * @param {number} hemoglobin - Hemoglobin value in g/dL
 * @param {string} gender - 'Male' or 'Female'
 * @returns {object} - { severity, color, description }
 */
export const calculateAnemiaSeverity = (hemoglobin, gender) => {
  if (!hemoglobin || !gender) return null;

  const hb = parseFloat(hemoglobin);

  if (gender === 'Female') {
    if (hb >= 12.0) {
      return {
        severity: 'Non-anemic',
        color: '#4CAF50', // Green
        description: 'Normal hemoglobin level',
        hb_threshold: '≥ 12.0',
      };
    } else if (hb >= 10.0) {
      return {
        severity: 'Mild',
        color: '#FFC107', // Amber
        description: 'Mild anemia',
        hb_threshold: '10.0 - 11.9',
      };
    } else if (hb >= 8.0) {
      return {
        severity: 'Moderate',
        color: '#FF9800', // Orange
        description: 'Moderate anemia',
        hb_threshold: '8.0 - 9.9',
      };
    } else {
      return {
        severity: 'Severe',
        color: '#F44336', // Red
        description: 'Severe anemia',
        hb_threshold: '< 8.0',
      };
    }
  } else if (gender === 'Male') {
    if (hb >= 13.0) {
      return {
        severity: 'Non-anemic',
        color: '#4CAF50', // Green
        description: 'Normal hemoglobin level',
        hb_threshold: '≥ 13.0',
      };
    } else if (hb >= 10.0) {
      return {
        severity: 'Mild',
        color: '#FFC107', // Amber
        description: 'Mild anemia',
        hb_threshold: '10.0 - 12.9',
      };
    } else if (hb >= 8.0) {
      return {
        severity: 'Moderate',
        color: '#FF9800', // Orange
        description: 'Moderate anemia',
        hb_threshold: '8.0 - 9.9',
      };
    } else {
      return {
        severity: 'Severe',
        color: '#F44336', // Red
        description: 'Severe anemia',
        hb_threshold: '< 8.0',
      };
    }
  }

  return null;
};

/**
 * Calculate eligibility status
 * @param {object} criteria - Inclusion and exclusion criteria
 * @returns {string} - 'Included' or 'Excluded'
 */
export const calculateEligibilityStatus = (criteria) => {
  const {
    inclusion_age_18,
    inclusion_dialysis_3months,
    inclusion_dialysis_center,
    inclusion_informed_consent,
    exclusion_bleeding,
    exclusion_transfusion,
    exclusion_hematologic_malignancy,
    exclusion_chemotherapy,
    exclusion_pregnancy,
  } = criteria;

  // All inclusion criteria must be TRUE
  const allInclusionMet =
    inclusion_age_18 === true &&
    inclusion_dialysis_3months === true &&
    inclusion_dialysis_center === true &&
    inclusion_informed_consent === true;

  // All exclusion criteria must be FALSE (no exclusions)
  const noExclusionsMet =
    exclusion_bleeding === false &&
    exclusion_transfusion === false &&
    exclusion_hematologic_malignancy === false &&
    exclusion_chemotherapy === false &&
    exclusion_pregnancy === false;

  return allInclusionMet && noExclusionsMet ? 'Included' : 'Excluded';
};

/**
 * Calculate BMI
 * @param {number} weight - Weight in kg
 * @param {number} height - Height in cm
 * @returns {number} - BMI value
 */
export const calculateBMI = (weight, height) => {
  if (!weight || !height) return null;

  const w = parseFloat(weight);
  const h = parseFloat(height) / 100; // Convert cm to meters

  if (h <= 0) return null;

  return parseFloat((w / (h * h)).toFixed(2));
};

/**
 * Get BMI category
 * @param {number} bmi - BMI value
 * @returns {object} - { category, description, color }
 */
export const getBMICategory = (bmi) => {
  if (!bmi) return null;

  if (bmi < 18.5) {
    return {
      category: 'Underweight',
      description: 'BMI < 18.5',
      color: '#2196F3',
    };
  } else if (bmi < 25) {
    return {
      category: 'Normal Weight',
      description: '18.5 - 24.9',
      color: '#4CAF50',
    };
  } else if (bmi < 30) {
    return {
      category: 'Overweight',
      description: '25.0 - 29.9',
      color: '#FFC107',
    };
  } else {
    return {
      category: 'Obese',
      description: 'BMI ≥ 30',
      color: '#F44336',
    };
  }
};

/**
 * Format number with 2 decimal places
 */
export const formatNumber = (num, decimals = 2) => {
  if (num === null || num === undefined) return '';
  return parseFloat(num).toFixed(decimals);
};

/**
 * Format date to 'DD/MM/YYYY'
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Convert dialysis duration to standard format
 */
export const formatDialysisDuration = (value, unit) => {
  if (!value || !unit) return '';
  return `${value} ${unit}`;
};

/**
 * Get list of selected comorbidities as string
 */
export const formatComorbidities = (comorbidities) => {
  if (!comorbidities || comorbidities.length === 0) return 'None';
  return comorbidities.join(', ');
};

/**
 * Export all data to JSON format (for export/backup)
 */
export const prepareDataForExport = (formData) => {
  return {
    patientId: formData.patient_id || 'N/A',
    collectionDate: formatDate(formData.data_collection_date),
    eligibilityStatus: formData.eligibility_status || 'N/A',
    demographics: {
      age: formData.age_years || 'N/A',
      gender: formData.gender || 'N/A',
      maritalStatus: formData.marital_status || 'N/A',
      educationLevel: formData.education_level || 'N/A',
      employmentStatus: formData.employment_status || 'N/A',
      residenceType: formData.residence_type || 'N/A',
    },
    anthropometry: {
      weight: formData.weight_kg ? `${formData.weight_kg} kg` : 'N/A',
      height: formData.height_cm ? `${formData.height_cm} cm` : 'N/A',
    },
    medicalHistory: {
      esrdCause: formData.esrd_cause || 'N/A',
      ckdDuration: formData.ckd_duration_years ? `${formData.ckd_duration_years} years` : 'N/A',
      comorbidities: formatComorbidities(formData.comorbidities),
      hospitalization: formData.hospitalization_count || 'N/A',
    },
    dialysisParameters: {
      duration: formatDialysisDuration(
        formData.dialysis_duration_value,
        formData.dialysis_duration_unit
      ),
      sessionsPerWeek: formData.dialysis_sessions_per_week || 'N/A',
      sessionDuration: formData.session_duration || 'N/A',
      vasularAccessType: formData.vascular_access_type || 'N/A',
      ktV: formData.kt_v ? formatNumber(formData.kt_v) : 'N/A',
    },
    laboratoryResults: {
      hemoglobin: formData.hemoglobin_g_dl
        ? `${formatNumber(formData.hemoglobin_g_dl)} g/dL`
        : 'N/A',
      anemiaSeverity: formData.anemia_severity || 'N/A',
      ferritin: formData.ferritin_ng_ml ? `${formatNumber(formData.ferritin_ng_ml)} ng/mL` : 'N/A',
      tsat: formData.tsat_percent ? `${formatNumber(formData.tsat_percent)}%` : 'N/A',
      albumin: formData.albumin_g_dl ? `${formatNumber(formData.albumin_g_dl)} g/dL` : 'N/A',
      crp: formData.crp_mg_l ? `${formatNumber(formData.crp_mg_l)} mg/L` : 'N/A',
      ipth: formData.ipth_pg_ml ? `${formatNumber(formData.ipth_pg_ml)} pg/mL` : 'N/A',
    },
    treatments: {
      esaTherapy: formData.esa_therapy ? `Yes - ${formData.esa_dose_frequency || 'N/A'}` : 'No',
      ironSupplementation: formData.iron_supplementation || 'None',
      vitaminB12: formData.vitamin_b12 ? 'Yes' : 'No',
      folicAcid: formData.folic_acid ? 'Yes' : 'No',
      bloodTransfusion: formData.blood_transfusion_6months
        ? `Yes - ${formData.transfusion_units_count || 0} units`
        : 'No',
    },
  };
};
