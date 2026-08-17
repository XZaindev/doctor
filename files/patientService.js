// src/services/patientService.js
import supabase from './supabaseClient';
import { calculateAnemiaSeverity, calculateEligibilityStatus } from '../utils/calculations';

/**
 * Save patient record to Supabase
 * @param {string} doctorId - Doctor's UUID
 * @param {object} formData - Complete form data
 * @returns {Promise<object>} - Response from Supabase
 */
export const savePatientRecord = async (doctorId, formData) => {
  try {
    // Calculate anemia severity if hemoglobin is provided
    let anemiaSeverity = null;
    if (formData.hemoglobin_g_dl && formData.gender) {
      const severityData = calculateAnemiaSeverity(formData.hemoglobin_g_dl, formData.gender);
      anemiaSeverity = severityData?.severity || null;
    }

    // Calculate eligibility status
    const eligibilityStatus = calculateEligibilityStatus({
      inclusion_age_18: formData.inclusion_age_18,
      inclusion_dialysis_3months: formData.inclusion_dialysis_3months,
      inclusion_dialysis_center: formData.inclusion_dialysis_center,
      inclusion_informed_consent: formData.inclusion_informed_consent,
      exclusion_bleeding: formData.exclusion_bleeding,
      exclusion_transfusion: formData.exclusion_transfusion,
      exclusion_hematologic_malignancy: formData.exclusion_hematologic_malignancy,
      exclusion_chemotherapy: formData.exclusion_chemotherapy,
      exclusion_pregnancy: formData.exclusion_pregnancy,
    });

    // Prepare data for insertion
    const recordData = {
      doctor_id: doctorId,
      patient_id: formData.patient_id,
      data_collection_date: formData.data_collection_date,

      // Step 1: Eligibility
      inclusion_age_18: formData.inclusion_age_18,
      inclusion_dialysis_3months: formData.inclusion_dialysis_3months,
      inclusion_dialysis_center: formData.inclusion_dialysis_center,
      inclusion_informed_consent: formData.inclusion_informed_consent,
      exclusion_bleeding: formData.exclusion_bleeding,
      exclusion_transfusion: formData.exclusion_transfusion,
      exclusion_hematologic_malignancy: formData.exclusion_hematologic_malignancy,
      exclusion_chemotherapy: formData.exclusion_chemotherapy,
      exclusion_pregnancy: formData.exclusion_pregnancy,
      eligibility_status: eligibilityStatus,

      // Step 2: Demographics
      age_years: formData.age_years ? parseInt(formData.age_years) : null,
      gender: formData.gender,
      marital_status: formData.marital_status,
      education_level: formData.education_level,
      employment_status: formData.employment_status,
      residence_type: formData.residence_type,
      weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
      height_cm: formData.height_cm ? parseFloat(formData.height_cm) : null,

      // Step 3: Medical History
      esrd_cause: formData.esrd_cause,
      esrd_cause_other: formData.esrd_cause_other,
      ckd_duration_years: formData.ckd_duration_years ? parseFloat(formData.ckd_duration_years) : null,
      comorbidities: formData.comorbidities || [],
      hospitalization_count: formData.hospitalization_count,

      // Step 4: Dialysis Parameters
      dialysis_duration_value: formData.dialysis_duration_value
        ? parseFloat(formData.dialysis_duration_value)
        : null,
      dialysis_duration_unit: formData.dialysis_duration_unit,
      dialysis_sessions_per_week: formData.dialysis_sessions_per_week,
      session_duration: formData.session_duration,
      vascular_access_type: formData.vascular_access_type,
      kt_v: formData.kt_v ? parseFloat(formData.kt_v) : null,

      // Step 5: Laboratory
      hemoglobin_g_dl: formData.hemoglobin_g_dl ? parseFloat(formData.hemoglobin_g_dl) : null,
      anemia_severity: anemiaSeverity,
      ferritin_ng_ml: formData.ferritin_ng_ml ? parseFloat(formData.ferritin_ng_ml) : null,
      tsat_percent: formData.tsat_percent ? parseFloat(formData.tsat_percent) : null,
      albumin_g_dl: formData.albumin_g_dl ? parseFloat(formData.albumin_g_dl) : null,
      crp_mg_l: formData.crp_mg_l ? parseFloat(formData.crp_mg_l) : null,
      ipth_pg_ml: formData.ipth_pg_ml ? parseFloat(formData.ipth_pg_ml) : null,

      // Step 6: Treatments
      esa_therapy: formData.esa_therapy || false,
      esa_dose_frequency: formData.esa_dose_frequency,
      iron_supplementation: formData.iron_supplementation,
      vitamin_b12: formData.vitamin_b12 || false,
      folic_acid: formData.folic_acid || false,
      blood_transfusion_6months: formData.blood_transfusion_6months || false,
      transfusion_units_count: formData.transfusion_units_count
        ? parseInt(formData.transfusion_units_count)
        : null,
    };

    // Insert into Supabase
    const { data, error } = await supabase
      .from('patient_records')
      .insert([recordData])
      .select();

    if (error) {
      console.error('Error saving patient record:', error);
      throw new Error(error.message);
    }

    return {
      success: true,
      data: data?.[0],
      message: 'Patient record saved successfully',
    };
  } catch (error) {
    console.error('Save patient record error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get patient record by ID
 * @param {string} recordId - Record UUID
 * @returns {Promise<object>}
 */
export const getPatientRecord = async (recordId) => {
  try {
    const { data, error } = await supabase
      .from('patient_records')
      .select('*')
      .eq('id', recordId)
      .single();

    if (error) throw error;

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Get patient record error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get all patient records for current doctor
 * @returns {Promise<array>}
 */
export const getDoctorPatientRecords = async () => {
  try {
    const { data, error } = await supabase
      .from('patient_records')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    console.error('Get patient records error:', error);
    return {
      success: false,
      error: error.message,
      data: [],
    };
  }
};

/**
 * Update patient record
 * @param {string} recordId - Record UUID
 * @param {object} updateData - Fields to update
 * @returns {Promise<object>}
 */
export const updatePatientRecord = async (recordId, updateData) => {
  try {
    // Recalculate anemia severity if hemoglobin changed
    if (updateData.hemoglobin_g_dl || updateData.gender) {
      const hb = updateData.hemoglobin_g_dl || (await getPatientRecord(recordId)).data?.hemoglobin_g_dl;
      const gender = updateData.gender || (await getPatientRecord(recordId)).data?.gender;

      if (hb && gender) {
        const severityData = calculateAnemiaSeverity(hb, gender);
        updateData.anemia_severity = severityData?.severity || null;
      }
    }

    const { data, error } = await supabase
      .from('patient_records')
      .update(updateData)
      .eq('id', recordId)
      .select();

    if (error) throw error;

    return {
      success: true,
      data: data?.[0],
    };
  } catch (error) {
    console.error('Update patient record error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Delete patient record
 * @param {string} recordId - Record UUID
 * @returns {Promise<object>}
 */
export const deletePatientRecord = async (recordId) => {
  try {
    const { error } = await supabase.from('patient_records').delete().eq('id', recordId);

    if (error) throw error;

    return {
      success: true,
      message: 'Record deleted successfully',
    };
  } catch (error) {
    console.error('Delete patient record error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get statistics for doctor's patient records
 * @returns {Promise<object>}
 */
export const getStatistics = async () => {
  try {
    const { data, error } = await supabase
      .from('patient_summary')
      .select('*');

    if (error) throw error;

    const stats = {
      totalRecords: data?.length || 0,
      includedCount: data?.filter((r) => r.eligibility_status === 'Included').length || 0,
      excludedCount: data?.filter((r) => r.eligibility_status === 'Excluded').length || 0,
      anemiaSeverityDistribution: {
        nonAnemic: data?.filter((r) => r.anemia_severity === 'Non-anemic').length || 0,
        mild: data?.filter((r) => r.anemia_severity === 'Mild').length || 0,
        moderate: data?.filter((r) => r.anemia_severity === 'Moderate').length || 0,
        severe: data?.filter((r) => r.anemia_severity === 'Severe').length || 0,
      },
    };

    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    console.error('Get statistics error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export default {
  savePatientRecord,
  getPatientRecord,
  getDoctorPatientRecords,
  updatePatientRecord,
  deletePatientRecord,
  getStatistics,
};
