// src/utils/calculations.js

/**
 * Calculate anemia severity based on hemoglobin level and gender (WHO / Clinical Guidelines)
 * @param {number|string} hemoglobin - Hemoglobin value in g/dL
 * @param {string} gender - 'Male' or 'Female'
 * @returns {object|null} - { severity, color, description, hb_threshold, level }
 */
export const calculateAnemiaSeverity = (hemoglobin, gender) => {
  if (hemoglobin === undefined || hemoglobin === null || hemoglobin === '' || !gender) return null;

  const hb = parseFloat(hemoglobin);
  if (isNaN(hb)) return null;

  if (gender === 'Female') {
    if (hb >= 12.0) {
      return {
        severity: 'Non-anemic',
        color: '#10B981',
        description: 'Normal hemoglobin level for adult female',
        hb_threshold: '≥ 12.0 g/dL',
        level: 'normal',
      };
    } else if (hb >= 10.0) {
      return {
        severity: 'Mild',
        color: '#F59E0B',
        description: 'Mild anemia (10.0 - 11.9 g/dL)',
        hb_threshold: '10.0 - 11.9 g/dL',
        level: 'mild',
      };
    } else if (hb >= 8.0) {
      return {
        severity: 'Moderate',
        color: '#F97316',
        description: 'Moderate anemia (8.0 - 9.9 g/dL)',
        hb_threshold: '8.0 - 9.9 g/dL',
        level: 'moderate',
      };
    } else {
      return {
        severity: 'Severe',
        color: '#EF4444',
        description: 'Severe anemia (< 8.0 g/dL)',
        hb_threshold: '< 8.0 g/dL',
        level: 'severe',
      };
    }
  } else if (gender === 'Male') {
    if (hb >= 13.0) {
      return {
        severity: 'Non-anemic',
        color: '#10B981',
        description: 'Normal hemoglobin level for adult male',
        hb_threshold: '≥ 13.0 g/dL',
        level: 'normal',
      };
    } else if (hb >= 10.0) {
      return {
        severity: 'Mild',
        color: '#F59E0B',
        description: 'Mild anemia (10.0 - 12.9 g/dL)',
        hb_threshold: '10.0 - 12.9 g/dL',
        level: 'mild',
      };
    } else if (hb >= 8.0) {
      return {
        severity: 'Moderate',
        color: '#F97316',
        description: 'Moderate anemia (8.0 - 9.9 g/dL)',
        hb_threshold: '8.0 - 9.9 g/dL',
        level: 'moderate',
      };
    } else {
      return {
        severity: 'Severe',
        color: '#EF4444',
        description: 'Severe anemia (< 8.0 g/dL)',
        hb_threshold: '< 8.0 g/dL',
        level: 'severe',
      };
    }
  }

  return null;
};

/**
 * Calculate study eligibility status based on strict inclusion/exclusion criteria
 * @param {object} criteria
 * @returns {string} - 'Included' or 'Excluded'
 */
export const calculateEligibilityStatus = (criteria = {}) => {
  const {
    inclusion_age_18 = false,
    inclusion_dialysis_3months = false,
    inclusion_dialysis_center = false,
    inclusion_informed_consent = false,
    exclusion_bleeding = false,
    exclusion_transfusion = false,
    exclusion_hematologic_malignancy = false,
    exclusion_chemotherapy = false,
    exclusion_pregnancy = false,
  } = criteria;

  // All inclusion criteria must be TRUE
  const allInclusionMet =
    Boolean(inclusion_age_18) &&
    Boolean(inclusion_dialysis_3months) &&
    Boolean(inclusion_dialysis_center) &&
    Boolean(inclusion_informed_consent);

  // All exclusion criteria must be FALSE (no exclusions)
  const noExclusionsMet =
    !Boolean(exclusion_bleeding) &&
    !Boolean(exclusion_transfusion) &&
    !Boolean(exclusion_hematologic_malignancy) &&
    !Boolean(exclusion_chemotherapy) &&
    !Boolean(exclusion_pregnancy);

  return allInclusionMet && noExclusionsMet ? 'Included' : 'Excluded';
};

/**
 * Calculate BMI
 * @param {number|string} weight - in kg
 * @param {number|string} height - in cm
 * @returns {number|null}
 */
export const calculateBMI = (weight, height) => {
  if (!weight || !height) return null;
  const w = parseFloat(weight);
  const h = parseFloat(height) / 100;
  if (isNaN(w) || isNaN(h) || h <= 0) return null;
  return parseFloat((w / (h * h)).toFixed(1));
};

/**
 * Get BMI category and color
 */
export const getBMICategory = (bmi) => {
  if (!bmi) return null;
  const val = parseFloat(bmi);
  if (val < 18.5) {
    return { category: 'Underweight', color: '#3B82F6', text: 'BMI < 18.5' };
  } else if (val < 25) {
    return { category: 'Normal Weight', color: '#10B981', text: '18.5 - 24.9' };
  } else if (val < 30) {
    return { category: 'Overweight', color: '#F59E0B', text: '25.0 - 29.9' };
  } else {
    return { category: 'Obese', color: '#EF4444', text: 'BMI ≥ 30.0' };
  }
};

/**
 * Format Number
 */
export const formatNumber = (num, decimals = 1) => {
  if (num === null || num === undefined || num === '') return '—';
  const parsed = parseFloat(num);
  return isNaN(parsed) ? String(num) : parsed.toFixed(decimals);
};

/**
 * Format Date to standard DD/MM/YYYY
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dateStr;
  }
};
