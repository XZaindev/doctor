// src/screens/SummaryScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, typography, borderRadius, anemiaBadgeStyles, eligibilityBadgeStyles } from '../styles/theme';
import { Badge, Button, Card } from '../components';
import { generatePatientPDF, sharePDF } from '../utils/pdfGenerator';
import { formatDate, formatNumber, calculateAnemiaSeverity } from '../utils/calculations';

export default function SummaryScreen({ route, navigation }) {
  const { patientData, doctorName } = route.params || {};
  const [isExporting, setIsExporting] = useState(false);

  if (!patientData) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>No patient data available</Text>
        <Button
          label="Go Back"
          onPress={() => navigation.goBack()}
          style={styles.button}
        />
      </View>
    );
  }

  // Get anemia severity for badge
  const anemiaSeverityData = calculateAnemiaSeverity(
    patientData.hemoglobin_g_dl,
    patientData.gender
  );

  // Handle PDF Export
  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const result = await generatePatientPDF(patientData, doctorName);

      if (result.success) {
        // Navigate to PDF export screen
        navigation.navigate('PDFExport', {
          filePath: result.filePath,
          fileName: result.fileName,
          patientData,
        });
      } else {
        Alert.alert('Error', 'Failed to generate PDF: ' + result.error);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsExporting(false);
    }
  };

  // Handle create new record
  const handleNewRecord = () => {
    navigation.replace('Wizard');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Patient Data Summary</Text>
          <Text style={styles.headerSubtitle}>Review before export</Text>
        </View>

        {/* Status Badges */}
        <View style={styles.badgeRow}>
          <Badge
            label={patientData.eligibility_status}
            backgroundColor={
              patientData.eligibility_status === 'Included'
                ? colors.success
                : colors.error
            }
            textColor={colors.textOnPrimary}
            icon={
              patientData.eligibility_status === 'Included' ? '✓' : '✕'
            }
          />
          {anemiaSeverityData && (
            <Badge
              label={anemiaSeverityData.severity}
              backgroundColor={anemiaSeverityData.color}
              textColor={
                anemiaSeverityData.color === colors.warning
                  ? '#000000'
                  : colors.textOnPrimary
              }
              icon="●"
            />
          )}
        </View>

        {/* Section: Patient Identification */}
        <SummarySection
          title="Patient Identification"
          data={[
            { label: 'Patient ID', value: patientData.patient_id },
            { label: 'Collection Date', value: formatDate(patientData.data_collection_date) },
          ]}
        />

        {/* Section: Eligibility */}
        <SummarySection
          title="Eligibility Criteria"
          data={[
            { label: 'Eligibility Status', value: patientData.eligibility_status },
            { label: 'Age ≥ 18', value: patientData.inclusion_age_18 ? 'Yes' : 'No' },
            { label: 'Permanent Dialysis ≥ 3 months', value: patientData.inclusion_dialysis_3months ? 'Yes' : 'No' },
            { label: 'Dialyzing at Ibn Sina Center', value: patientData.inclusion_dialysis_center ? 'Yes' : 'No' },
            { label: 'Informed Consent', value: patientData.inclusion_informed_consent ? 'Yes' : 'No' },
            { label: 'No severe bleeding (4 weeks)', value: patientData.exclusion_bleeding ? 'No' : 'Yes' },
            { label: 'No recent transfusion (4 weeks)', value: patientData.exclusion_transfusion ? 'No' : 'Yes' },
            { label: 'No hematologic malignancy', value: patientData.exclusion_hematologic_malignancy ? 'No' : 'Yes' },
            { label: 'No chemo/radiotherapy', value: patientData.exclusion_chemotherapy ? 'No' : 'Yes' },
            { label: 'Not pregnant', value: patientData.exclusion_pregnancy ? 'No' : 'Yes' },
          ]}
        />

        {/* Section: Demographics */}
        <SummarySection
          title="Demographics & Anthropometry"
          data={[
            { label: 'Age', value: patientData.age_years ? `${patientData.age_years} years` : 'N/A' },
            { label: 'Gender', value: patientData.gender || 'N/A' },
            { label: 'Marital Status', value: patientData.marital_status || 'N/A' },
            { label: 'Education Level', value: patientData.education_level || 'N/A' },
            { label: 'Employment Status', value: patientData.employment_status || 'N/A' },
            { label: 'Residence Type', value: patientData.residence_type || 'N/A' },
            { label: 'Weight', value: patientData.weight_kg ? `${formatNumber(patientData.weight_kg)} kg` : 'N/A' },
            { label: 'Height', value: patientData.height_cm ? `${formatNumber(patientData.height_cm)} cm` : 'N/A' },
          ]}
        />

        {/* Section: Medical History */}
        <SummarySection
          title="Medical History & Comorbidities"
          data={[
            { label: 'ESRD Cause', value: patientData.esrd_cause || 'N/A' },
            { label: 'CKD Duration', value: patientData.ckd_duration_years ? `${formatNumber(patientData.ckd_duration_years)} years` : 'N/A' },
            {
              label: 'Comorbidities',
              value: patientData.comorbidities && patientData.comorbidities.length > 0
                ? patientData.comorbidities.join(', ')
                : 'None',
            },
            { label: 'Hospitalizations (Last Year)', value: patientData.hospitalization_count || 'N/A' },
          ]}
        />

        {/* Section: Dialysis Parameters */}
        <SummarySection
          title="Dialysis Parameters"
          data={[
            {
              label: 'Dialysis Duration',
              value: patientData.dialysis_duration_value
                ? `${formatNumber(patientData.dialysis_duration_value)} ${patientData.dialysis_duration_unit}`
                : 'N/A',
            },
            { label: 'Sessions Per Week', value: patientData.dialysis_sessions_per_week || 'N/A' },
            { label: 'Session Duration', value: patientData.session_duration || 'N/A' },
            { label: 'Vascular Access Type', value: patientData.vascular_access_type || 'N/A' },
            { label: 'Kt/V', value: patientData.kt_v ? formatNumber(patientData.kt_v) : 'Not provided' },
          ]}
        />

        {/* Section: Laboratory Results */}
        <SummarySection
          title="Laboratory Results"
          data={[
            {
              label: 'Hemoglobin',
              value: patientData.hemoglobin_g_dl ? `${formatNumber(patientData.hemoglobin_g_dl)} g/dL` : 'N/A',
            },
            {
              label: 'Anemia Severity',
              value: patientData.anemia_severity || 'N/A',
              color: anemiaSeverityData?.color,
            },
            {
              label: 'Serum Ferritin',
              value: patientData.ferritin_ng_ml ? `${formatNumber(patientData.ferritin_ng_ml)} ng/mL` : 'N/A',
            },
            { label: 'TSAT', value: patientData.tsat_percent ? `${formatNumber(patientData.tsat_percent)}%` : 'N/A' },
            {
              label: 'Serum Albumin',
              value: patientData.albumin_g_dl ? `${formatNumber(patientData.albumin_g_dl)} g/dL` : 'N/A',
            },
            { label: 'CRP', value: patientData.crp_mg_l ? `${formatNumber(patientData.crp_mg_l)} mg/L` : 'N/A' },
            { label: 'iPTH', value: patientData.ipth_pg_ml ? `${formatNumber(patientData.ipth_pg_ml)} pg/mL` : 'N/A' },
          ]}
        />

        {/* Section: Treatments */}
        <SummarySection
          title="Treatments & Transfusion History"
          data={[
            {
              label: 'ESA Therapy',
              value: patientData.esa_therapy
                ? `Yes - ${patientData.esa_dose_frequency || 'Dose not specified'}`
                : 'No',
            },
            { label: 'Iron Supplementation', value: patientData.iron_supplementation || 'None' },
            { label: 'Vitamin B12', value: patientData.vitamin_b12 ? 'Yes' : 'No' },
            { label: 'Folic Acid', value: patientData.folic_acid ? 'Yes' : 'No' },
            {
              label: 'Blood Transfusion (6 months)',
              value: patientData.blood_transfusion_6months
                ? `Yes - ${patientData.transfusion_units_count || 0} units`
                : 'No',
            },
          ]}
        />

        {/* Doctor Info */}
        <Card style={styles.doctorCard}>
          <Text style={styles.doctorLabel}>Data Entered By</Text>
          <Text style={styles.doctorName}>{doctorName}</Text>
          <Text style={styles.doctorDate}>{new Date().toLocaleString()}</Text>
        </Card>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          label={isExporting ? 'Exporting...' : 'Export to PDF'}
          onPress={handleExportPDF}
          disabled={isExporting}
          style={styles.primaryButton}
        />
        <Button
          label="New Record"
          onPress={handleNewRecord}
          variant="secondary"
          style={styles.secondaryButton}
        />
      </View>
    </View>
  );
}

// Helper Component: Summary Section
function SummarySection({ title, data }) {
  return (
    <Card>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.dataGrid}>
        {data.map((item, index) => (
          <View key={index} style={styles.dataRow}>
            <Text style={styles.dataLabel}>{item.label}</Text>
            <Text
              style={[
                styles.dataValue,
                item.color && { color: item.color },
              ]}
            >
              {item.value}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl * 2,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: spacing.lg,
  },
  headerTitle: {
    fontSize: typography.size.h3,
    fontWeight: typography.weight.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: typography.size.body,
    color: colors.textSecondary,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.size.h5,
    fontWeight: typography.weight.bold,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  dataGrid: {
    gap: spacing.sm,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  dataLabel: {
    fontSize: typography.size.label,
    fontWeight: typography.weight.semibold,
    color: colors.textSecondary,
    flex: 1,
  },
  dataValue: {
    fontSize: typography.size.label,
    fontWeight: typography.weight.medium,
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'right',
  },
  doctorCard: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  doctorLabel: {
    fontSize: typography.size.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  doctorName: {
    fontSize: typography.size.h6,
    fontWeight: typography.weight.bold,
    color: colors.primary,
  },
  doctorDate: {
    fontSize: typography.size.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  errorText: {
    fontSize: typography.size.body,
    color: colors.error,
    marginBottom: spacing.lg,
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  primaryButton: {
    marginVertical: 0,
  },
  secondaryButton: {
    marginVertical: 0,
  },
  button: {
    alignSelf: 'center',
    width: '80%',
  },
});
