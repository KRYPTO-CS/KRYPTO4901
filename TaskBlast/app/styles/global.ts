// Global styles and theme configuration for TaskBlast

export const colors = {
  primary: '#4a90e2',
  primaryDark: '#3a7bc8',
  primaryLight: '#6ba3e8',
  secondary: '#666',
  background: '#f5f5f5',
  surface: '#ffffff',
  error: '#e74c3c',
  success: '#2ecc71',
  warning: '#f39c12',
  text: {
    primary: '#333',
    secondary: '#666',
    placeholder: '#999',
    inverse: '#ffffff',
  },
  border: {
    light: '#e0e0e0',
    medium: '#ccc',
    dark: '#999',
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
  round: 9999,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  button: {
    shadowColor: '#4a90e2',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
};

export const typography = {
  h1: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  h2: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  h3: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  body: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
    color: colors.text.primary,
  },
  caption: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    color: colors.text.secondary,
  },
  button: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.inverse,
  },
};

export const theme = {
  colors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  shadows,
  typography,
};

export default theme;
