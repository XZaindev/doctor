// src/screens/DashboardOverview.jsx
import React from 'react';
import {
  Users,
  UserPlus,
  FileSpreadsheet,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Droplet,
  Hospital,
  ArrowRight,
  ShieldCheck,
  Download,
  Calendar,
  FileText
} from 'lucide-react';
import { formatDate, formatNumber } from '../utils/calculations';

export default function DashboardOverview({
  patients,
  doctor,
  onNewPatient,
  onNavigateTab,
  onSelectPatient,
  onExportPDF
}) {
  const total = patients.length;
  const includedCount = patients.filter((p) => p.eligibility_status === 'Included').length;
  const severeCount = patients.filter((p) => p.anemia_severity === 'Severe').length;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      {/* Welcome Clinical Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #008B8B, #005F5F)',
        color: '#ffffff',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        boxShadow: '0 8px 20px rgba(0, 139, 139, 0.22)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.25rem'
      }}>
        <div style={{ maxWidth: '620px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '0.25rem 0.75rem',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: '600',
            marginBottom: '0.6rem'
          }}>
            <Hospital size={13} /> Ibn Sina Center for Dialysis
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: '800', margin: '0 0 0.4rem 0', color: '#ffffff' }}>
            Welcome, {doctor?.full_name || 'Dr. Mohammed'}!
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#e0f2f1', margin: 0, lineHeight: 1.45 }}>
            Electronic Case Report Form (eCRF) & Data Collection for Anemia & Iron Management Study.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '0.6rem', width: '100%', maxWidth: '380px' }}>
          <button
            className="btn"
            onClick={onNewPatient}
            style={{
              background: '#ffffff',
              color: '#008B8B',
              fontWeight: '700',
              padding: '0.65rem 1.1rem',
              borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              flex: '1 1 160px',
              fontSize: '0.88rem'
            }}
          >
            <UserPlus size={16} /> New eCRF
          </button>
          <button
            className="btn"
            onClick={() => onNavigateTab('records')}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '0.65rem 1.1rem',
              borderRadius: '10px',
              flex: '1 1 150px',
              fontSize: '0.88rem'
            }}
          >
            <FileSpreadsheet size={16} /> Patient Registry
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        <div className="med-card" style={{ borderLeft: '4px solid #008B8B' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700' }}>TOTAL COHORT</span>
            <Users size={18} color="#008B8B" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>{total}</div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>Enrolled study patients</div>
        </div>

        <div className="med-card" style={{ borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: '700' }}>INCLUDED / ELIGIBLE</span>
            <CheckCircle size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#059669' }}>
            {includedCount}
            <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500', marginLeft: '6px' }}>
              ({total ? Math.round((includedCount / total) * 100) : 0}%)
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>Passed all inclusion criteria</div>
        </div>

        <div className="med-card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#dc2626', fontWeight: '700' }}>SEVERE ANEMIA (&lt;8 g/dL)</span>
            <Droplet size={18} color="#ef4444" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#dc2626' }}>{severeCount}</div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>Require high-priority review</div>
        </div>

        <div className="med-card" style={{ borderLeft: '4px solid #3b82f6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: '700' }}>RESEARCH STATUS</span>
            <ShieldCheck size={18} color="#3b82f6" />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>Active Study</div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>Ibn Sina Center Dialysis Cohort</div>
        </div>
      </div>

      {/* Recent Enrolled Patients Table */}
      <div className="med-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Recent Patient Enrollments
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Latest data collection submissions</span>
          </div>

          <button
            className="btn btn-outline"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
            onClick={() => onNavigateTab('records')}
          >
            View All ({patients.length}) <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: '700' }}>
                <th style={{ padding: '0.9rem 1.25rem' }}>Patient ID</th>
                <th style={{ padding: '0.9rem' }}>Date</th>
                <th style={{ padding: '0.9rem' }}>Status</th>
                <th style={{ padding: '0.9rem' }}>Age/Sex</th>
                <th style={{ padding: '0.9rem' }}>Hemoglobin</th>
                <th style={{ padding: '0.9rem' }}>Severity</th>
                <th style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {patients.slice(0, 5).map((pt) => {
                const sevClass = (pt.anemia_severity || '').toLowerCase().replace(/ /g, '-');
                return (
                  <tr
                    key={pt.id || pt.patient_id}
                    style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 0.15s ease' }}
                    onClick={() => onSelectPatient(pt)}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '0.9rem 1.25rem', fontWeight: '700', color: '#008B8B' }}>
                      {pt.patient_id}
                    </td>
                    <td style={{ padding: '0.9rem', color: '#64748b' }}>
                      {formatDate(pt.data_collection_date)}
                    </td>
                    <td style={{ padding: '0.9rem' }}>
                      <span className={`status-badge ${pt.eligibility_status === 'Included' ? 'included' : 'excluded'}`}>
                        {pt.eligibility_status}
                      </span>
                    </td>
                    <td style={{ padding: '0.9rem', color: '#334155' }}>
                      {pt.age_years}y / {pt.gender}
                    </td>
                    <td style={{ padding: '0.9rem', fontWeight: '700', color: '#0f172a' }}>
                      {pt.hemoglobin_g_dl ? `${formatNumber(pt.hemoglobin_g_dl)} g/dL` : '—'}
                    </td>
                    <td style={{ padding: '0.9rem' }}>
                      {pt.anemia_severity ? (
                        <span className={`status-badge ${sevClass}`}>
                          ● {pt.anemia_severity}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onExportPDF(pt);
                        }}
                      >
                        <Download size={14} /> PDF
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
