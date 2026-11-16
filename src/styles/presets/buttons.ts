import { UI_COLORS } from '@/constants/ui/colors';
import { UI_SPACING } from '@/constants/ui/spacing';

/**
 * Reusable MUI sx fragments for recurring button treatments.
 * Use semantic names so recurring button treatments stay explicit.
 */
const primary = {
  '&:hover': { backgroundColor: UI_COLORS.brand.primaryHover },
} as const;

const danger = {
  '&:hover': { backgroundColor: UI_COLORS.action.dangerHover },
} as const;

const secondary = {
  backgroundColor: UI_COLORS.action.secondaryBackground,
  color: 'black',
  '&:hover': {
    backgroundColor: UI_COLORS.action.secondaryBackground,
    color: UI_COLORS.action.secondaryHoverText,
  },
} as const;

const createTrip = {
  backgroundColor: UI_COLORS.action.createTripBackground,
  color: UI_COLORS.action.createTripText,
  px: UI_SPACING.xl,
  '&:hover': {
    backgroundColor: UI_COLORS.action.createTripHoverBackground,
    color: UI_COLORS.action.createTripHoverText,
  },
} as const;

const secondaryLightText = {
  ...secondary,
  '&:hover': {
    backgroundColor: UI_COLORS.action.secondaryBackground,
    color: UI_COLORS.text.inverse,
  },
} as const;

export const BUTTON_STYLES = {
  primary,
  danger,
  secondary,
  back: secondary,
  secondaryLightText,
  createTrip,
} as const;
