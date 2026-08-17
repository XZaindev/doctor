// src/screens/SummaryScreen.jsx
import React from 'react';
import {
  calculateAnemiaSeverity,
  calculateBMI,
  getBMICategory,
  formatDate,
  formatNumber
} from '../utils/calculations';
import {
  FileText,
  Download,
  Printer,
  Edit3,
  CheckCircle,
  Save,
  User,
  ShieldCheck,
  Activity,
  Droplet,
  Pill,
  Hospital,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SummaryScreen({
  patientData,
  doctor,
  onEdit,
  onSaveToDatabase,
  onExportPDF,
  onOpenPreview
}) {
  const anemiaInfo = calculateAnemiaSeverity(patientData.hemoglobin_g_dl, patientData.gender);
  const bmi = calculateBMI(patientData.weight_kg, patientData.height_cm);
  const bmiCat = getBMICategory(bmi);

  const handleSave = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
    onSaveToDatabase(patientData);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '950px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Top Banner Actions */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '1rem 1.25rem',
        marginBottom: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.85rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ minWidth: '220px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#008B8B', textTransform: 'uppercase' }}>
            eCRF Verification & Review
          </span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '2px 0 0 0', color: '#0f172a' }}>
            Case Summary ({patientData.patient_id})
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', width: '100%', maxWidth: '520px' }}>
          <button className="btn btn-secondary" onClick={onEdit} style={{ flex: '1 1 70px', padding: '0.55rem 0.75rem' }}>
            <Edit3 size={15} /> Edit
          </button>
          <button className="btn btn-outline" onClick={() => onOpenPreview(patientData)} style={{ flex: '1 1 120px', padding: '0.55rem 0.75rem' }}>
            <Printer size={15} /> Preview
          </button>
          <button className="btn btn-secondary" onClick={() => onExportPDF(patientData)} style={{ flex: '1 1 110px', padding: '0.55rem 0.75rem' }}>
            <Download size={15} /> PDF
          </button>
          <button className="btn btn-primary" onClick={handleSave} style={{ flex: '1 1 130px', padding: '0.55rem 0.75rem' }}>
            <Save size={15} /> Save Record
          </button>
        </div>
      </div>

      {/* Main Clinical Summary Card */}
      <div className="med-card" style={{ padding: '1.5rem' }}>
        {/* Header Block */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          borderBottom: '2px solid #008B8B',
          paddingBottom: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#008B8B', fontWeight: '800', fontSize: '1.1rem' }}>
              <Hospital size={22} /> IBN SINA HEMODIALYSIS CENTER
            </div>
            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
              Anemia in Maintenance Hemodialysis Research Study Cohort
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Date of Entry</div>
            <div style={{ fontWeight: '700', color: '#0f172a' }}>{formatDate(patientData.data_collection_date)}</div>
          </div>
        </div>

        {/* Primary Patient Status Highlights */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.75rem'
        }}>
          <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Patient Study ID</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#008B8B' }}>{patientData.patient_id}</div>
          </div>

          <div style={{
            padding: '1rem',
            background: patientData.eligibility_status === 'Included' ? '#ecfdf5' : '#fef2f2',
            borderRadius: '12px',
            border: `1.5px solid ${patientData.eligibility_status === 'Included' ? '#a7f3d0' : '#fecaca'}`
          }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Study Eligibility</div>
            <div style={{
              fontSize: '1.15rem',
              fontWeight: '800',
              color: patientData.eligibility_status === 'Included' ? '#065f46' : '#991b1b'
            }}>
              {patientData.eligibility_status === 'Included' ? '✓ Included (Eligible)' : '✕ Excluded'}
            </div>
          </div>

          <div style={{
            padding: '1rem',
            background: anemiaInfo ? `${anemiaInfo.color}15` : '#f8fafc',
            borderRadius: '12px',
            border: `1.5px solid ${anemiaInfo ? anemiaInfo.color : '#e2e8f0'}`
          }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Anemia Severity (Hb: {patientData.hemoglobin_g_dl} g/dL)</div>
            <div style={{ fontSize: '1.15rem', fontWeight: '800', color: anemiaInfo ? anemiaInfo.color : '#0f172a' }}>
              ● {anemiaInfo?.severity || 'Not assessed'}
            </div>
          </div>

          <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Calculated BMI</div>
            <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>
              {bmi ? `${bmi} kg/m²` : '—'} <span style={{ fontSize: '0.8rem', fontWeight: '600', color: bmiCat?.color }}>({bmiCat?.category})</span>
            </div>
          </div>
        </div>

        {/* Section 1: Demographics & Anthropometry */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', color: '#008B8B', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.4rem', marginBottom: '0.75rem', fontWeight: '700' }}>
            1. Demographics & Anthropometry
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.875rem' }}>
            <div><strong>Age:</strong> {patientData.age_years || '—'} years</div>
            <div><strong>Gender:</strong> {patientData.gender || '—'}</div>
            <div><strong>Marital Status:</strong> {patientData.marital_status || '—'}</div>
            <div><strong>Residence:</strong> {patientData.residence_type || '—'}</div>
            <div><strong>Education:</strong> {patientData.education_level || '—'}</div>
            <div><strong>Employment:</strong> {patientData.employment_status || '—'}</div>
            <div><strong>Weight:</strong> {patientData.weight_kg ? `${patientData.weight_kg} kg` : '—'}</div>
            <div><strong>Height:</strong> {patientData.height_cm ? `${patientData.height_cm} cm` : '—'}</div>
          </div>
        </div>

        {/* Section 2: Clinical History & Dialysis */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', color: '#008B8B', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.4rem', marginBottom: '0.75rem', fontWeight: '700' }}>
            2. Medical History & Dialysis Parameters
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', fontSize: '0.875rem' }}>
            <div><strong>ESRD Cause:</strong> {patientData.esrd_cause === 'Other' ? `Other (${patientData.esrd_cause_other})` : (patientData.esrd_cause || '—')}</div>
            <div><strong>CKD Duration:</strong> {patientData.ckd_duration_years ? `${patientData.ckd_duration_years} years` : '—'}</div>
            <div><strong>Hospitalizations (Last Year):</strong> {patientData.hospitalization_count || '—'}</div>
            <div><strong>Dialysis Vintage:</strong> {patientData.dialysis_duration_value ? `${patientData.dialysis_duration_value} ${patientData.dialysis_duration_unit}` : '—'}</div>
            <div><strong>Sessions / Week:</strong> {patientData.dialysis_sessions_per_week || '—'} ({patientData.session_duration || '—'})</div>
            <div><strong>Vascular Access:</strong> {patientData.vascular_access_type || '—'}</div>
            <div><strong>Dialysis Kt/V:</strong> {patientData.kt_v || 'Not provided'}</div>
            <div style={{ gridColumn: '1 / -1' }}>
              <strong>Comorbidities:</strong> {patientData.comorbidities?.length ? patientData.comorbidities.join(', ') : 'None'}
            </div>
          </div>
        </div>

        {/* Section 3: Laboratory Results */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', color: '#008B8B', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.4rem', marginBottom: '0.75rem', fontWeight: '700' }}>
            3. Laboratory Findings & Biomarkers
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.75rem',
            background: '#f8fafc',
            padding: '1rem',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Hemoglobin (Hb)</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#008B8B' }}>{patientData.hemoglobin_g_dl || '—'} g/dL</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Serum Ferritin</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>{patientData.ferritin_ng_ml || '—'} ng/mL</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>TSAT</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>{patientData.tsat_percent || '—'} %</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Serum Albumin</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>{patientData.albumin_g_dl || '—'} g/dL</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>C-Reactive Protein (CRP)</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>{patientData.crp_mg_l || '—'} mg/L</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Intact PTH</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>{patientData.ipth_pg_ml || '—'} pg/mL</div>
            </div>
          </div>
        </div>

        {/* Section 4: Pharmacotherapy */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', color: '#008B8B', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.4rem', marginBottom: '0.75rem', fontWeight: '700' }}>
            4. Treatments & Transfusion History
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', fontSize: '0.875rem' }}>
            <div><strong>ESA Therapy:</strong> {patientData.esa_therapy ? `Yes (${patientData.esa_dose_frequency || 'Dose unrecorded'})` : 'No'}</div>
            <div><strong>Iron Supplementation:</strong> {patientData.iron_supplementation || 'None'}</div>
            <div><strong>Vitamin B12:</strong> {patientData.vitamin_b12 ? 'Yes' : 'No'}</div>
            <div><strong>Folic Acid:</strong> {patientData.folic_acid ? 'Yes' : 'No'}</div>
            <div><strong>Transfusion (6 Months):</strong> {patientData.blood_transfusion_6months ? `Yes (${patientData.transfusion_units_count || 1} units)` : 'No'}</div>
          </div>
        </div>

        {/* Investigator Certification Signature */}
        <div style={{
          marginTop: '2rem',
          padding: '1.25rem',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Investigator Certification</div>
            <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.95rem' }}>{doctor?.full_name || 'Dr. Mohammed'}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{doctor?.institution || 'Ibn Sina Center'}</div>
          </div>
          <div style={{
            fontFamily: 'serif',
            fontStyle: 'italic',
            fontSize: '1.2rem',
            color: '#008B8B',
            borderBottom: '1px dashed #94a3b8',
            padding: '0.25rem 1.5rem'
          }}>
            {doctor?.full_name || 'Dr. Mohammed'}
          </div>
        </div>
      </div>
    </div>
  );
}
