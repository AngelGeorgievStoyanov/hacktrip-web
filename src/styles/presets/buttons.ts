import { COLORS } from '@/constants/ui/colors';

/** Reusable MUI sx fragments for recurring button treatments. */
export const BUTTON_STYLES = {
  containedHover: {
    '&:hover': { backgroundColor: COLORS.buttonHover },
  },
  dangerHover: {
    '&:hover': { backgroundColor: COLORS.dangerHover },
  },
  secondary: {
    backgroundColor: COLORS.secondaryButtonBackground,
    color: 'black',
    '&:hover': {
      backgroundColor: COLORS.secondaryButtonBackground,
      color: COLORS.secondaryButtonHoverText,
    },
  },
  secondaryLightText: {
    backgroundColor: COLORS.secondaryButtonBackground,
    color: 'black',
    '&:hover': {
      backgroundColor: COLORS.secondaryButtonBackground,
      color: COLORS.textLight,
    },
  },
  secondaryBack: {
    backgroundColor: COLORS.secondaryButtonBackground,
    color: 'black',
    '&:hover': {
      backgroundColor: COLORS.secondaryButtonHoverBackground,
      color: 'black',
    },
  },
} as const;
