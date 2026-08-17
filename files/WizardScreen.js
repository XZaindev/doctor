// src/screens/WizardScreen.js
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, typography, borderRadius } from '../styles/theme';
import {
  ProgressBar,
  FormField,
  ChipSelector,
  ToggleSwitch,
  Button,
  Card,
} from '../components';
import { calculateEligibilityStatus, calculateAnemiaSeverity } from '../utils/calculations';
import { savePatientRecord } from '../services/patientService';
import { AuthContext } from '../App';

const TOTAL_STEPS = 7; // Steps 0-6

const STEPS = {
  0: 'Patient ID',
  1: 'Eligibility Criteria',
  2: 'Demographics',
  3: 'Medical History',
  4: 'Dialysis Parameters',
  5: 'Laboratory Tests',
  6: 'Treatments & Transfusion',
};

export default function WizardScreen({ navigation }) {
  const { user, doctor } = useContext(AuthContext);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    // Step 0
    patient_id: '',
    data_collection_date: new Date().toISOString().split('T')[0],

    // Step 1
    inclusion_age_18: false,
    inclusion_dialysis_3months: false,
    inclusion_dialysis_center: false,
    inclusion_informed_consent: false,
    exclusion_bleeding: false,
    exclusion_transfusion: false,
    exclusion_hematologic_malignancy: false,
    exclusion_chemotherapy: false,
    exclusion_pregnancy: false,
    eligibility_status: 'Excluded',

    // Step 2
    age_years: '',
    gender: '',
    marital_status: '',
    education_level: '',
    employment_status: '',
    residence_type: '',
    weight_kg: '',
    height_cm: '',

    // Step 3
    esrd_cause: '',
    esrd_cause_other: '',
    ckd_duration_years: '',
    comorbidities: [],
    hospitalization_count: '',

    // Step 4
    dialysis_duration_value: '',
    dialysis_duration_unit: 'Months',
    dialysis_sessions_per_week: '',
    session_duration: '',
    vascular_access_type: '',
    kt_v: '',

    // Step 5
    hemoglobin_g_dl: '',
    anemia_severity: '',
    ferritin_ng_ml: '',
    tsat_percent: '',
    albumin_g_dl: '',
    crp_mg_l: '',
    ipth_pg_ml: '',

    // Step 6
    esa_therapy: false,
    esa_dose_frequency: '',
    iron_supplementation: 'None',
    vitamin_b12: false,
    folic_acid: false,
    blood_transfusion_6months: false,
    transfusion_units_count: '',
  });

  // Update form data
  const updateFormData = (field, value) => {
    const newData = { ...formData, [field]: value };

    // Auto-calculate eligibility status on step 1
    if (currentStep === 1) {
      newData.eligibility_status = calculateEligibilityStatus(newData);
    }

    // Auto-calculate anemia severity on step 5
    if (currentStep === 5 && field === 'hemoglobin_g_dl' && newData.gender) {
      const severity = calculateAnemiaSeverity(value, newData.gender);
      newData.anemia_severity = severity?.severity || '';
    }

    setFormData(newData);
  };

  // Validate current step
  const validateStep = () => {
    switch (currentStep) {
      case 0:
        if (!formData.patient_id.trim()) {
          Alert.alert('Error', 'Please enter Patient ID');
          return false;
        }
        if (!formData.data_collection_date) {
          Alert.alert('Error', 'Please select collection date');
          return false;
        }
        return true;

      case 1:
        // All eligibility questions must be answered
        if (
          formData.inclusion_age_18 === null ||
          formData.inclusion_dialysis_3months === null ||
          formData.inclusion_dialysis_center === null ||
          formData.inclusion_informed_consent === null ||
          formData.exclusion_bleeding === null ||
          formData.exclusion_transfusion === null ||
          formData.exclusion_hematologic_malignancy === null ||
          formData.exclusion_chemotherapy === null ||
          formData.exclusion_pregnancy === null
        ) {
          Alert.alert('Error', 'Please answer all eligibility questions');
          return false;
        }
        return true;

      case 2:
        if (!formData.age_years || !formData.gender) {
          Alert.alert('Error', 'Please fill in required fields');
          return false;
        }
        return true;

      case 5:
        if (!formData.hemoglobin_g_dl) {
          Alert.alert('Error', 'Hemoglobin value is required');
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < TOTAL_STEPS - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Save data and go to summary
        handleSave();
      }
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Save patient record
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await savePatientRecord(user.id, formData);

      if (result.success) {
        // Navigate to summary with saved data
        navigation.replace('Summary', {
          patientData: {
            ...formData,
            id: result.data.id,
          },
          doctorName: doctor.full_name,
        });
      } else {
        Alert.alert('Error', 'Failed to save patient record: ' + result.error);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ProgressBar currentStep={currentStep + 1} totalSteps={TOTAL_STEPS} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Step Content */}
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>{STEPS[currentStep]}</Text>

          {/* STEP 0: Patient ID */}
          {currentStep === 0 && (
            <>
              <FormField
                label="Patient ID"
                placeholder="e.g., P-001-2024"
                value={formData.patient_id}
                onChangeText={(text) => updateFormData('patient_id', text)}
                required
                helperText="Unique identifier for this patient"
              />
              <FormField
                label="Date of Collection"
                placeholder="YYYY-MM-DD"
                value={formData.data_collection_date}
                onChangeText={(text) => updateFormData('data_collection_date', text)}
                required
              />
            </>
          )}

          {/* STEP 1: Eligibility Criteria */}
          {currentStep === 1 && (
            <>
              <Card>
                <Text style={styles.warningText}>
                  ⚠️ Patient must meet ALL inclusion criteria and have NONE of the exclusion criteria to be eligible for the study.
                </Text>
              </Card>

              <Text style={styles.subSectionTitle}>Inclusion Criteria (Answer "Yes" for all)</Text>
              <ToggleSwitch
                label="Age ≥ 18 years?"
                value={formData.inclusion_age_18}
                onValueChange={(val) => updateFormData('inclusion_age_18', val)}
                required
              />
              <ToggleSwitch
                label="On permanent dialysis for ≥ 3 months?"
                value={formData.inclusion_dialysis_3months}
                onValueChange={(val) => updateFormData('inclusion_dialysis_3months', val)}
                required
              />
              <ToggleSwitch
                label="Dialyzing at Ibn Sina Center?"
                value={formData.inclusion_dialysis_center}
                onValueChange={(val) => updateFormData('inclusion_dialysis_center', val)}
                required
              />
              <ToggleSwitch
                label="Informed Consent obtained?"
                value={formData.inclusion_informed_consent}
                onValueChange={(val) => updateFormData('inclusion_informed_consent', val)}
                required
              />

              <Text style={styles.subSectionTitle}>Exclusion Criteria (Answer "No" for all)</Text>
              <ToggleSwitch
                label="Known severe bleeding in last 4 weeks?"
                value={formData.exclusion_bleeding}
                onValueChange={(val) => updateFormData('exclusion_bleeding', val)}
                required
              />
              <ToggleSwitch
                label="Blood transfusion in last 4 weeks?"
                value={formData.exclusion_transfusion}
                onValueChange={(val) => updateFormData('exclusion_transfusion', val)}
                required
              />
              <ToggleSwitch
                label="Hematologic malignancy or bone marrow failure?"
                value={formData.exclusion_hematologic_malignancy}
                onValueChange={(val) => updateFormData('exclusion_hematologic_malignancy', val)}
                required
              />
              <ToggleSwitch
                label="Currently receiving chemotherapy/radiotherapy?"
                value={formData.exclusion_chemotherapy}
                onValueChange={(val) => updateFormData('exclusion_chemotherapy', val)}
                required
              />
              <ToggleSwitch
                label="Currently pregnant? (Female only)"
                value={formData.exclusion_pregnancy}
                onValueChange={(val) => updateFormData('exclusion_pregnancy', val)}
              />

              {/* Eligibility Status Badge */}
              <Card style={styles.statusCard}>
                <Text style={styles.statusLabel}>Eligibility Status:</Text>
                <Text
                  style={[
                    styles.statusBadge,
                    {
                      color:
                        formData.eligibility_status === 'Included'
                          ? colors.success
                          : colors.error,
                    },
                  ]}
                >
                  {formData.eligibility_status}
                </Text>
              </Card>
            </>
          )}

          {/* STEP 2: Demographics */}
          {currentStep === 2 && (
            <>
              <FormField
                label="Age (years)"
                placeholder="25"
                value={formData.age_years}
                onChangeText={(text) => updateFormData('age_years', text)}
                keyboardType="numeric"
                required
              />

              <ChipSelector
                label="Gender"
                options={['Male', 'Female']}
                value={formData.gender}
                onSelect={(val) => updateFormData('gender', val)}
                required
              />

              <ChipSelector
                label="Marital Status"
                options={['Single', 'Married', 'Divorced', 'Widowed']}
                value={formData.marital_status}
                onSelect={(val) => updateFormData('marital_status', val)}
              />

              <ChipSelector
                label="Education Level"
                options={[
                  'Illiterate',
                  'Read & Write',
                  'Primary-Intermediate',
                  'Secondary',
                  'University or Higher',
                ]}
                value={formData.education_level}
                onSelect={(val) => updateFormData('education_level', val)}
              />

              <ChipSelector
                label="Employment Status"
                options={[
                  'Employed (Full-time)',
                  'Employed (Part-time)',
                  'Unemployed-Retired',
                  'Homemaker',
                ]}
                value={formData.employment_status}
                onSelect={(val) => updateFormData('employment_status', val)}
              />

              <ChipSelector
                label="Residence Type"
                options={['Urban', 'Rural']}
                value={formData.residence_type}
                onSelect={(val) => updateFormData('residence_type', val)}
              />

              <FormField
                label="Weight (kg)"
                placeholder="70"
                value={formData.weight_kg}
                onChangeText={(text) => updateFormData('weight_kg', text)}
                keyboardType="decimal-pad"
              />

              <FormField
                label="Height (cm)"
                placeholder="175"
                value={formData.height_cm}
                onChangeText={(text) => updateFormData('height_cm', text)}
                keyboardType="decimal-pad"
              />
            </>
          )}

          {/* STEP 3: Medical History */}
          {currentStep === 3 && (
            <>
              <ChipSelector
                label="Cause of ESRD"
                options={[
                  'Diabetic Nephropathy',
                  'Hypertensive Nephropathy',
                  'Glomerulonephritis',
                  'Polycystic Kidney Disease (PKD)',
                  'Unknown-Idiopathic',
                  'Other',
                ]}
                value={formData.esrd_cause}
                onSelect={(val) => updateFormData('esrd_cause', val)}
              />

              {formData.esrd_cause === 'Other' && (
                <FormField
                  label="Specify Other Cause"
                  placeholder="Enter other cause"
                  value={formData.esrd_cause_other}
                  onChangeText={(text) => updateFormData('esrd_cause_other', text)}
                />
              )}

              <FormField
                label="CKD Duration (years)"
                placeholder="5"
                value={formData.ckd_duration_years}
                onChangeText={(text) => updateFormData('ckd_duration_years', text)}
                keyboardType="decimal-pad"
              />

              <ChipSelector
                label="Comorbidities (Select all that apply)"
                options={[
                  'Diabetes Mellitus',
                  'Hypertension',
                  'Cardiovascular Disease (CVD)',
                  'History of Focal Bleeding',
                  'Recent / Recurrent Infections',
                ]}
                value={formData.comorbidities}
                onSelect={(val) => updateFormData('comorbidities', val)}
                multiSelect
                horizontal={false}
              />

              <ChipSelector
                label="Hospitalizations (Last Year)"
                options={['None', '1 time', '≥ 2 times']}
                value={formData.hospitalization_count}
                onSelect={(val) => updateFormData('hospitalization_count', val)}
              />
            </>
          )}

          {/* STEP 4: Dialysis Parameters */}
          {currentStep === 4 && (
            <>
              <FormField
                label="Dialysis Duration"
                placeholder="12"
                value={formData.dialysis_duration_value}
                onChangeText={(text) => updateFormData('dialysis_duration_value', text)}
                keyboardType="decimal-pad"
              />

              <ChipSelector
                label="Duration Unit"
                options={['Months', 'Years']}
                value={formData.dialysis_duration_unit}
                onSelect={(val) => updateFormData('dialysis_duration_unit', val)}
              />

              <ChipSelector
                label="Sessions Per Week"
                options={['1 session/week', '2 sessions/week', '3 sessions/week']}
                value={formData.dialysis_sessions_per_week}
                onSelect={(val) => updateFormData('dialysis_sessions_per_week', val)}
              />

              <ChipSelector
                label="Session Duration"
                options={['3 hours', '3.5 hours', '4 hours']}
                value={formData.session_duration}
                onSelect={(val) => updateFormData('session_duration', val)}
              />

              <ChipSelector
                label="Vascular Access Type"
                options={[
                  'Arteriovenous Fistula (AVF)',
                  'Arteriovenous Graft (AVG)',
                  'Permcath (Tunneled Cuffed Catheter)',
                  'Temporary Non-tunneled Catheter',
                ]}
                value={formData.vascular_access_type}
                onSelect={(val) => updateFormData('vascular_access_type', val)}
              />

              <FormField
                label="Kt/V (optional)"
                placeholder="1.2"
                value={formData.kt_v}
                onChangeText={(text) => updateFormData('kt_v', text)}
                keyboardType="decimal-pad"
                helperText="Leave blank if not available"
              />
            </>
          )}

          {/* STEP 5: Laboratory Tests */}
          {currentStep === 5 && (
            <>
              <FormField
                label="Hemoglobin (g/dL)"
                placeholder="10.5"
                value={formData.hemoglobin_g_dl}
                onChangeText={(text) => updateFormData('hemoglobin_g_dl', text)}
                keyboardType="decimal-pad"
                required
              />

              {formData.anemia_severity && (
                <Card>
                  <Text style={styles.resultLabel}>Anemia Severity: <Text style={styles.resultValue}>{formData.anemia_severity}</Text></Text>
                </Card>
              )}

              <FormField
                label="Serum Ferritin (ng/mL)"
                placeholder="200"
                value={formData.ferritin_ng_ml}
                onChangeText={(text) => updateFormData('ferritin_ng_ml', text)}
                keyboardType="decimal-pad"
              />

              <FormField
                label="TSAT (%)"
                placeholder="25"
                value={formData.tsat_percent}
                onChangeText={(text) => updateFormData('tsat_percent', text)}
                keyboardType="decimal-pad"
              />

              <FormField
                label="Serum Albumin (g/dL)"
                placeholder="3.5"
                value={formData.albumin_g_dl}
                onChangeText={(text) => updateFormData('albumin_g_dl', text)}
                keyboardType="decimal-pad"
              />

              <FormField
                label="CRP (mg/L)"
                placeholder="5"
                value={formData.crp_mg_l}
                onChangeText={(text) => updateFormData('crp_mg_l', text)}
                keyboardType="decimal-pad"
              />

              <FormField
                label="iPTH (pg/mL)"
                placeholder="200"
                value={formData.ipth_pg_ml}
                onChangeText={(text) => updateFormData('ipth_pg_ml', text)}
                keyboardType="decimal-pad"
              />
            </>
          )}

          {/* STEP 6: Treatments */}
          {currentStep === 6 && (
            <>
              <ToggleSwitch
                label="ESA Therapy?"
                value={formData.esa_therapy}
                onValueChange={(val) => updateFormData('esa_therapy', val)}
              />

              {formData.esa_therapy && (
                <FormField
                  label="ESA Dose & Frequency"
                  placeholder="e.g., 4000 IU weekly"
                  value={formData.esa_dose_frequency}
                  onChangeText={(text) => updateFormData('esa_dose_frequency', text)}
                  multiline
                  numberOfLines={3}
                />
              )}

              <ChipSelector
                label="Iron Supplementation"
                options={['None', 'Oral Iron', 'Intravenous (IV) Iron']}
                value={formData.iron_supplementation}
                onSelect={(val) => updateFormData('iron_supplementation', val)}
              />

              <ToggleSwitch
                label="Vitamin B12?"
                value={formData.vitamin_b12}
                onValueChange={(val) => updateFormData('vitamin_b12', val)}
              />

              <ToggleSwitch
                label="Folic Acid?"
                value={formData.folic_acid}
                onValueChange={(val) => updateFormData('folic_acid', val)}
              />

              <ToggleSwitch
                label="Blood Transfusion in last 6 months (excluding last 4 weeks)?"
                value={formData.blood_transfusion_6months}
                onValueChange={(val) => updateFormData('blood_transfusion_6months', val)}
              />

              {formData.blood_transfusion_6months && (
                <FormField
                  label="Number of Units Received"
                  placeholder="2"
                  value={formData.transfusion_units_count}
                  onChangeText={(text) => updateFormData('transfusion_units_count', text)}
                  keyboardType="numeric"
                />
              )}
            </>
          )}
        </View>
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          label="Previous"
          onPress={handlePrevious}
          variant="secondary"
          disabled={currentStep === 0 || isSaving}
          style={styles.navButton}
        />
        <Button
          label={isSaving ? 'Saving...' : currentStep === TOTAL_STEPS - 1 ? 'Complete & Review' : 'Next'}
          onPress={handleNext}
          disabled={isSaving}
          style={styles.navButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl * 2,
  },
  stepContainer: {
    marginBottom: spacing.xl,
  },
  stepTitle: {
    fontSize: typography.size.h4,
    fontWeight: typography.weight.bold,
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  subSectionTitle: {
    fontSize: typography.size.h6,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  warningText: {
    fontSize: typography.size.bodySmall,
    color: colors.error,
    fontWeight: typography.weight.semibold,
  },
  statusCard: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: typography.size.label,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
  },
  statusBadge: {
    fontSize: typography.size.h6,
    fontWeight: typography.weight.bold,
  },
  resultLabel: {
    fontSize: typography.size.label,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
  },
  resultValue: {
    color: colors.primary,
    fontWeight: typography.weight.bold,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  navButton: {
    flex: 1,
    margin: 0,
  },
});
