// src/screens/PDFPreviewModal.jsx
import React from 'react';
import { X, Download, Printer, ShieldCheck, Hospital, FileText, CheckCircle2 } from 'lucide-react';
import { formatDate, formatNumber, calculateBMI, getBMICategory, calculateAnemiaSeverity } from '../utils/calculations';

export default function PDFPreviewModal({ isOpen, onClose, patientData, doctor, onDownloadPDF }) {
  if (!isOpen || !patientData) return null;

  const anemiaInfo = calculateAnemiaSeverity(patientData.hemoglobin_g_dl, patientData.gender);
  const bmi = calculateBMI(patientData.weight_kg, patientData.height_cm);
  const bmiCat = getBMICategory(bmi);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '850px', background: '#e2e8f0', padding: '1.25rem' }}
      >
        {/* Top Control Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.6rem',
          background: '#0f172a',
          color: '#ffffff',
          padding: '0.75rem 1rem',
          borderRadius: '12px',
          marginBottom: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <FileText size={18} color="#20B2AA" style={{ flexShrink: 0 }} />
            <span style={{ fontWeight: '700', fontSize: '0.85rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              Report: {patientData.patient_id}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem', minHeight: '34px' }}
              onClick={handlePrint}
            >
              <Printer size={14} /> Print
            </button>
            <button
              className="btn btn-primary"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem', minHeight: '34px' }}
              onClick={() => onDownloadPDF(patientData)}
            >
              <Download size={14} /> PDF
            </button>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px', marginLeft: '4px' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Paper A4 Viewport Container */}
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <div
            id="printable-report"
            style={{
              background: '#ffffff',
              borderRadius: '8px',
              padding: '1.5rem',
              minWidth: '580px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              color: '#0f172a',
              fontFamily: 'sans-serif',
              fontSize: '0.85rem',
              lineHeight: '1.4'
            }}
          >
          {/* Header Banner */}
          <div style={{ borderBottom: '3px solid #008B8B', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h1 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#008B8B', margin: 0 }}>
                  IBN SINA HEMODIALYSIS CENTER
                </h1>
                <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#334155' }}>
                  Anemia in Maintenance Hemodialysis Research Study
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Standardized Electronic Clinical Case Report Form (eCRF)
                </div>
              </div>

              <div style={{ textAlign: 'right', fontSize: '0.8rem' }}>
                <div><strong>Patient ID:</strong> <span style={{ color: '#008B8B', fontWeight: '800' }}>{patientData.patient_id}</span></div>
                <div><strong>Date:</strong> {formatDate(patientData.data_collection_date)}</div>
                <div><strong>Doctor:</strong> {doctor?.full_name || 'Dr. Mohammed'}</div>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{
              padding: '0.35rem 0.8rem',
              borderRadius: '6px',
              fontWeight: '700',
              fontSize: '0.8rem',
              background: patientData.eligibility_status === 'Included' ? '#d1fae5' : '#fee2e2',
              color: patientData.eligibility_status === 'Included' ? '#065f46' : '#991b1b',
              border: '1px solid #cbd5e1'
            }}>
              Study Status: {patientData.eligibility_status}
            </div>

            {anemiaInfo && (
              <div style={{
                padding: '0.35rem 0.8rem',
                borderRadius: '6px',
                fontWeight: '700',
                fontSize: '0.8rem',
                background: '#fef3c7',
                color: '#92400e',
                border: '1px solid #fde68a'
              }}>
                Anemia Severity: {anemiaInfo.severity} (Hb: {patientData.hemoglobin_g_dl} g/dL)
              </div>
            )}
          </div>

          {/* Table 1: Demographics */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ background: '#008B8B', color: '#fff', padding: '0.4rem 0.75rem', fontWeight: '700', borderRadius: '4px 4px 0 0' }}>
              1. Demographics & Anthropometry
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #cbd5e1' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.5rem', width: '30%', fontWeight: '600', background: '#f8fafc' }}>Age / Gender</td>
                  <td style={{ padding: '0.5rem' }}>{patientData.age_years || '—'} years / {patientData.gender || '—'}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.5rem', fontWeight: '600', background: '#f8fafc' }}>Marital Status / Residence</td>
                  <td style={{ padding: '0.5rem' }}>{patientData.marital_status || '—'} / {patientData.residence_type || '—'}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.5rem', fontWeight: '600', background: '#f8fafc' }}>Education / Employment</td>
                  <td style={{ padding: '0.5rem' }}>{patientData.education_level || '—'} / {patientData.employment_status || '—'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem', fontWeight: '600', background: '#f8fafc' }}>Weight / Height / BMI</td>
                  <td style={{ padding: '0.5rem' }}>
                    {patientData.weight_kg ? `${patientData.weight_kg} kg` : '—'} / {patientData.height_cm ? `${patientData.height_cm} cm` : '—'}
                    {bmi && ` (BMI: ${bmi} kg/m² - ${bmiCat?.category})`}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Table 2: Clinical & Dialysis */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ background: '#20B2AA', color: '#fff', padding: '0.4rem 0.75rem', fontWeight: '700', borderRadius: '4px 4px 0 0' }}>
              2. Medical History & Dialysis Parameters
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #cbd5e1' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.5rem', width: '30%', fontWeight: '600', background: '#f8fafc' }}>Primary Cause of ESRD</td>
                  <td style={{ padding: '0.5rem' }}>{patientData.esrd_cause === 'Other' ? `Other (${patientData.esrd_cause_other})` : (patientData.esrd_cause || '—')}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.5rem', fontWeight: '600', background: '#f8fafc' }}>CKD Duration / Hospitalizations</td>
                  <td style={{ padding: '0.5rem' }}>{patientData.ckd_duration_years ? `${patientData.ckd_duration_years} years` : '—'} / {patientData.hospitalization_count || '—'}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.5rem', fontWeight: '600', background: '#f8fafc' }}>Dialysis Regimen & Access</td>
                  <td style={{ padding: '0.5rem' }}>
                    {patientData.dialysis_duration_value ? `${patientData.dialysis_duration_value} ${patientData.dialysis_duration_unit}` : '—'} | {patientData.dialysis_sessions_per_week || '—'} | {patientData.vascular_access_type || '—'}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem', fontWeight: '600', background: '#f8fafc' }}>Comorbidities</td>
                  <td style={{ padding: '0.5rem' }}>{patientData.comorbidities?.length ? patientData.comorbidities.join(', ') : 'None'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Table 3: Laboratory */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ background: '#008B8B', color: '#fff', padding: '0.4rem 0.75rem', fontWeight: '700', borderRadius: '4px 4px 0 0' }}>
              3. Laboratory Investigation
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #cbd5e1' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1', fontSize: '0.8rem' }}>
                  <th style={{ padding: '0.4rem', textAlign: 'left' }}>Biomarker</th>
                  <th style={{ padding: '0.4rem', textAlign: 'left' }}>Result</th>
                  <th style={{ padding: '0.4rem', textAlign: 'left' }}>Clinical Reference Context</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.4rem 0.5rem', fontWeight: '600' }}>Hemoglobin (Hb)</td>
                  <td style={{ padding: '0.4rem 0.5rem', fontWeight: '700', color: '#008B8B' }}>{patientData.hemoglobin_g_dl || '—'} g/dL</td>
                  <td style={{ padding: '0.4rem 0.5rem', color: '#64748b' }}>Severity: {patientData.anemia_severity || '—'}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.4rem 0.5rem', fontWeight: '600' }}>Serum Ferritin</td>
                  <td style={{ padding: '0.4rem 0.5rem' }}>{patientData.ferritin_ng_ml || '—'} ng/mL</td>
                  <td style={{ padding: '0.4rem 0.5rem', color: '#64748b' }}>Target in HD: 200–500 ng/mL</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.4rem 0.5rem', fontWeight: '600' }}>TSAT</td>
                  <td style={{ padding: '0.4rem 0.5rem' }}>{patientData.tsat_percent || '—'} %</td>
                  <td style={{ padding: '0.4rem 0.5rem', color: '#64748b' }}>Target in HD: ≥ 20%</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.4rem 0.5rem', fontWeight: '600' }}>Serum Albumin</td>
                  <td style={{ padding: '0.4rem 0.5rem' }}>{patientData.albumin_g_dl || '—'} g/dL</td>
                  <td style={{ padding: '0.4rem 0.5rem', color: '#64748b' }}>Target: ≥ 4.0 g/dL</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.4rem 0.5rem', fontWeight: '600' }}>CRP / iPTH</td>
                  <td style={{ padding: '0.4rem 0.5rem' }}>{patientData.crp_mg_l || '—'} mg/L / {patientData.ipth_pg_ml || '—'} pg/mL</td>
                  <td style={{ padding: '0.4rem 0.5rem', color: '#64748b' }}>Inflammation & Mineral Bone Disease Markers</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Table 4: Treatments */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ background: '#20B2AA', color: '#fff', padding: '0.4rem 0.75rem', fontWeight: '700', borderRadius: '4px 4px 0 0' }}>
              4. Pharmacotherapy & Transfusions
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #cbd5e1' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.5rem', width: '30%', fontWeight: '600', background: '#f8fafc' }}>ESA Therapy</td>
                  <td style={{ padding: '0.5rem' }}>{patientData.esa_therapy ? `Yes (${patientData.esa_dose_frequency || 'Dose unrecorded'})` : 'No ESA'}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.5rem', fontWeight: '600', background: '#f8fafc' }}>Iron Supplementation</td>
                  <td style={{ padding: '0.5rem' }}>{patientData.iron_supplementation || 'None'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem', fontWeight: '600', background: '#f8fafc' }}>Transfusion (6m) / Adjuvants</td>
                  <td style={{ padding: '0.5rem' }}>
                    {patientData.blood_transfusion_6months ? `Yes (${patientData.transfusion_units_count || 1} units)` : 'No recent transfusions'} | Vit B12: {patientData.vitamin_b12 ? 'Yes' : 'No'} | Folate: {patientData.folic_acid ? 'Yes' : 'No'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Signatures */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px dashed #cbd5e1' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Investigator Signature:</div>
              <div style={{ fontFamily: 'serif', fontStyle: 'italic', fontSize: '1.2rem', color: '#008B8B', marginTop: '4px' }}>
                {doctor?.full_name || 'Dr. Mohammed'}
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#64748b' }}>
              <div>Ibn Sina Hemodialysis Research Unit</div>
              <div>Generated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
