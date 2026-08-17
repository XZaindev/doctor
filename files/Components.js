// src/components/index.js
import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Switch,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../styles/theme';

const { width } = Dimensions.get('window');

// ============================================
// PROGRESS BAR COMPONENT
// ============================================

export const ProgressBar = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressBackground}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.progressText}>
        Step {currentStep} of {totalSteps}
      </Text>
    </View>
  );
};

// ============================================
// FORM FIELD COMPONENT (Text Input)
// ============================================

export const FormField = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  required = false,
  helperText = '',
  editable = true,
  multiline = false,
  numberOfLines = 1,
}) => {
  return (
    <View style={styles.fieldContainer}>
      {label && (
        <Text style={styles.fieldLabel}>
          {label}
          {required && <Text style={styles.requiredAsterisk}>*</Text>}
        </Text>
      )}
      <TextInput
        style={[
          styles.textInput,
          !editable && styles.textInputDisabled,
          multiline && styles.textInputMultiline,
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        value={value || ''}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        editable={editable}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
      {helperText && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
};

// ============================================
// CHIP SELECTOR COMPONENT (Button Group)
// ============================================

export const ChipSelector = ({
  label,
  options,
  value,
  onSelect,
  required = false,
  horizontal = true,
  multiSelect = false,
}) => {
  const isSelected = (option) => {
    if (multiSelect) {
      return Array.isArray(value) && value.includes(option);
    }
    return value === option;
  };

  const handleSelect = (option) => {
    if (multiSelect) {
      const newValue = Array.isArray(value) ? [...value] : [];
      if (newValue.includes(option)) {
        newValue.splice(newValue.indexOf(option), 1);
      } else {
        newValue.push(option);
      }
      onSelect(newValue);
    } else {
      onSelect(option);
    }
  };

  return (
    <View style={styles.chipContainer}>
      {label && (
        <Text style={styles.chipLabel}>
          {label}
          {required && <Text style={styles.requiredAsterisk}>*</Text>}
        </Text>
      )}
      <View
        style={[
          styles.chipWrapper,
          horizontal ? styles.chipWrapperHorizontal : styles.chipWrapperVertical,
        ]}
      >
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.chip,
              isSelected(option) && styles.chipSelected,
              !isSelected(option) && styles.chipUnselected,
            ]}
            onPress={() => handleSelect(option)}
          >
            <Text
              style={[
                styles.chipText,
                isSelected(option) && styles.chipTextSelected,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// ============================================
// BADGE COMPONENT
// ============================================

export const Badge = ({ label, backgroundColor, textColor = '#FFF', icon = '' }) => {
  return (
    <View style={[styles.badge, { backgroundColor }]}>
      {icon && <Text style={[styles.badgeIcon, { color: textColor }]}>{icon}</Text>}
      <Text style={[styles.badgeText, { color: textColor }]}>{label}</Text>
    </View>
  );
};

// ============================================
// TOGGLE SWITCH COMPONENT
// ============================================

export const ToggleSwitch = ({
  label,
  value,
  onValueChange,
  required = false,
  helperText = '',
}) => {
  return (
    <View style={styles.toggleContainer}>
      <View style={styles.toggleLabelContainer}>
        {label && (
          <Text style={styles.toggleLabel}>
            {label}
            {required && <Text style={styles.requiredAsterisk}>*</Text>}
          </Text>
        )}
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: colors.border, true: colors.success }}
          thumbColor={value ? colors.success : colors.disabled}
          style={styles.switch}
        />
      </View>
      {helperText && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
};

// ============================================
// CARD COMPONENT
// ============================================

export const Card = ({ children, style }) => {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
};

// ============================================
// BUTTON COMPONENT
// ============================================

export const Button = ({
  label,
  onPress,
  variant = 'primary', // primary, secondary, danger
  size = 'md', // sm, md, lg
  disabled = false,
  style,
  labelStyle,
}) => {
  let backgroundColor = colors.primary;
  let textColor = colors.textOnPrimary;

  if (variant === 'secondary') {
    backgroundColor = colors.border;
    textColor = colors.textPrimary;
  } else if (variant === 'danger') {
    backgroundColor = colors.error;
    textColor = colors.textOnPrimary;
  }

  const getButtonHeight = () => {
    switch (size) {
      case 'sm':
        return 36;
      case 'lg':
        return 56;
      default:
        return 48;
    }
  };

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.button,
        {
          height: getButtonHeight(),
          backgroundColor: disabled ? colors.disabled : backgroundColor,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          { color: disabled ? colors.textTertiary : textColor },
          labelStyle,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  // Progress Bar
  progressContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  progressBackground: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  progressText: {
    fontSize: typography.size.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },

  // Form Field
  fieldContainer: {
    marginBottom: spacing.lg,
  },
  fieldLabel: {
    fontSize: typography.size.label,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  requiredAsterisk: {
    color: colors.error,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.size.body,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  textInputDisabled: {
    backgroundColor: '#F9F9F9',
    color: colors.textTertiary,
  },
  textInputMultiline: {
    textAlignVertical: 'top',
    minHeight: 100,
  },
  helperText: {
    fontSize: typography.size.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },

  // Chip Selector
  chipContainer: {
    marginBottom: spacing.lg,
  },
  chipLabel: {
    fontSize: typography.size.label,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  chipWrapper: {
    gap: spacing.sm,
  },
  chipWrapperHorizontal: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chipWrapperVertical: {
    flexDirection: 'column',
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipUnselected: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  chipText: {
    fontSize: typography.size.label,
    fontWeight: typography.weight.medium,
    color: colors.textPrimary,
  },
  chipTextSelected: {
    color: colors.textOnPrimary,
  },

  // Badge
  badge: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
  },
  badgeIcon: {
    fontSize: typography.size.h5,
    fontWeight: typography.weight.bold,
  },
  badgeText: {
    fontSize: typography.size.label,
    fontWeight: typography.weight.semibold,
  },

  // Toggle
  toggleContainer: {
    marginBottom: spacing.lg,
  },
  toggleLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  toggleLabel: {
    fontSize: typography.size.label,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
    flex: 1,
  },
  switch: {
    marginLeft: spacing.md,
  },

  // Card
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.md,
  },

  // Button
  button: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginVertical: spacing.sm,
    ...shadows.sm,
  },
  buttonText: {
    fontSize: typography.size.label,
    fontWeight: typography.weight.semibold,
  },
});

export default {
  ProgressBar,
  FormField,
  ChipSelector,
  Badge,
  ToggleSwitch,
  Card,
  Button,
};
