import { UI_COLORS } from '@/constants/ui/colors';

/**
 * Reusable MUI sx fragments for recurring button treatments.
 * New call sites should use semantic names; legacy aliases remain during migration.
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

const back = {
  backgroundColor: UI_COLORS.action.secondaryBackground,
  color: 'black',
  '&:hover': {
    backgroundColor: UI_COLORS.action.secondaryHoverBackground,
    color: 'black',
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
  back,
  secondaryLightText,

  /** @deprecated Use primary. */
  containedHover: primary,
  /** @deprecated Use danger. */
  dangerHover: danger,
  /** @deprecated Use back. */
  secondaryBack: back,
} as const;
