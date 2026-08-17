// src/components/Sidebar.jsx
import React from 'react';
import {
  LayoutDashboard,
  UserPlus,
  FileSpreadsheet,
  BarChart3,
  Stethoscope,
  Activity,
  FileText,
  ShieldAlert,
  LogOut,
  Hospital
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, doctor, onOpenAuth, patientCount = 0 }) {
  const menuItems = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'wizard', label: 'New Patient Entry', icon: UserPlus, badge: 'Wizard' },
    { id: 'records', label: 'Patient Database', icon: FileSpreadsheet, badge: patientCount },
    { id: 'analytics', label: 'Research Analytics', icon: BarChart3, badge: null },
  ];

  return (
    <aside style={{
      width: '260px',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid #1e293b',
      flexShrink: 0,
      userSelect: 'none'
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '1.5rem 1.25rem',
        borderBottom: '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem'
      }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #008B8B, #20B2AA)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0, 139, 139, 0.4)'
        }}>
          <Stethoscope size={24} color="#ffffff" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#ffffff', margin: 0 }}>
            ANEMIA STUDY
          </h2>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Hospital size={12} /> Ibn Sina Center
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>
          Clinical Portal
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 0.9rem',
                borderRadius: '10px',
                border: 'none',
                background: isActive ? 'linear-gradient(90deg, #008B8B, #007373)' : 'transparent',
                color: isActive ? '#ffffff' : '#94a3b8',
                fontWeight: isActive ? '600' : '500',
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = '#1e293b';
                  e.currentTarget.style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#94a3b8';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Icon size={18} color={isActive ? '#ffffff' : '#64748b'} />
                <span>{item.label}</span>
              </div>
              {item.badge !== null && (
                <span style={{
                  fontSize: '0.7rem',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '999px',
                  background: isActive ? 'rgba(255,255,255,0.2)' : '#1e293b',
                  color: isActive ? '#ffffff' : '#38bdf8',
                  fontWeight: '700'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Clinical Study Protocol Info Card */}
      <div style={{
        margin: '0.75rem',
        padding: '0.9rem',
        background: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid #1e293b',
        borderRadius: '12px',
        fontSize: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#20B2AA', fontWeight: '700', marginBottom: '4px' }}>
          <Activity size={14} /> Protocol HD-ANM-26
        </div>
        <p style={{ color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
          Hemodialysis Anemia Evaluation & Iron Management protocol active.
        </p>
      </div>

      {/* Doctor Profile Footer */}
      <div style={{
        padding: '1rem',
        borderTop: '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#0b1120'
      }}>
        <div
          onClick={onOpenAuth}
          style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', cursor: 'pointer', minWidth: 0 }}
          title="Click to edit profile or switch account"
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: '#008B8B',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '0.85rem',
            flexShrink: 0
          }}>
            {doctor?.full_name ? doctor.full_name.charAt(0) : 'D'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#f8fafc', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {doctor?.full_name || 'Dr. Mohammed'}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {doctor?.title || 'Lead Investigator'}
            </div>
          </div>
        </div>

        <button
          onClick={onOpenAuth}
          style={{
            background: 'none',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '6px'
          }}
          title="Change Doctor / Login"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
