// src/screens/AnalyticsScreen.jsx
import React from 'react';
import {
  BarChart3,
  Users,
  CheckCircle,
  XCircle,
  Activity,
  Droplet,
  Pill,
  TrendingUp,
  Percent
} from 'lucide-react';
import { formatNumber } from '../utils/calculations';

export default function AnalyticsScreen({ patients = [] }) {
  const total = patients.length;
  const includedCount = patients.filter((p) => p.eligibility_status === 'Included').length;
  const excludedCount = patients.filter((p) => p.eligibility_status === 'Excluded').length;

  const severityCounts = {
    'Non-anemic': patients.filter((p) => p.anemia_severity === 'Non-anemic').length,
    'Mild': patients.filter((p) => p.anemia_severity === 'Mild').length,
    'Moderate': patients.filter((p) => p.anemia_severity === 'Moderate').length,
    'Severe': patients.filter((p) => p.anemia_severity === 'Severe').length,
  };

  const hbValues = patients
    .map((p) => parseFloat(p.hemoglobin_g_dl))
    .filter((v) => !isNaN(v));
  const avgHb = hbValues.length
    ? (hbValues.reduce((a, b) => a + b, 0) / hbValues.length).toFixed(1)
    : '—';

  const esaCount = patients.filter((p) => p.esa_therapy).length;
  const ivIronCount = patients.filter((p) => p.iron_supplementation === 'Intravenous (IV) Iron').length;
  const oralIronCount = patients.filter((p) => p.iron_supplementation === 'Oral Iron').length;

  // Access types
  const accessCounts = patients.reduce((acc, p) => {
    const key = p.vascular_access_type || 'Unspecified';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  // ESRD causes
  const causeCounts = patients.reduce((acc, p) => {
    const key = p.esrd_cause || 'Unspecified';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      {/* KPI Top Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '1.5rem'
      }}>
        <div className="med-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: '#e0f2f1',
            color: '#008B8B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Total Patients Enrolled</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>{total}</div>
          </div>
        </div>

        <div className="med-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: '#d1fae5',
            color: '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Eligible (Included)</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#059669' }}>
              {includedCount} <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>({total ? Math.round((includedCount / total) * 100) : 0}%)</span>
            </div>
          </div>
        </div>

        <div className="med-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: '#fee2e2',
            color: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Droplet size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Mean Hemoglobin (Hb)</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>
              {avgHb} <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>g/dL</span>
            </div>
          </div>
        </div>

        <div className="med-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: '#e0f2fe',
            color: '#0284c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Pill size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>ESA Utilization Rate</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0284c7' }}>
              {total ? Math.round((esaCount / total) * 100) : 0}% <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>({esaCount}/{total})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Visual Panels Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {/* Anemia Severity Distribution */}
        <div className="med-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} color="#008B8B" /> Anemia Severity Breakdown
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { label: 'Non-anemic (Target)', count: severityCounts['Non-anemic'], color: '#10B981', bg: '#d1fae5' },
              { label: 'Mild Anemia', count: severityCounts['Mild'], color: '#F59E0B', bg: '#fef3c7' },
              { label: 'Moderate Anemia', count: severityCounts['Moderate'], color: '#F97316', bg: '#ffedd5' },
              { label: 'Severe Anemia (<8 g/dL)', count: severityCounts['Severe'], color: '#EF4444', bg: '#fee2e2' },
            ].map((item) => {
              const pct = total ? Math.round((item.count / total) * 100) : 0;
              return (
                <div key={item.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: '600', marginBottom: '4px' }}>
                    <span style={{ color: '#334155' }}>{item.label}</span>
                    <span style={{ color: item.color }}>{item.count} pts ({pct}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '10px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: item.color, borderRadius: '999px', transition: 'width 0.4s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Primary ESRD Causes */}
        <div className="med-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={20} color="#008B8B" /> Primary ESRD Etiology
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {Object.entries(causeCounts).map(([cause, count]) => {
              const pct = total ? Math.round((count / total) * 100) : 0;
              return (
                <div key={cause}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>
                    <span style={{ color: '#334155' }}>{cause}</span>
                    <span style={{ color: '#008B8B' }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: '#008B8B', borderRadius: '999px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vascular Access Distribution */}
        <div className="med-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.25rem' }}>
            Vascular Access Modality
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {Object.entries(accessCounts).map(([access, count]) => {
              const pct = total ? Math.round((count / total) * 100) : 0;
              return (
                <div key={access} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#334155' }}>{access}</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '800', color: '#0284c7' }}>{count} pts ({pct}%)</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Iron Supplementation */}
        <div className="med-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.25rem' }}>
            Iron Therapy Distribution
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: '#f0fdfa', borderRadius: '12px', border: '1px solid #a7f3d0', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: '#065f46', fontWeight: '600' }}>IV Iron (Iron Sucrose)</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#008B8B' }}>{ivIronCount}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{total ? Math.round((ivIronCount / total) * 100) : 0}% of cohort</div>
            </div>

            <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: '#475569', fontWeight: '600' }}>Oral Iron / None</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#475569' }}>{oralIronCount + (total - ivIronCount - oralIronCount)}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{total ? Math.round(((total - ivIronCount) / total) * 100) : 0}% of cohort</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
