// src/screens/RecordsScreen.jsx
import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  FileText,
  Download,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  FileSpreadsheet,
  Calendar
} from 'lucide-react';
import { formatDate, formatNumber } from '../utils/calculations';

export default function RecordsScreen({
  patients,
  onSelectPatient,
  onNewPatient,
  onDeletePatient,
  onExportPDF
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEligibility, setFilterEligibility] = useState('ALL');
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const filteredPatients = patients.filter((pt) => {
    const matchSearch =
      pt.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pt.esrd_cause || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pt.gender || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchEligibility =
      filterEligibility === 'ALL' || pt.eligibility_status === filterEligibility;

    const matchSeverity =
      filterSeverity === 'ALL' || pt.anemia_severity === filterSeverity;

    return matchSearch && matchEligibility && matchSeverity;
  });

  const exportAllCSV = () => {
    const headers = [
      'Patient ID',
      'Collection Date',
      'Eligibility',
      'Age',
      'Gender',
      'Weight (kg)',
      'Height (cm)',
      'ESRD Cause',
      'CKD Duration (yrs)',
      'Dialysis Duration',
      'Sessions/Week',
      'Vascular Access',
      'Kt/V',
      'Hemoglobin (g/dL)',
      'Anemia Severity',
      'Ferritin (ng/mL)',
      'TSAT (%)',
      'Albumin (g/dL)',
      'CRP (mg/L)',
      'iPTH (pg/mL)',
      'ESA Therapy',
      'Iron Modality',
      'Transfusion 6m',
    ];

    const rows = patients.map((p) => [
      p.patient_id,
      p.data_collection_date,
      p.eligibility_status,
      p.age_years || '',
      p.gender || '',
      p.weight_kg || '',
      p.height_cm || '',
      `"${p.esrd_cause || ''}"`,
      p.ckd_duration_years || '',
      `"${p.dialysis_duration_value || ''} ${p.dialysis_duration_unit || ''}"`,
      `"${p.dialysis_sessions_per_week || ''}"`,
      `"${p.vascular_access_type || ''}"`,
      p.kt_v || '',
      p.hemoglobin_g_dl || '',
      p.anemia_severity || '',
      p.ferritin_ng_ml || '',
      p.tsat_percent || '',
      p.albumin_g_dl || '',
      p.crp_mg_l || '',
      p.ipth_pg_ml || '',
      p.esa_therapy ? 'Yes' : 'No',
      `"${p.iron_supplementation || ''}"`,
      p.blood_transfusion_6months ? 'Yes' : 'No',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Ibn_Sina_Anemia_Study_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      {/* Top Search & Filter Bar */}
      <div className="med-card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '400px' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '11px' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.4rem' }}
              placeholder="Search by Patient ID, Etiology, Gender..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <select
              className="form-select"
              style={{ width: 'auto' }}
              value={filterEligibility}
              onChange={(e) => setFilterEligibility(e.target.value)}
            >
              <option value="ALL">All Eligibility</option>
              <option value="Included">Included Only</option>
              <option value="Excluded">Excluded Only</option>
            </select>

            <select
              className="form-select"
              style={{ width: 'auto' }}
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
            >
              <option value="ALL">All Severity</option>
              <option value="Non-anemic">Non-anemic</option>
              <option value="Mild">Mild Anemia</option>
              <option value="Moderate">Moderate Anemia</option>
              <option value="Severe">Severe Anemia</option>
            </select>

            <button className="btn btn-secondary" onClick={exportAllCSV} title="Export entire cohort database to CSV">
              <FileSpreadsheet size={16} /> Export CSV
            </button>

            <button className="btn btn-primary" onClick={onNewPatient}>
              <Plus size={16} /> New Entry
            </button>
          </div>
        </div>
      </div>

      {/* Database Table Card */}
      <div className="med-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: '700' }}>
                <th style={{ padding: '1rem 1.25rem' }}>Patient ID</th>
                <th style={{ padding: '1rem' }}>Collection Date</th>
                <th style={{ padding: '1rem' }}>Eligibility</th>
                <th style={{ padding: '1rem' }}>Age / Sex</th>
                <th style={{ padding: '1rem' }}>Hemoglobin</th>
                <th style={{ padding: '1rem' }}>Anemia Severity</th>
                <th style={{ padding: '1rem' }}>Ferritin</th>
                <th style={{ padding: '1rem' }}>TSAT</th>
                <th style={{ padding: '1rem' }}>ESA / Iron</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                    No patient records found matching the active search or filters.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => {
                  const sevClass = (patient.anemia_severity || '').toLowerCase().replace(/ /g, '-');
                  return (
                    <tr
                      key={patient.id || patient.patient_id}
                      style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s ease' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '1rem 1.25rem', fontWeight: '700', color: '#008B8B' }}>
                        {patient.patient_id}
                      </td>
                      <td style={{ padding: '1rem', color: '#64748b' }}>
                        {formatDate(patient.data_collection_date)}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className={`status-badge ${patient.eligibility_status === 'Included' ? 'included' : 'excluded'}`}>
                          {patient.eligibility_status === 'Included' ? '✓ Included' : '✕ Excluded'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', color: '#334155' }}>
                        {patient.age_years ? `${patient.age_years}y` : '—'} / {patient.gender || '—'}
                      </td>
                      <td style={{ padding: '1rem', fontWeight: '700', color: '#0f172a' }}>
                        {patient.hemoglobin_g_dl ? `${formatNumber(patient.hemoglobin_g_dl)} g/dL` : '—'}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {patient.anemia_severity ? (
                          <span className={`status-badge ${sevClass}`}>
                            ● {patient.anemia_severity}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td style={{ padding: '1rem', color: '#475569' }}>
                        {patient.ferritin_ng_ml ? `${patient.ferritin_ng_ml} ng/mL` : '—'}
                      </td>
                      <td style={{ padding: '1rem', color: '#475569' }}>
                        {patient.tsat_percent ? `${patient.tsat_percent}%` : '—'}
                      </td>
                      <td style={{ padding: '1rem', color: '#475569', fontSize: '0.8rem' }}>
                        <div>{patient.esa_therapy ? 'ESA: Yes' : 'ESA: No'}</div>
                        <div style={{ color: '#94a3b8' }}>{patient.iron_supplementation || 'No Iron'}</div>
                      </td>
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            className="btn btn-secondary"
                            style={{ padding: '0.4rem 0.65rem', fontSize: '0.8rem' }}
                            onClick={() => onSelectPatient(patient)}
                            title="View Case Summary"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            className="btn btn-outline"
                            style={{ padding: '0.4rem 0.65rem', fontSize: '0.8rem' }}
                            onClick={() => onExportPDF(patient)}
                            title="Download Clinical PDF"
                          >
                            <Download size={15} />
                          </button>
                          <button
                            className="btn btn-secondary"
                            style={{ padding: '0.4rem 0.65rem', fontSize: '0.8rem', color: '#ef4444' }}
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete patient ${patient.patient_id}?`)) {
                                onDeletePatient(patient.id || patient.patient_id);
                              }
                            }}
                            title="Delete Record"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div style={{
          padding: '0.9rem 1.25rem',
          background: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.8rem',
          color: '#64748b'
        }}>
          <div>Showing {filteredPatients.length} of {patients.length} enrolled subjects</div>
          <div>Ibn Sina Center Dialysis Cohort</div>
        </div>
      </div>
    </div>
  );
}
