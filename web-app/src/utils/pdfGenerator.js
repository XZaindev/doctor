// src/utils/pdfGenerator.js
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDate, formatNumber, calculateBMI, getBMICategory } from './calculations';

/**
 * Generate and download a clinical PDF report for a patient
 * @param {object} patientData
 * @param {string} doctorName
 */
export const downloadPatientPDF = (patientData, doctorName = 'Dr. Mohammed Al-Husseini') => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryTeal = [0, 139, 139]; // #008B8B
  const textDark = [15, 23, 42];
  const grayLight = [241, 245, 249];

  // Header Banner
  doc.setFillColor(...primaryTeal);
  doc.rect(0, 0, 210, 26, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('IBN SINA HEMODIALYSIS CENTER - ANEMIA RESEARCH STUDY', 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Comprehensive Clinical Patient Data & Laboratory Report', 14, 18);

  // Meta bar
  doc.setTextColor(...textDark);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`Patient ID: ${patientData.patient_id || 'N/A'}`, 14, 34);
  doc.text(`Collection Date: ${formatDate(patientData.data_collection_date)}`, 85, 34);
  doc.text(`Investigator: ${doctorName}`, 145, 34);

  // Status Badges
  const isIncluded = patientData.eligibility_status === 'Included';
  doc.setFillColor(isIncluded ? 209 : 254, isIncluded ? 250 : 226, isIncluded ? 229 : 226);
  doc.roundedRect(14, 38, 55, 7, 2, 2, 'F');
  doc.setTextColor(isIncluded ? 6 : 153, isIncluded ? 95 : 27, isIncluded ? 70 : 27);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`Study Eligibility: ${patientData.eligibility_status || 'N/A'}`, 17, 43);

  if (patientData.anemia_severity) {
    const sev = patientData.anemia_severity;
    let bg = [254, 243, 199];
    let txt = [146, 64, 14];
    if (sev === 'Non-anemic') { bg = [209, 250, 229]; txt = [6, 95, 70]; }
    if (sev === 'Severe') { bg = [254, 226, 226]; txt = [153, 27, 27]; }
    
    doc.setFillColor(...bg);
    doc.roundedRect(73, 38, 55, 7, 2, 2, 'F');
    doc.setTextColor(...txt);
    doc.text(`Anemia Severity: ${sev}`, 76, 43);
  }

  // 1. Demographics Table
  const bmiVal = calculateBMI(patientData.weight_kg, patientData.height_cm);
  const bmiCat = getBMICategory(bmiVal);

  autoTable(doc, {
    startY: 48,
    head: [['1. Demographics & Anthropometry', 'Value']],
    body: [
      ['Age / Gender', `${patientData.age_years ? patientData.age_years + ' years' : '—'} / ${patientData.gender || '—'}`],
      ['Marital / Residence Status', `${patientData.marital_status || '—'} / ${patientData.residence_type || '—'}`],
      ['Education / Employment', `${patientData.education_level || '—'} / ${patientData.employment_status || '—'}`],
      ['Weight / Height / BMI', `${patientData.weight_kg ? patientData.weight_kg + ' kg' : '—'} / ${patientData.height_cm ? patientData.height_cm + ' cm' : '—'} (${bmiVal ? `${bmiVal} kg/m² - ${bmiCat?.category || ''}` : '—'})`],
    ],
    theme: 'grid',
    headStyles: { fillColor: primaryTeal, textColor: 255, fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 8.5, textColor: textDark },
    columnStyles: { 0: { cellWidth: 70, fontStyle: 'bold' } },
    margin: { left: 14, right: 14 },
  });

  // 2. Medical History & Dialysis
  const comorbiditiesText = Array.isArray(patientData.comorbidities)
    ? (patientData.comorbidities.length ? patientData.comorbidities.join(', ') : 'None reported')
    : (patientData.comorbidities || 'None reported');

  const y1 = (doc.lastAutoTable && doc.lastAutoTable.finalY) ? doc.lastAutoTable.finalY : 75;

  autoTable(doc, {
    startY: y1 + 4,
    head: [['2. Clinical History & Dialysis Parameters', 'Value']],
    body: [
      ['Primary Cause of ESRD', patientData.esrd_cause === 'Other' ? `Other: ${patientData.esrd_cause_other || '—'}` : (patientData.esrd_cause || '—')],
      ['CKD Duration / Hospitalizations', `${patientData.ckd_duration_years ? patientData.ckd_duration_years + ' years' : '—'} / ${patientData.hospitalization_count || '—'}`],
      ['Associated Comorbidities', comorbiditiesText],
      ['Dialysis Regimen', `${patientData.dialysis_duration_value ? `${patientData.dialysis_duration_value} ${patientData.dialysis_duration_unit || ''}` : '—'} | ${patientData.dialysis_sessions_per_week || '—'} (${patientData.session_duration || '—'})`],
      ['Vascular Access & Kt/V', `${patientData.vascular_access_type || '—'} | Kt/V: ${patientData.kt_v || 'Not provided'}`],
    ],
    theme: 'grid',
    headStyles: { fillColor: [32, 178, 170], textColor: 255, fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 8.5, textColor: textDark },
    columnStyles: { 0: { cellWidth: 70, fontStyle: 'bold' } },
    margin: { left: 14, right: 14 },
  });

  // 3. Laboratory Findings
  const y2 = (doc.lastAutoTable && doc.lastAutoTable.finalY) ? doc.lastAutoTable.finalY : 120;

  autoTable(doc, {
    startY: y2 + 4,
    head: [['3. Laboratory Investigation', 'Result', 'Reference Context']],
    body: [
      ['Hemoglobin (Hb)', `${formatNumber(patientData.hemoglobin_g_dl)} g/dL`, `Severity: ${patientData.anemia_severity || '—'}`],
      ['Serum Ferritin', `${formatNumber(patientData.ferritin_ng_ml)} ng/mL`, 'Target in HD: 200 - 500 ng/mL'],
      ['TSAT (Transferrin Saturation)', `${formatNumber(patientData.tsat_percent)} %`, 'Target in HD: ≥ 20 - 30%'],
      ['Serum Albumin', `${formatNumber(patientData.albumin_g_dl)} g/dL`, 'Nutritional status marker (≥ 4.0 g/dL)'],
      ['C-Reactive Protein (CRP)', `${formatNumber(patientData.crp_mg_l)} mg/L`, 'Inflammatory marker (< 5.0 mg/L)'],
      ['Intact PTH (iPTH)', `${formatNumber(patientData.ipth_pg_ml)} pg/mL`, 'Target in CKD-5D: 150 - 300 pg/mL'],
    ],
    theme: 'grid',
    headStyles: { fillColor: primaryTeal, textColor: 255, fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 8.5, textColor: textDark },
    columnStyles: { 0: { cellWidth: 60, fontStyle: 'bold' }, 1: { cellWidth: 45 } },
    margin: { left: 14, right: 14 },
  });

  // 4. Pharmacotherapy & Transfusions
  const y3 = (doc.lastAutoTable && doc.lastAutoTable.finalY) ? doc.lastAutoTable.finalY : 175;

  autoTable(doc, {
    startY: y3 + 4,
    head: [['4. Pharmacotherapy & Transfusion History', 'Details']],
    body: [
      ['Erythropoiesis-Stimulating Agent (ESA)', patientData.esa_therapy ? `Yes (${patientData.esa_dose_frequency || 'Dose not specified'})` : 'No ESA therapy'],
      ['Iron Supplementation', patientData.iron_supplementation || 'None'],
      ['Vitamin Adjuvants', `Vitamin B12: ${patientData.vitamin_b12 ? 'Yes' : 'No'} | Folic Acid: ${patientData.folic_acid ? 'Yes' : 'No'}`],
      ['Blood Transfusion (Last 6 Months)', patientData.blood_transfusion_6months ? `Yes (${patientData.transfusion_units_count || 1} units received)` : 'None in past 6 months'],
    ],
    theme: 'grid',
    headStyles: { fillColor: [32, 178, 170], textColor: 255, fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 8.5, textColor: textDark },
    columnStyles: { 0: { cellWidth: 70, fontStyle: 'bold' } },
    margin: { left: 14, right: 14 },
  });

  // Footer & Signature Area
  const finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY ? doc.lastAutoTable.finalY : 230) + 8;
  if (finalY < 265) {
    doc.setDrawColor(200, 200, 200);
    doc.line(14, finalY + 12, 75, finalY + 12);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Investigator Signature & Stamp', 14, finalY + 16);

    doc.line(135, finalY + 12, 196, finalY + 12);
    doc.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 135, finalY + 16);
  }

  const fileName = `Anemia_Study_${patientData.patient_id || 'Patient'}_${new Date().toISOString().slice(0,10)}.pdf`;
  doc.save(fileName);
  return fileName;
};
