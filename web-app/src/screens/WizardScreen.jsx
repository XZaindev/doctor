// src/screens/WizardScreen.jsx
import React, { useState, useEffect } from 'react';
import {
  calculateEligibilityStatus,
  calculateAnemiaSeverity,
  calculateBMI,
  getBMICategory
} from '../utils/calculations';
import {
  User,
  ShieldAlert,
  ClipboardList,
  Activity,
  Droplet,
  Pill,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Info,
  Calendar,
  Sparkles
} from 'lucide-react';

const STEPS = [
  { id: 0, title: 'Patient ID', icon: User, short: 'ID & Date' },
  { id: 1, title: 'Eligibility Criteria', icon: ShieldAlert, short: 'Eligibility' },
  { id: 2, title: 'Demographics', icon: ClipboardList, short: 'Demographics' },
  { id: 3, title: 'Medical History', icon: Activity, short: 'History' },
  { id: 4, title: 'Dialysis Parameters', icon: Activity, short: 'Dialysis' },
  { id: 5, title: 'Laboratory Tests', icon: Droplet, short: 'Labs' },
  { id: 6, title: 'Treatments & Transfusions', icon: Pill, short: 'Treatments' },
];

export default function WizardScreen({ initialData, onCompleteWizard, onCancel }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState(
    initialData || {
      // Step 0
      patient_id: `P-${Math.floor(100 + Math.random() * 900)}-2026`,
      data_collection_date: new Date().toISOString().split('T')[0],

      // Step 1: Eligibility
      inclusion_age_18: true,
      inclusion_dialysis_3months: true,
      inclusion_dialysis_center: true,
      inclusion_informed_consent: true,
      exclusion_bleeding: false,
      exclusion_transfusion: false,
      exclusion_hematologic_malignancy: false,
      exclusion_chemotherapy: false,
      exclusion_pregnancy: false,
      eligibility_status: 'Included',

      // Step 2: Demographics
      age_years: '52',
      gender: 'Male',
      marital_status: 'Married',
      education_level: 'Secondary',
      employment_status: 'Unemployed-Retired',
      residence_type: 'Urban',
      weight_kg: '74',
      height_cm: '170',

      // Step 3: Medical History
      esrd_cause: 'Diabetic Nephropathy',
      esrd_cause_other: '',
      ckd_duration_years: '5',
      comorbidities: ['Diabetes Mellitus', 'Hypertension'],
      hospitalization_count: '1 time',

      // Step 4: Dialysis
      dialysis_duration_value: '18',
      dialysis_duration_unit: 'Months',
      dialysis_sessions_per_week: '3 sessions/week',
      session_duration: '4 hours',
      vascular_access_type: 'Arteriovenous Fistula (AVF)',
      kt_v: '1.30',

      // Step 5: Laboratory
      hemoglobin_g_dl: '9.6',
      anemia_severity: 'Moderate',
      ferritin_ng_ml: '290',
      tsat_percent: '21',
      albumin_g_dl: '3.9',
      crp_mg_l: '5.5',
      ipth_pg_ml: '220',

      // Step 6: Treatments
      esa_therapy: true,
      esa_dose_frequency: 'Epoetin alfa 4000 IU twice weekly',
      iron_supplementation: 'Intravenous (IV) Iron',
      vitamin_b12: true,
      folic_acid: true,
      blood_transfusion_6months: false,
      transfusion_units_count: '',
    }
  );

  // Auto calculate eligibility whenever step 1 criteria changes
  useEffect(() => {
    const status = calculateEligibilityStatus(formData);
    if (status !== formData.eligibility_status) {
      setFormData((prev) => ({ ...prev, eligibility_status: status }));
    }
  }, [
    formData.inclusion_age_18,
    formData.inclusion_dialysis_3months,
    formData.inclusion_dialysis_center,
    formData.inclusion_informed_consent,
    formData.exclusion_bleeding,
    formData.exclusion_transfusion,
    formData.exclusion_hematologic_malignancy,
    formData.exclusion_chemotherapy,
    formData.exclusion_pregnancy,
  ]);

  // Auto calculate anemia severity whenever Hb or gender changes
  useEffect(() => {
    if (formData.hemoglobin_g_dl && formData.gender) {
      const result = calculateAnemiaSeverity(formData.hemoglobin_g_dl, formData.gender);
      const newSeverity = result ? result.severity : '';
      if (newSeverity !== formData.anemia_severity) {
        setFormData((prev) => ({ ...prev, anemia_severity: newSeverity }));
      }
    }
  }, [formData.hemoglobin_g_dl, formData.gender]);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const toggleMultiSelect = (field, item) => {
    const current = formData[field] || [];
    const updated = current.includes(item)
      ? current.filter((x) => x !== item)
      : [...current, item];
    updateField(field, updated);
  };

  // Validation
  const validateCurrentStep = () => {
    const newErrors = {};
    if (currentStep === 0) {
      if (!formData.patient_id.trim()) newErrors.patient_id = 'Patient ID is required';
      if (!formData.data_collection_date) newErrors.data_collection_date = 'Date is required';
    } else if (currentStep === 2) {
      if (!formData.age_years) newErrors.age_years = 'Age is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
    } else if (currentStep === 5) {
      if (!formData.hemoglobin_g_dl) newErrors.hemoglobin_g_dl = 'Hemoglobin (Hb) is required for research evaluation';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        onCompleteWizard(formData);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Calculated BMI
  const bmiVal = calculateBMI(formData.weight_kg, formData.height_cm);
  const bmiCategory = getBMICategory(bmiVal);
  const anemiaInfo = calculateAnemiaSeverity(formData.hemoglobin_g_dl, formData.gender);

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      {/* Desktop Wizard Step Navigation Bar */}
      <div className="stepper-header">
        {STEPS.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          return (
            <div
              key={step.id}
              className={`step-node ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              onClick={() => {
                if (isCompleted || validateCurrentStep()) {
                  setCurrentStep(step.id);
                }
              }}
            >
              <div className="step-circle">
                {isCompleted ? <CheckCircle size={16} /> : step.id + 1}
              </div>
              <div className="step-title">{step.short}</div>
            </div>
          );
        })}
      </div>

      {/* Mobile Compact Progress Bar */}
      <div className="mobile-stepper-compact">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#008B8B', textTransform: 'uppercase' }}>
              Step {currentStep + 1} / {STEPS.length}
            </span>
            <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a' }}>
              {STEPS[currentStep].title}
            </div>
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b' }}>
            {Math.round(((currentStep + 1) / STEPS.length) * 100)}%
          </span>
        </div>

        {/* Progress Track */}
        <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden', display: 'flex', gap: '3px' }}>
          {STEPS.map((s) => (
            <div
              key={s.id}
              style={{
                flex: 1,
                background: s.id <= currentStep ? '#008B8B' : '#e2e8f0',
                transition: 'background 0.2s ease'
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Step Card */}
      <div className="med-card" style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Step Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#008B8B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Step {currentStep + 1} of {STEPS.length}
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: '2px 0 0 0' }}>
              {STEPS[currentStep].title}
            </h2>
          </div>

          {/* Quick Realtime Badge Indicator */}
          {currentStep === 1 && (
            <span className={`status-badge ${formData.eligibility_status.toLowerCase()}`}>
              {formData.eligibility_status === 'Included' ? '✓ Eligible' : '✕ Excluded'}
            </span>
          )}
          {currentStep === 5 && anemiaInfo && (
            <span className={`status-badge ${anemiaInfo.level}`}>
              Hb: {formData.hemoglobin_g_dl} g/dL ({anemiaInfo.severity})
            </span>
          )}
        </div>

        {/* STEP 0: Patient Identification */}
        {currentStep === 0 && (
          <div>
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              <Info size={20} color="#008B8B" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.875rem', color: '#475569' }}>
                Enter the unique pseudonymized patient code designated for the Ibn Sina Hemodialysis Cohort Study. Ensure date matches the clinical sampling appointment.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">
                  Patient Study ID <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. P-042-2026"
                  value={formData.patient_id}
                  onChange={(e) => updateField('patient_id', e.target.value)}
                />
                {errors.patient_id && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px' }}>{errors.patient_id}</div>}
                <span className="form-help">Assigned clinical identifier</span>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Date of Data Collection <span className="required">*</span>
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.data_collection_date}
                  onChange={(e) => updateField('data_collection_date', e.target.value)}
                />
                {errors.data_collection_date && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px' }}>{errors.data_collection_date}</div>}
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: Eligibility Criteria */}
        {currentStep === 1 && (
          <div>
            <div style={{
              background: formData.eligibility_status === 'Included' ? '#ecfdf5' : '#fef2f2',
              border: `1.5px solid ${formData.eligibility_status === 'Included' ? '#a7f3d0' : '#fecaca'}`,
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertTriangle size={22} color={formData.eligibility_status === 'Included' ? '#10b981' : '#ef4444'} />
                <div>
                  <div style={{ fontWeight: '700', color: formData.eligibility_status === 'Included' ? '#065f46' : '#991b1b' }}>
                    Calculated Status: {formData.eligibility_status === 'Included' ? 'ELIGIBLE FOR STUDY (Included)' : 'NOT ELIGIBLE (Excluded)'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: formData.eligibility_status === 'Included' ? '#047857' : '#b91c1c' }}>
                    Must satisfy all 4 inclusion criteria AND 0 exclusion criteria.
                  </div>
                </div>
              </div>
              <span className={`status-badge ${formData.eligibility_status.toLowerCase()}`} style={{ fontSize: '0.9rem' }}>
                {formData.eligibility_status}
              </span>
            </div>

            {/* Inclusion Criteria */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', color: '#008B8B', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={18} /> Inclusion Criteria (All must be YES)
              </h3>

              <div
                className={`toggle-item ${formData.inclusion_age_18 ? 'checked-yes' : 'checked-no'}`}
                onClick={() => updateField('inclusion_age_18', !formData.inclusion_age_18)}
              >
                <div>
                  <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '0.92rem' }}>1. Age ≥ 18 years old?</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Patient is an adult at study enrollment</div>
                </div>
                <div className={`toggle-slider ${formData.inclusion_age_18 ? 'active' : ''}`}>
                  <div className="toggle-circle"></div>
                </div>
              </div>

              <div
                className={`toggle-item ${formData.inclusion_dialysis_3months ? 'checked-yes' : 'checked-no'}`}
                onClick={() => updateField('inclusion_dialysis_3months', !formData.inclusion_dialysis_3months)}
              >
                <div>
                  <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '0.92rem' }}>2. On permanent hemodialysis for ≥ 3 months?</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Adequate maintenance dialysis stabilization period</div>
                </div>
                <div className={`toggle-slider ${formData.inclusion_dialysis_3months ? 'active' : ''}`}>
                  <div className="toggle-circle"></div>
                </div>
              </div>

              <div
                className={`toggle-item ${formData.inclusion_dialysis_center ? 'checked-yes' : 'checked-no'}`}
                onClick={() => updateField('inclusion_dialysis_center', !formData.inclusion_dialysis_center)}
              >
                <div>
                  <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '0.92rem' }}>3. Regularly dialyzing at Ibn Sina Dialysis Center?</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Primary study location verification</div>
                </div>
                <div className={`toggle-slider ${formData.inclusion_dialysis_center ? 'active' : ''}`}>
                  <div className="toggle-circle"></div>
                </div>
              </div>

              <div
                className={`toggle-item ${formData.inclusion_informed_consent ? 'checked-yes' : 'checked-no'}`}
                onClick={() => updateField('inclusion_informed_consent', !formData.inclusion_informed_consent)}
              >
                <div>
                  <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '0.92rem' }}>4. Written Informed Consent obtained?</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Signed ethics and research participation consent</div>
                </div>
                <div className={`toggle-slider ${formData.inclusion_informed_consent ? 'active' : ''}`}>
                  <div className="toggle-circle"></div>
                </div>
              </div>
            </div>

            {/* Exclusion Criteria */}
            <div>
              <h3 style={{ fontSize: '1rem', color: '#ef4444', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldAlert size={18} /> Exclusion Criteria (All must be NO)
              </h3>

              <div
                className={`toggle-item ${formData.exclusion_bleeding ? 'checked-yes' : 'checked-no'}`}
                onClick={() => updateField('exclusion_bleeding', !formData.exclusion_bleeding)}
              >
                <div>
                  <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '0.92rem' }}>Known active/severe bleeding in last 4 weeks?</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>GI bleeding, major surgery or acute hemorrhage</div>
                </div>
                <div className={`toggle-slider ${formData.exclusion_bleeding ? 'active' : ''}`}>
                  <div className="toggle-circle"></div>
                </div>
              </div>

              <div
                className={`toggle-item ${formData.exclusion_transfusion ? 'checked-yes' : 'checked-no'}`}
                onClick={() => updateField('exclusion_transfusion', !formData.exclusion_transfusion)}
              >
                <div>
                  <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '0.92rem' }}>Blood transfusion received in last 4 weeks?</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Recent transfusion alters baseline anemia & ferritin parameters</div>
                </div>
                <div className={`toggle-slider ${formData.exclusion_transfusion ? 'active' : ''}`}>
                  <div className="toggle-circle"></div>
                </div>
              </div>

              <div
                className={`toggle-item ${formData.exclusion_hematologic_malignancy ? 'checked-yes' : 'checked-no'}`}
                onClick={() => updateField('exclusion_hematologic_malignancy', !formData.exclusion_hematologic_malignancy)}
              >
                <div>
                  <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '0.92rem' }}>Hematologic malignancy or bone marrow failure?</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Leukemia, lymphoma, myeloma, aplastic anemia</div>
                </div>
                <div className={`toggle-slider ${formData.exclusion_hematologic_malignancy ? 'active' : ''}`}>
                  <div className="toggle-circle"></div>
                </div>
              </div>

              <div
                className={`toggle-item ${formData.exclusion_chemotherapy ? 'checked-yes' : 'checked-no'}`}
                onClick={() => updateField('exclusion_chemotherapy', !formData.exclusion_chemotherapy)}
              >
                <div>
                  <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '0.92rem' }}>Currently receiving chemotherapy or radiotherapy?</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Active immunosuppressive / cytotoxic cancer treatment</div>
                </div>
                <div className={`toggle-slider ${formData.exclusion_chemotherapy ? 'active' : ''}`}>
                  <div className="toggle-circle"></div>
                </div>
              </div>

              {formData.gender === 'Female' && (
                <div
                  className={`toggle-item ${formData.exclusion_pregnancy ? 'checked-yes' : 'checked-no'}`}
                  onClick={() => updateField('exclusion_pregnancy', !formData.exclusion_pregnancy)}
                >
                  <div>
                    <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '0.92rem' }}>Currently pregnant?</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Pregnancy alters erythropoiesis hemodynamics</div>
                  </div>
                  <div className={`toggle-slider ${formData.exclusion_pregnancy ? 'active' : ''}`}>
                    <div className="toggle-circle"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: Demographics & Anthropometry */}
        {currentStep === 2 && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Age (years) <span className="required">*</span></label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.age_years}
                  onChange={(e) => updateField('age_years', e.target.value)}
                  placeholder="e.g. 52"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gender <span className="required">*</span></label>
                <div className="chip-grid">
                  {['Male', 'Female'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className={`chip-btn ${formData.gender === opt ? 'active' : ''}`}
                      onClick={() => updateField('gender', opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Marital Status</label>
                <div className="chip-grid">
                  {['Single', 'Married', 'Divorced', 'Widowed'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className={`chip-btn ${formData.marital_status === opt ? 'active' : ''}`}
                      onClick={() => updateField('marital_status', opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Residence Type</label>
                <div className="chip-grid">
                  {['Urban', 'Rural'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className={`chip-btn ${formData.residence_type === opt ? 'active' : ''}`}
                      onClick={() => updateField('residence_type', opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Education Level</label>
              <div className="chip-grid">
                {['Illiterate', 'Read & Write', 'Primary-Intermediate', 'Secondary', 'University or Higher'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`chip-btn ${formData.education_level === opt ? 'active' : ''}`}
                    onClick={() => updateField('education_level', opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Employment Status</label>
              <div className="chip-grid">
                {['Employed (Full-time)', 'Employed (Part-time)', 'Unemployed-Retired', 'Homemaker'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`chip-btn ${formData.employment_status === opt ? 'active' : ''}`}
                    onClick={() => updateField('employment_status', opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Anthropometry & Auto BMI */}
            <div style={{
              marginTop: '1.5rem',
              padding: '1.25rem',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px'
            }}>
              <h4 style={{ fontSize: '0.95rem', color: '#0f172a', marginBottom: '1rem', fontWeight: '700' }}>
                Anthropometry & Body Mass Index (BMI)
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'center' }}>
                <div>
                  <label className="form-label">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-input"
                    value={formData.weight_kg}
                    onChange={(e) => updateField('weight_kg', e.target.value)}
                    placeholder="e.g. 74"
                  />
                </div>
                <div>
                  <label className="form-label">Height (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    className="form-input"
                    value={formData.height_cm}
                    onChange={(e) => updateField('height_cm', e.target.value)}
                    placeholder="e.g. 170"
                  />
                </div>
                <div style={{
                  padding: '0.85rem 1rem',
                  background: '#ffffff',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Calculated BMI</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#008B8B' }}>
                      {bmiVal ? `${bmiVal} kg/m²` : '—'}
                    </div>
                  </div>
                  {bmiCategory && (
                    <span style={{
                      padding: '0.25rem 0.65rem',
                      borderRadius: '999px',
                      background: '#f1f5f9',
                      color: bmiCategory.color,
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      border: `1px solid ${bmiCategory.color}`
                    }}>
                      {bmiCategory.category}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Medical History */}
        {currentStep === 3 && (
          <div>
            <div className="form-group">
              <label className="form-label">Primary Cause of End-Stage Renal Disease (ESRD)</label>
              <div className="chip-grid">
                {[
                  'Diabetic Nephropathy',
                  'Hypertensive Nephropathy',
                  'Glomerulonephritis',
                  'Polycystic Kidney Disease (PKD)',
                  'Unknown-Idiopathic',
                  'Other',
                ].map((cause) => (
                  <button
                    key={cause}
                    type="button"
                    className={`chip-btn ${formData.esrd_cause === cause ? 'active' : ''}`}
                    onClick={() => updateField('esrd_cause', cause)}
                  >
                    {cause}
                  </button>
                ))}
              </div>
            </div>

            {formData.esrd_cause === 'Other' && (
              <div className="form-group">
                <label className="form-label">Specify Other ESRD Etiology</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.esrd_cause_other}
                  onChange={(e) => updateField('esrd_cause_other', e.target.value)}
                  placeholder="e.g. Obstructive Uropathy, Lupus Nephritis"
                />
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginTop: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Total CKD Duration (years)</label>
                <input
                  type="number"
                  step="0.5"
                  className="form-input"
                  value={formData.ckd_duration_years}
                  onChange={(e) => updateField('ckd_duration_years', e.target.value)}
                  placeholder="e.g. 5"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Hospitalizations in Last Year</label>
                <div className="chip-grid">
                  {['None', '1 time', '≥ 2 times'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className={`chip-btn ${formData.hospitalization_count === opt ? 'active' : ''}`}
                      onClick={() => updateField('hospitalization_count', opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">Documented Comorbidities (Select all that apply)</label>
              <div className="chip-grid">
                {[
                  'Diabetes Mellitus',
                  'Hypertension',
                  'Cardiovascular Disease (CVD)',
                  'History of Focal Bleeding',
                  'Recent / Recurrent Infections',
                ].map((item) => {
                  const isChecked = (formData.comorbidities || []).includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      className={`chip-btn ${isChecked ? 'active' : ''}`}
                      onClick={() => toggleMultiSelect('comorbidities', item)}
                    >
                      {isChecked ? '✓ ' : '+ '} {item}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Dialysis Parameters */}
        {currentStep === 4 && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Dialysis Vintage Duration</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="number"
                    step="0.1"
                    className="form-input"
                    value={formData.dialysis_duration_value}
                    onChange={(e) => updateField('dialysis_duration_value', e.target.value)}
                    placeholder="e.g. 18"
                    style={{ flex: 2 }}
                  />
                  <select
                    className="form-select"
                    value={formData.dialysis_duration_unit}
                    onChange={(e) => updateField('dialysis_duration_unit', e.target.value)}
                    style={{ flex: 1.5 }}
                  >
                    <option value="Months">Months</option>
                    <option value="Years">Years</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Sessions Per Week</label>
                <div className="chip-grid">
                  {['1 session/week', '2 sessions/week', '3 sessions/week'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className={`chip-btn ${formData.dialysis_sessions_per_week === opt ? 'active' : ''}`}
                      onClick={() => updateField('dialysis_sessions_per_week', opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Single Session Duration</label>
                <div className="chip-grid">
                  {['3 hours', '3.5 hours', '4 hours'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className={`chip-btn ${formData.session_duration === opt ? 'active' : ''}`}
                      onClick={() => updateField('session_duration', opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Dialysis Adequacy: Kt/V (Optional)</label>
                <input
                  type="number"
                  step="0.05"
                  className="form-input"
                  value={formData.kt_v}
                  onChange={(e) => updateField('kt_v', e.target.value)}
                  placeholder="Target ≥ 1.20 (e.g. 1.35)"
                />
                <span className="form-help">Single-pool urea clearance Kt/V</span>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '1.25rem' }}>
              <label className="form-label">Current Vascular Access Type</label>
              <div className="chip-grid">
                {[
                  'Arteriovenous Fistula (AVF)',
                  'Arteriovenous Graft (AVG)',
                  'Permcath (Tunneled Cuffed Catheter)',
                  'Temporary Non-tunneled Catheter',
                ].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`chip-btn ${formData.vascular_access_type === opt ? 'active' : ''}`}
                    onClick={() => updateField('vascular_access_type', opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Laboratory Tests & Auto Severity */}
        {currentStep === 5 && (
          <div>
            {/* Hemoglobin & Live Anemia Severity Box */}
            <div style={{
              background: 'linear-gradient(135deg, #f0fdfa, #f8fafc)',
              border: '1.5px solid #a7f3d0',
              borderRadius: '14px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              boxShadow: '0 4px 12px rgba(0, 139, 139, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Droplet size={24} color="#008B8B" />
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: '#0f172a' }}>
                      Primary Marker: Hemoglobin (Hb)
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      Auto-evaluates Anemia Severity based on WHO & KDIGO sex-specific thresholds
                    </span>
                  </div>
                </div>

                {anemiaInfo && (
                  <span className={`status-badge ${anemiaInfo.level}`} style={{ fontSize: '0.95rem', padding: '0.4rem 1rem' }}>
                    ● {anemiaInfo.severity} Anemia
                  </span>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.5rem', alignItems: 'center' }}>
                <div>
                  <label className="form-label">
                    Hemoglobin (g/dL) <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-input"
                    style={{ fontSize: '1.3rem', fontWeight: '800', color: '#008B8B' }}
                    value={formData.hemoglobin_g_dl}
                    onChange={(e) => updateField('hemoglobin_g_dl', e.target.value)}
                    placeholder="e.g. 9.6"
                  />
                  {errors.hemoglobin_g_dl && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px' }}>{errors.hemoglobin_g_dl}</div>}
                </div>

                <div style={{
                  padding: '0.9rem',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '0.85rem'
                }}>
                  <div style={{ fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>
                    Criteria for {formData.gender || 'Patient'}:
                  </div>
                  <div style={{ color: '#64748b', lineHeight: '1.4' }}>
                    {formData.gender === 'Female' ? (
                      <>Normal: ≥12.0 | Mild: 10.0–11.9 | Moderate: 8.0–9.9 | Severe: &lt;8.0 g/dL</>
                    ) : (
                      <>Normal: ≥13.0 | Mild: 10.0–12.9 | Moderate: 8.0–9.9 | Severe: &lt;8.0 g/dL</>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Other Lab Biomarkers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Serum Ferritin (ng/mL)</label>
                <input
                  type="number"
                  step="1"
                  className="form-input"
                  value={formData.ferritin_ng_ml}
                  onChange={(e) => updateField('ferritin_ng_ml', e.target.value)}
                  placeholder="Target: 200 - 500"
                />
              </div>

              <div className="form-group">
                <label className="form-label">TSAT (%)</label>
                <input
                  type="number"
                  step="0.5"
                  className="form-input"
                  value={formData.tsat_percent}
                  onChange={(e) => updateField('tsat_percent', e.target.value)}
                  placeholder="Target: ≥ 20 - 30%"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Serum Albumin (g/dL)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  value={formData.albumin_g_dl}
                  onChange={(e) => updateField('albumin_g_dl', e.target.value)}
                  placeholder="Normal: ≥ 4.0"
                />
              </div>

              <div className="form-group">
                <label className="form-label">C-Reactive Protein (CRP) (mg/L)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  value={formData.crp_mg_l}
                  onChange={(e) => updateField('crp_mg_l', e.target.value)}
                  placeholder="Normal: &lt; 5.0"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Intact PTH (iPTH) (pg/mL)</label>
                <input
                  type="number"
                  step="1"
                  className="form-input"
                  value={formData.ipth_pg_ml}
                  onChange={(e) => updateField('ipth_pg_ml', e.target.value)}
                  placeholder="CKD-5D range: 150 - 300"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Treatments & Transfusions */}
        {currentStep === 6 && (
          <div>
            {/* ESA Therapy */}
            <div style={{
              border: '1.5px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.25rem',
              marginBottom: '1.25rem',
              background: formData.esa_therapy ? '#f0fdfa' : '#ffffff'
            }}>
              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                onClick={() => updateField('esa_therapy', !formData.esa_therapy)}
              >
                <div>
                  <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '1rem' }}>
                    Erythropoiesis-Stimulating Agent (ESA) Therapy
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Epoetin alfa / Darbepoetin alfa prescription
                  </div>
                </div>
                <div className={`toggle-slider ${formData.esa_therapy ? 'active' : ''}`}>
                  <div className="toggle-circle"></div>
                </div>
              </div>

              {formData.esa_therapy && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #ccfbf1' }}>
                  <label className="form-label">ESA Agent, Dosage & Frequency</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.esa_dose_frequency}
                    onChange={(e) => updateField('esa_dose_frequency', e.target.value)}
                    placeholder="e.g. Epoetin alfa 4000 IU twice weekly or Darbepoetin 30mcg weekly"
                  />
                </div>
              )}
            </div>

            {/* Iron Supplementation */}
            <div className="form-group" style={{ marginTop: '1.25rem' }}>
              <label className="form-label">Iron Supplementation Modality</label>
              <div className="chip-grid">
                {['None', 'Oral Iron', 'Intravenous (IV) Iron'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`chip-btn ${formData.iron_supplementation === opt ? 'active' : ''}`}
                    onClick={() => updateField('iron_supplementation', opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Adjuvants */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginTop: '1.25rem' }}>
              <div
                className={`toggle-item ${formData.vitamin_b12 ? 'checked-yes' : 'checked-no'}`}
                onClick={() => updateField('vitamin_b12', !formData.vitamin_b12)}
              >
                <div>
                  <div style={{ fontWeight: '600', color: '#0f172a' }}>Vitamin B12 Supplementation</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Cyanocobalamin / Hydroxocobalamin</div>
                </div>
                <div className={`toggle-slider ${formData.vitamin_b12 ? 'active' : ''}`}>
                  <div className="toggle-circle"></div>
                </div>
              </div>

              <div
                className={`toggle-item ${formData.folic_acid ? 'checked-yes' : 'checked-no'}`}
                onClick={() => updateField('folic_acid', !formData.folic_acid)}
              >
                <div>
                  <div style={{ fontWeight: '600', color: '#0f172a' }}>Folic Acid Supplementation</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Daily Folate (5mg) adjuvant</div>
                </div>
                <div className={`toggle-slider ${formData.folic_acid ? 'active' : ''}`}>
                  <div className="toggle-circle"></div>
                </div>
              </div>
            </div>

            {/* Transfusion in past 6 months */}
            <div style={{
              marginTop: '1.25rem',
              border: '1.5px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.25rem',
              background: formData.blood_transfusion_6months ? '#fff7ed' : '#ffffff'
            }}>
              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                onClick={() => updateField('blood_transfusion_6months', !formData.blood_transfusion_6months)}
              >
                <div>
                  <div style={{ fontWeight: '700', color: '#0f172a' }}>
                    Blood Transfusion within past 6 months (excluding last 4 weeks)
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Packed RBC transfusion history for study record
                  </div>
                </div>
                <div className={`toggle-slider ${formData.blood_transfusion_6months ? 'active' : ''}`}>
                  <div className="toggle-circle"></div>
                </div>
              </div>

              {formData.blood_transfusion_6months && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #ffedd5' }}>
                  <label className="form-label">Total Packed RBC Units Received</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.transfusion_units_count}
                    onChange={(e) => updateField('transfusion_units_count', e.target.value)}
                    placeholder="e.g. 2 units"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation Controls */}
        <div style={{
          marginTop: '2rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div>
            {currentStep > 0 && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handlePrev}
                style={{ padding: '0.6rem 1rem' }}
              >
                <ArrowLeft size={16} /> Back
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', flex: '1 1 auto', justifyContent: 'flex-end' }}>
            {onCancel && (
              <button type="button" className="btn btn-secondary" onClick={onCancel}>
                Cancel
              </button>
            )}
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleNext}
              style={{ minWidth: '140px' }}
            >
              {currentStep === STEPS.length - 1 ? (
                <>
                  <Sparkles size={18} /> Review Case
                </>
              ) : (
                <>
                  Next <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
