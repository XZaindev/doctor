// src/screens/PDFExportScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { colors, spacing, typography } from '../styles/theme';
import { Button, Card } from '../components';
import { sharePDF, downloadPDF } from '../utils/pdfGenerator';

export default function PDFExportScreen({ route, navigation }) {
  const { filePath, fileName, patientData } = route.params || {};
  const [isSharing, setIsSharing] = useState(false);

  if (!filePath || !fileName) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>No PDF file available</Text>
        <Button
          label="Go Back"
          onPress={() => navigation.goBack()}
          style={styles.button}
        />
      </View>
    );
  }

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const result = await sharePDF(filePath, fileName);
      if (!result?.success && result?.error) {
        Alert.alert('Share Error', result.error);
      }
    } catch (error) {
      console.error('Share error:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleDownload = async () => {
    try {
      const result = await downloadPDF(filePath, fileName);
      if (result.success) {
        Alert.alert(
          'Success',
          `PDF saved as: ${fileName}\n\nFile location: ${result.filePath}`
        );
      } else {
        Alert.alert('Error', 'Failed to download PDF');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleNewRecord = () => {
    navigation.replace('Wizard');
  };

  const handleViewSummary = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Message */}
        <View style={styles.successContainer}>
          <Text style={styles.successIcon}>✓</Text>
          <Text style={styles.successTitle}>PDF Generated Successfully!</Text>
          <Text style={styles.successSubtitle}>
            Your patient data report is ready to share
          </Text>
        </View>

        {/* File Information */}
        <Card style={styles.infoCard}>
          <Text style={styles.infoLabel}>File Name</Text>
          <Text style={styles.infoValue}>{fileName}</Text>
          <Text style={styles.infoHelp}>
            This file contains all patient information collected in the form.
          </Text>
        </Card>

        {/* Sharing Options */}
        <Text style={styles.sectionTitle}>Share Patient Report</Text>

        <Card>
          <Text style={styles.optionDescription}>
            📱 You can share this PDF via:
          </Text>
          <View style={styles.optionList}>
            <Text style={styles.optionItem}>• WhatsApp</Text>
            <Text style={styles.optionItem}>• Email</Text>
            <Text style={styles.optionItem}>• iCloud Drive / Google Drive</Text>
            <Text style={styles.optionItem}>• AirDrop / Bluetooth</Text>
            <Text style={styles.optionItem}>• Cloud storage services</Text>
          </View>
        </Card>

        {/* Data Summary */}
        <Text style={styles.sectionTitle}>Data Summary</Text>

        <Card>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Patient ID:</Text>
            <Text style={styles.summaryValue}>{patientData?.patient_id || 'N/A'}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Eligibility Status:</Text>
            <Text style={[
              styles.summaryValue,
              {
                color: patientData?.eligibility_status === 'Included'
                  ? colors.success
                  : colors.error,
              },
            ]}>
              {patientData?.eligibility_status || 'N/A'}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Hemoglobin:</Text>
            <Text style={styles.summaryValue}>
              {patientData?.hemoglobin_g_dl ? `${patientData.hemoglobin_g_dl} g/dL` : 'N/A'}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Anemia Severity:</Text>
            <Text style={styles.summaryValue}>{patientData?.anemia_severity || 'N/A'}</Text>
          </View>
        </Card>

        {/* Privacy Notice */}
        <Card style={styles.privacyCard}>
          <Text style={styles.privacyTitle}>🔒 Privacy & Security</Text>
          <Text style={styles.privacyText}>
            This PDF contains sensitive patient health information. Please ensure it is shared only with authorized personnel and through secure channels.
          </Text>
        </Card>

        {/* Instructions */}
        <Card style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>How to Share</Text>
          <Text style={styles.instructionStep}>
            1. Tap "Share PDF" to open your device's share menu
          </Text>
          <Text style={styles.instructionStep}>
            2. Select your preferred sharing method (WhatsApp, Email, etc.)
          </Text>
          <Text style={styles.instructionStep}>
            3. Review the PDF preview before sending
          </Text>
          <Text style={styles.instructionStep}>
            4. Send to the intended recipient
          </Text>
        </Card>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          label={isSharing ? 'Sharing...' : 'Share PDF'}
          onPress={handleShare}
          disabled={isSharing}
          style={styles.primaryButton}
        />
        <Button
          label="Download"
          onPress={handleDownload}
          variant="secondary"
          style={styles.secondaryButton}
        />
      </View>

      {/* Navigation Footer */}
      <View style={styles.footerButtons}>
        <Button
          label="View Summary"
          onPress={handleViewSummary}
          variant="secondary"
          size="sm"
          style={styles.footerButton}
        />
        <Button
          label="New Record"
          onPress={handleNewRecord}
          size="sm"
          style={styles.footerButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl * 3,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Success Section
  successContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingVertical: spacing.lg,
  },
  successIcon: {
    fontSize: 64,
    color: colors.success,
    marginBottom: spacing.md,
  },
  successTitle: {
    fontSize: typography.size.h3,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  successSubtitle: {
    fontSize: typography.size.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  // Info Card
  infoCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
  },
  infoLabel: {
    fontSize: typography.size.label,
    fontWeight: typography.weight.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  infoValue: {
    fontSize: typography.size.body,
    fontWeight: typography.weight.semibold,
    color: colors.primary,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.background,
    borderRadius: 4,
  },
  infoHelp: {
    fontSize: typography.size.caption,
    color: colors.textTertiary,
    marginTop: spacing.sm,
  },

  // Section Title
  sectionTitle: {
    fontSize: typography.size.h5,
    fontWeight: typography.weight.bold,
    color: colors.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },

  // Option List
  optionDescription: {
    fontSize: typography.size.body,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  optionList: {
    marginTop: spacing.md,
    paddingLeft: spacing.md,
  },
  optionItem: {
    fontSize: typography.size.body,
    color: colors.textSecondary,
    marginVertical: spacing.xs,
    lineHeight: 24,
  },

  // Summary
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  summaryLabel: {
    fontSize: typography.size.label,
    fontWeight: typography.weight.semibold,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: typography.size.label,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
  },

  // Privacy Card
  privacyCard: {
    marginTop: spacing.lg,
    backgroundColor: '#FFF3E0',
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  privacyTitle: {
    fontSize: typography.size.h6,
    fontWeight: typography.weight.bold,
    color: colors.warningMid,
    marginBottom: spacing.sm,
  },
  privacyText: {
    fontSize: typography.size.body,
    color: colors.textPrimary,
    lineHeight: 24,
  },

  // Instructions Card
  instructionsCard: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
  },
  instructionsTitle: {
    fontSize: typography.size.h6,
    fontWeight: typography.weight.bold,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  instructionStep: {
    fontSize: typography.size.body,
    color: colors.textSecondary,
    marginVertical: spacing.sm,
    lineHeight: 24,
  },

  // Button Container
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

  // Footer Buttons
  footerButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerButton: {
    flex: 1,
    marginVertical: 0,
  },

  // Error
  errorText: {
    fontSize: typography.size.body,
    color: colors.error,
    marginBottom: spacing.lg,
  },
  button: {
    alignSelf: 'center',
    width: '80%',
  },
});
