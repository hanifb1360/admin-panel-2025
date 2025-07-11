import { colors } from '../tokens/colors';
import { typography } from '../tokens/typography';
import { spacing, borderRadius } from '../tokens/spacing';
import { transitions } from '../tokens/layout';

export const table = {
  base: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    border: '1px solid',
    borderColor: colors.gray[200],
  },
  header: {
    backgroundColor: colors.gray[50],
    borderBottom: '1px solid',
    borderBottomColor: colors.gray[200],
  },
  headerCell: {
    padding: `${spacing[3]} ${spacing[4]}`,
    textAlign: 'left',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray[900],
  },
  row: {
    borderBottom: '1px solid',
    borderBottomColor: colors.gray[200],
    transition: transitions.colors,
    '&:hover': {
      backgroundColor: colors.gray[50],
    },
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  cell: {
    padding: `${spacing[3]} ${spacing[4]}`,
    fontSize: typography.fontSize.sm,
    color: colors.gray[900],
    verticalAlign: 'top',
  },
  caption: {
    padding: spacing[4],
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
    textAlign: 'left',
  },
};

export const tableContainer = {
  base: {
    overflowX: 'auto',
    borderRadius: borderRadius.lg,
    border: '1px solid',
    borderColor: colors.gray[200],
  },
};
