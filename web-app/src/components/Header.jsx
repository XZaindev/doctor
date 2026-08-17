// src/components/Header.jsx
import React from 'react';
import { Stethoscope, PlusCircle, Search, ShieldCheck, Download } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, doctor, onNewPatient }) {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Research Study Dashboard',
          subtitle: 'Ibn Sina Center for Dialysis & Kidney Disease — Anemia Cohort',
        };
      case 'wizard':
        return {
          title: 'Patient Data Collection Wizard',
          subtitle: '7-Step Standardized Electronic Case Report Form (eCRF)',
        };
      case 'records':
        return {
          title: 'Enrolled Patient Database',
          subtitle: 'Search, filter, review, and export individual patient medical records',
        };
      case 'analytics':
        return {
          title: 'Clinical Data Analytics',
          subtitle: 'Statistical summary of anemia staging, biomarkers, and therapies',
        };
      default:
        return {
          title: 'Anemia Research Portal',
          subtitle: 'Hemodialysis Data Collection System',
        };
    }
  };

  const { title, subtitle } = getTabTitle();

  return (
    <header style={{
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: '1.25rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      <div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
          {title}
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '2px 0 0 0' }}>
          {subtitle}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {activeTab !== 'wizard' && (
          <button
            onClick={onNewPatient}
            className="btn btn-primary"
            style={{ padding: '0.6rem 1.1rem', fontSize: '0.875rem' }}
          >
            <PlusCircle size={17} />
            <span>New Patient Entry</span>
          </button>
        )}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '0.45rem 0.85rem',
          background: '#f0fdfa',
          border: '1px solid #a7f3d0',
          borderRadius: '999px',
          color: '#065f46',
          fontSize: '0.8rem',
          fontWeight: '600'
        }}>
          <ShieldCheck size={15} />
          <span>IRB Approved Study</span>
        </div>
      </div>
    </header>
  );
}
