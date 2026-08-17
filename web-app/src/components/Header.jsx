// src/components/Header.jsx
import React from 'react';
import { PlusCircle, ShieldCheck, Stethoscope, User } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, doctor, onNewPatient, onOpenAuth }) {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Research Study Dashboard',
          subtitle: 'Ibn Sina Center for Dialysis & Kidney Disease',
        };
      case 'wizard':
        return {
          title: 'Patient eCRF Wizard',
          subtitle: '7-Step Standardized Electronic Case Report Form',
        };
      case 'records':
        return {
          title: 'Patient Database',
          subtitle: 'Review and export patient medical records',
        };
      case 'analytics':
        return {
          title: 'Clinical Analytics',
          subtitle: 'Statistical summary of anemia staging & biomarkers',
        };
      case 'summary':
        return {
          title: 'Patient Case Summary',
          subtitle: 'Verification, certification & PDF generation',
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
      padding: '0.85rem 1.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
        {/* Mobile Mini Logo */}
        <div style={{
          width: '34px',
          height: '34px',
          borderRadius: '9px',
          background: 'linear-gradient(135deg, #008B8B, #20B2AA)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Stethoscope size={18} color="#ffffff" />
        </div>

        <div style={{ minWidth: 0, overflow: 'hidden' }}>
          <h1 style={{
            fontSize: '1.15rem',
            fontWeight: '800',
            color: '#0f172a',
            margin: 0,
            letterSpacing: '-0.02em',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden'
          }}>
            {title}
          </h1>
          <p style={{
            fontSize: '0.75rem',
            color: '#64748b',
            margin: 0,
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden'
          }}>
            {subtitle}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
        {activeTab !== 'wizard' && (
          <button
            onClick={onNewPatient}
            className="btn btn-primary"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem', borderRadius: '8px' }}
          >
            <PlusCircle size={15} />
            <span>New eCRF</span>
          </button>
        )}

        <button
          onClick={onOpenAuth}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: '#008B8B',
            color: '#ffffff',
            border: 'none',
            fontWeight: '700',
            fontSize: '0.8rem',
            cursor: 'pointer'
          }}
          title={doctor?.full_name || 'Doctor Profile'}
        >
          {doctor?.full_name ? doctor.full_name.charAt(0) : <User size={16} />}
        </button>
      </div>
    </header>
  );
}
