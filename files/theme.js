// src/styles/theme.js

export const colors = {
  // Clinical/Healthcare Colors
  primary: '#008B8B', // Dark Teal
  primaryLight: '#20B2AA', // Light Sea Green
  background: '#F5F7F6', // Light gray-green
  surface: '#FFFFFF', // White cards
  border: '#E0E6E5', // Light border
  
  // Status Colors
  success: '#4CAF50', // Green - Normal/Healthy
  warning: '#FFC107', // Amber - Warning/Mild
  warningMid: '#FF9800', // Orange - Moderate
  error: '#F44336', // Red - Severe/Critical
  info: '#2196F3', // Blue - Info
  
  // Text Colors
  textPrimary: '#1A1A1A', // Dark text
  textSecondary: '#666666', // Medium gray text
  textTertiary: '#999999', // Light gray text
  textOnPrimary: '#FFFFFF', // White text on primary
  
  // Additional Colors
  disabled: '#CCCCCC',
  divider: '#E0E6E5',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export const typography = {
  // Font Families
  fontFamilies: {
    serif: 'Georgia', // Lora-like serif for headings
    sansSerif: 'Roboto', // Inter-like sans-serif for body
    mono: 'Courier New', // Monospace for lab values
  },

  // Font Sizes
  size: {
    // Headings
    h1: 32,
    h2: 28,
    h3: 24,
    h4: 20,
    h5: 18,
    h6: 16,
    
    // Body text
    body: 16,
    bodySmall: 14,
    bodyTiny: 12,
    
    // Labels
    label: 14,
    labelSmall: 12,
    
    // Caption
    caption: 12,
  },

  // Font Weights
  weight: {
    thin: '100',
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 999, // For circular elements
};

export const shadows = {
  none: {
    elevation: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  sm: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  md: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  lg: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
};

export const breakpoints = {
  mobile: 390, // Typical mobile width (pixels)
  tablet: 768,
  desktop: 1024,
};

// Anemia Severity Badge Styles
export const anemiaBadgeStyles = {
  'Non-anemic': {
    backgroundColor: colors.success,
    textColor: colors.textOnPrimary,
    icon: '✓',
  },
  'Mild': {
    backgroundColor: colors.warning,
    textColor: '#000000',
    icon: '⚠',
  },
  'Moderate': {
    backgroundColor: colors.warningMid,
    textColor: colors.textOnPrimary,
    icon: '⚠',
  },
  'Severe': {
    backgroundColor: colors.error,
    textColor: colors.textOnPrimary,
    icon: '✕',
  },
};

// Eligibility Badge Styles
export const eligibilityBadgeStyles = {
  'Included': {
    backgroundColor: colors.success,
    textColor: colors.textOnPrimary,
    icon: '✓',
    label: 'Eligible for Study',
  },
  'Excluded': {
    backgroundColor: colors.error,
    textColor: colors.textOnPrimary,
    icon: '✕',
    label: 'Not Eligible',
  },
};

// Theme preset for entire app
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  breakpoints,
  anemiaBadgeStyles,
  eligibilityBadgeStyles,
};

export default theme;
