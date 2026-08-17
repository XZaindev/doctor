// src/App.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import DashboardOverview from './screens/DashboardOverview';
import WizardScreen from './screens/WizardScreen';
import SummaryScreen from './screens/SummaryScreen';
import RecordsScreen from './screens/RecordsScreen';
import AnalyticsScreen from './screens/AnalyticsScreen';
import PDFPreviewModal from './screens/PDFPreviewModal';
import { initialPatients, defaultDoctor } from './utils/mockData';
import { downloadPatientPDF } from './utils/pdfGenerator';
import { LayoutDashboard, UserPlus, FileSpreadsheet, BarChart3, User } from 'lucide-react';
import './styles/theme.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [previewPatient, setPreviewPatient] = useState(null);

  // Persistent Doctor State
  const [doctor, setDoctor] = useState(() => {
    const saved = localStorage.getItem('anemia_doctor');
    return saved ? JSON.parse(saved) : defaultDoctor;
  });

  // Persistent Patient List
  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem('anemia_patients');
    return saved ? JSON.parse(saved) : initialPatients;
  });

  // Active Patient for Wizard & Summary
  const [currentPatient, setCurrentPatient] = useState(null);
  const [isViewingSummary, setIsViewingSummary] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('anemia_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('anemia_doctor', JSON.stringify(doctor));
  }, [doctor]);

  const handleNewPatient = () => {
    setCurrentPatient(null);
    setIsViewingSummary(false);
    setActiveTab('wizard');
  };

  const handleWizardComplete = (formData) => {
    setCurrentPatient(formData);
    setIsViewingSummary(true);
  };

  const handleSaveToDatabase = (patientData) => {
    const existingIndex = patients.findIndex(
      (p) => p.id === patientData.id || p.patient_id === patientData.patient_id
    );

    if (existingIndex >= 0) {
      const updated = [...patients];
      updated[existingIndex] = { ...patientData, updated_at: new Date().toISOString() };
      setPatients(updated);
    } else {
      const newEntry = {
        ...patientData,
        id: patientData.id || `rec-${Date.now()}`,
        created_at: new Date().toISOString(),
        doctor_name: doctor.full_name,
      };
      setPatients([newEntry, ...patients]);
    }

    setIsViewingSummary(false);
    setActiveTab('records');
  };

  const handleDeletePatient = (id) => {
    setPatients((prev) => prev.filter((p) => p.id !== id && p.patient_id !== id));
  };

  const handleSelectPatient = (patient) => {
    setCurrentPatient(patient);
    setIsViewingSummary(true);
  };

  const handleExportPDF = (patientData) => {
    downloadPatientPDF(patientData, doctor?.full_name);
  };

  const handleOpenPreview = (patientData) => {
    setPreviewPatient(patientData);
  };

  return (
    <div className="app-container">
      {/* Left Desktop Sidebar */}
      <Sidebar
        activeTab={isViewingSummary ? 'summary' : activeTab}
        setActiveTab={(tab) => {
          setIsViewingSummary(false);
          setActiveTab(tab);
        }}
        doctor={doctor}
        onOpenAuth={() => setIsAuthOpen(true)}
        patientCount={patients.length}
      />

      {/* Main Content Area */}
      <main className="main-content">
        <Header
          activeTab={isViewingSummary ? 'summary' : activeTab}
          setActiveTab={setActiveTab}
          doctor={doctor}
          onNewPatient={handleNewPatient}
          onOpenAuth={() => setIsAuthOpen(true)}
        />

        <div className="page-body">
          {isViewingSummary && currentPatient ? (
            <SummaryScreen
              patientData={currentPatient}
              doctor={doctor}
              onEdit={() => setIsViewingSummary(false)}
              onSaveToDatabase={handleSaveToDatabase}
              onExportPDF={handleExportPDF}
              onOpenPreview={handleOpenPreview}
            />
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardOverview
                  patients={patients}
                  doctor={doctor}
                  onNewPatient={handleNewPatient}
                  onNavigateTab={setActiveTab}
                  onSelectPatient={handleSelectPatient}
                  onExportPDF={handleExportPDF}
                />
              )}

              {activeTab === 'wizard' && (
                <WizardScreen
                  initialData={currentPatient}
                  onCompleteWizard={handleWizardComplete}
                  onCancel={() => setActiveTab('dashboard')}
                />
              )}

              {activeTab === 'records' && (
                <RecordsScreen
                  patients={patients}
                  onSelectPatient={handleSelectPatient}
                  onNewPatient={handleNewPatient}
                  onDeletePatient={handleDeletePatient}
                  onExportPDF={handleExportPDF}
                />
              )}

              {activeTab === 'analytics' && (
                <AnalyticsScreen patients={patients} />
              )}
            </>
          )}
        </div>
      </main>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav">
        <button
          className={`mobile-nav-btn ${!isViewingSummary && activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => {
            setIsViewingSummary(false);
            setActiveTab('dashboard');
          }}
        >
          <LayoutDashboard size={20} />
          <span>Overview</span>
        </button>

        <button
          className={`mobile-nav-btn ${!isViewingSummary && activeTab === 'wizard' ? 'active' : ''}`}
          onClick={handleNewPatient}
        >
          <UserPlus size={20} />
          <span>New eCRF</span>
        </button>

        <button
          className={`mobile-nav-btn ${!isViewingSummary && activeTab === 'records' ? 'active' : ''}`}
          onClick={() => {
            setIsViewingSummary(false);
            setActiveTab('records');
          }}
        >
          <FileSpreadsheet size={20} />
          <span>Patients ({patients.length})</span>
        </button>

        <button
          className={`mobile-nav-btn ${!isViewingSummary && activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => {
            setIsViewingSummary(false);
            setActiveTab('analytics');
          }}
        >
          <BarChart3 size={20} />
          <span>Analytics</span>
        </button>

        <button
          className="mobile-nav-btn"
          onClick={() => setIsAuthOpen(true)}
        >
          <User size={20} />
          <span>Profile</span>
        </button>
      </nav>

      {/* Doctor Profile Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        doctor={doctor}
        onUpdateDoctor={setDoctor}
      />

      {/* Printable / PDF Preview Modal */}
      <PDFPreviewModal
        isOpen={!!previewPatient}
        onClose={() => setPreviewPatient(null)}
        patientData={previewPatient}
        doctor={doctor}
        onDownloadPDF={handleExportPDF}
      />
    </div>
  );
}
