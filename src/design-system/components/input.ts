import { colors } from '../tokens/colors';
import { typography } from '../tokens/typography';
import { spacing, borderRadius } from '../tokens/spacing';
import { transitions } from '../tokens/layout';

export const input = {
  base: {
    display: 'block',
    width: '100%',
    borderRadius: borderRadius.md,
    border: '1px solid',
    borderColor: colors.gray[300],
    backgroundColor: colors.white,
    color: colors.gray[900],
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.tight,
    padding: `${spacing[2]} ${spacing[3]}`,
    transition: transitions.colors,
    '&:focus': {
      outline: 'none',
      borderColor: colors.primary[500],
      boxShadow: `0 0 0 3px ${colors.primary[100]}`,
    },
    '&:disabled': {
      backgroundColor: colors.gray[50],
      color: colors.gray[500],
      cursor: 'not-allowed',
    },
    '&::placeholder': {
      color: colors.gray[400],
    },
  },
  variants: {
    default: {},
    error: {
      borderColor: colors.red[500],
      '&:focus': {
        borderColor: colors.red[500],
        boxShadow: `0 0 0 3px ${colors.red[100]}`,
      },
    },
    success: {
      borderColor: colors.green[500],
      '&:focus': {
        borderColor: colors.green[500],
        boxShadow: `0 0 0 3px ${colors.green[100]}`,
      },
    },
  },
  sizes: {
    sm: {
      padding: `${spacing[1]} ${spacing[2]}`,
      fontSize: typography.fontSize.xs,
    },
    md: {
      padding: `${spacing[2]} ${spacing[3]}`,
      fontSize: typography.fontSize.sm,
    },
    lg: {
      padding: `${spacing[3]} ${spacing[4]}`,
      fontSize: typography.fontSize.base,
    },
  },
};

export const textarea = {
  ...input,
  base: {
    ...input.base,
    minHeight: spacing[20],
    resize: 'vertical',
  },
};

export const select = {
  ...input,
  base: {
    ...input.base,
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: 'right 0.5rem center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1.5em 1.5em',
    paddingRight: spacing[10],
    appearance: 'none',
  },
};
