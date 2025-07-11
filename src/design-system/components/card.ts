import { colors } from '../tokens/colors';
import { spacing, borderRadius, shadows } from '../tokens/spacing';

export const card = {
  base: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    boxShadow: shadows.sm,
    border: '1px solid',
    borderColor: colors.gray[200],
    overflow: 'hidden',
  },
  variants: {
    default: {},
    elevated: {
      boxShadow: shadows.md,
    },
    outline: {
      boxShadow: 'none',
      borderColor: colors.gray[300],
    },
    ghost: {
      boxShadow: 'none',
      border: 'none',
      backgroundColor: 'transparent',
    },
  },
  padding: {
    none: { padding: '0' },
    sm: { padding: spacing[4] },
    md: { padding: spacing[6] },
    lg: { padding: spacing[8] },
  },
};

export const cardHeader = {
  base: {
    padding: spacing[6],
    borderBottom: '1px solid',
    borderBottomColor: colors.gray[200],
  },
};

export const cardContent = {
  base: {
    padding: spacing[6],
  },
};

export const cardFooter = {
  base: {
    padding: spacing[6],
    borderTop: '1px solid',
    borderTopColor: colors.gray[200],
    backgroundColor: colors.gray[50],
  },
};
