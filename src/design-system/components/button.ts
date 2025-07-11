import { colors } from '../tokens/colors';
import { typography } from '../tokens/typography';
import { spacing, borderRadius } from '../tokens/spacing';
import { transitions } from '../tokens/layout';

export const button = {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.tight,
    transition: transitions.all,
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
    textDecoration: 'none',
    '&:focus': {
      outline: '2px solid',
      outlineColor: colors.primary[500],
      outlineOffset: '2px',
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
  variants: {
    primary: {
      backgroundColor: colors.primary[600],
      color: colors.white,
      '&:hover:not(:disabled)': {
        backgroundColor: colors.primary[700],
      },
      '&:active:not(:disabled)': {
        backgroundColor: colors.primary[800],
      },
    },
    secondary: {
      backgroundColor: colors.gray[100],
      color: colors.gray[900],
      '&:hover:not(:disabled)': {
        backgroundColor: colors.gray[200],
      },
      '&:active:not(:disabled)': {
        backgroundColor: colors.gray[300],
      },
    },
    outline: {
      backgroundColor: 'transparent',
      color: colors.primary[600],
      border: '1px solid',
      borderColor: colors.primary[600],
      '&:hover:not(:disabled)': {
        backgroundColor: colors.primary[50],
      },
      '&:active:not(:disabled)': {
        backgroundColor: colors.primary[100],
      },
    },
    ghost: {
      backgroundColor: 'transparent',
      color: colors.gray[600],
      '&:hover:not(:disabled)': {
        backgroundColor: colors.gray[100],
        color: colors.gray[900],
      },
      '&:active:not(:disabled)': {
        backgroundColor: colors.gray[200],
      },
    },
    danger: {
      backgroundColor: colors.red[600],
      color: colors.white,
      '&:hover:not(:disabled)': {
        backgroundColor: colors.red[700],
      },
      '&:active:not(:disabled)': {
        backgroundColor: colors.red[800],
      },
    },
  },
  sizes: {
    sm: {
      height: spacing[8],
      paddingLeft: spacing[3],
      paddingRight: spacing[3],
      fontSize: typography.fontSize.sm,
    },
    md: {
      height: spacing[10],
      paddingLeft: spacing[4],
      paddingRight: spacing[4],
      fontSize: typography.fontSize.sm,
    },
    lg: {
      height: spacing[12],
      paddingLeft: spacing[6],
      paddingRight: spacing[6],
      fontSize: typography.fontSize.base,
    },
  },
};

export const iconButton = {
  base: {
    ...button.base,
    padding: '0',
    aspectRatio: '1',
  },
  sizes: {
    sm: {
      width: spacing[8],
      height: spacing[8],
    },
    md: {
      width: spacing[10],
      height: spacing[10],
    },
    lg: {
      width: spacing[12],
      height: spacing[12],
    },
  },
};
