// src/components/AuthModal.jsx
import React, { useState } from 'react';
import { X, User, Mail, Building, CheckCircle2, Lock, Shield } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, doctor, onUpdateDoctor }) {
  const [formData, setFormData] = useState({
    full_name: doctor?.full_name || 'Dr. Mohammed Al-Husseini',
    email: doctor?.email || 'dr.mohammed@ibnsina.med',
    institution: doctor?.institution || 'Ibn Sina Center for Dialysis & Kidney Disease',
    title: doctor?.title || 'Consultant Nephrologist & Lead Investigator',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateDoctor(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        {/* Modal Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: '#008B8B',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Shield size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a' }}>Investigator Profile</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Authorized Healthcare Professional Credentials</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          {savedSuccess && (
            <div style={{
              padding: '0.75rem 1rem',
              background: '#d1fae5',
              border: '1px solid #a7f3d0',
              borderRadius: '8px',
              color: '#065f46',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '1rem'
            }}>
              <CheckCircle2 size={18} /> Credentials saved successfully!
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Investigator Full Name</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
                placeholder="Dr. Full Name"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Professional Email</label>
            <input
              type="email"
              className="form-input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="doctor@institution.med"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Clinical Institution / Hospital</label>
            <input
              type="text"
              className="form-input"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              required
              placeholder="Ibn Sina Center / Baghdad Hospital"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Role / Clinical Title</label>
            <input
              type="text"
              className="form-input"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Consultant Nephrologist"
            />
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop: '1px solid #e2e8f0'
          }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Credentials
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
