import { colors } from '../tokens/colors';
import { spacing, borderRadius, shadows } from '../tokens/spacing';

export const form = {
  base: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    border: `1px solid ${colors.gray[200]}`,
    padding: spacing[6],
    boxSizing: 'border-box',
    boxShadow: shadows.sm,
  },
  variants: {
    default: {},
    outlined: {
      border: `1px solid ${colors.gray[300]}`,
      backgroundColor: colors.gray[50],
      boxShadow: 'none',
    },
    ghost: {
      border: 'none',
      backgroundColor: 'transparent',
      boxShadow: 'none',
    },
    error: {
      border: `1px solid ${colors.red[200]}`,
      backgroundColor: colors.red[50],
      boxShadow: shadows.sm,
    },
    success: {
      border: `1px solid ${colors.green[200]}`,
      backgroundColor: colors.green[50],
      boxShadow: shadows.sm,
    },
  },
  spacing: {
    none: { padding: '0' },
    sm: { padding: spacing[4] },
    md: { padding: spacing[6] },
    lg: { padding: spacing[8] },
  },
};

export const formHeader = {
  base: {
    padding: `${spacing[6]} ${spacing[6]}`,
    borderBottom: `1px solid ${colors.gray[200]}`,
    backgroundColor: colors.gray[50],
  },
};

export const formContent = {
  base: {
    padding: `${spacing[6]} ${spacing[6]}`,
  },
};

export const formFooter = {
  base: {
    padding: `${spacing[6]} ${spacing[6]}`,
    borderTop: `1px solid ${colors.gray[200]}`,
    backgroundColor: colors.gray[50],
  },
};
export const formError = {
  base: {
    backgroundColor: colors.red[50],
    border: `1px solid ${colors.red[200]}`,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    color: colors.red[700],
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
  },
};

export const formSuccess = {
  base: {
    backgroundColor: colors.green[50],
    border: `1px solid ${colors.green[200]}`,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    color: colors.green[700],
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
  },
};
