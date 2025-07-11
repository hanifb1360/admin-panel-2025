import { colors } from '../tokens/colors';
import { typography } from '../tokens/typography';
import { spacing, borderRadius } from '../tokens/spacing';

export const badge = {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: borderRadius.full,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.tight,
    padding: `${spacing[1]} ${spacing[2]}`,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  variants: {
    default: {
      backgroundColor: colors.gray[100],
      color: colors.gray[800],
    },
    primary: {
      backgroundColor: colors.primary[100],
      color: colors.primary[800],
    },
    secondary: {
      backgroundColor: colors.gray[100],
      color: colors.gray[800],
    },
    success: {
      backgroundColor: colors.green[100],
      color: colors.green[800],
    },
    warning: {
      backgroundColor: colors.yellow[100],
      color: colors.yellow[800],
    },
    error: {
      backgroundColor: colors.red[100],
      color: colors.red[800],
    },
    info: {
      backgroundColor: colors.blue[100],
      color: colors.blue[800],
    },
  },
  sizes: {
    sm: {
      padding: `${spacing[1]} ${spacing[2]}`,
      fontSize: typography.fontSize.xs,
    },
    md: {
      padding: `${spacing[1]} ${spacing[3]}`,
      fontSize: typography.fontSize.sm,
    },
    lg: {
      padding: `${spacing[2]} ${spacing[4]}`,
      fontSize: typography.fontSize.base,
    },
  },
};
