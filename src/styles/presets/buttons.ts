import { UI_COLORS } from '@/constants/ui/colors';
import { UI_SPACING } from '@/constants/ui/spacing';

/**
 * Reusable MUI sx fragments for recurring button treatments.
 * Use semantic names so recurring button treatments stay explicit.
 */
const primary = {
  '&:hover': { backgroundColor: UI_COLORS.brand.primaryHover },
} as const;

const primaryWide = {
  ...primary,
  padding: 'var(--ht-button-padding)',
} as const;

const danger = {
  '&:hover': { backgroundColor: UI_COLORS.action.dangerHover },
} as const;

const secondary = {
  backgroundColor: UI_COLORS.action.secondaryBackground,
  color: UI_COLORS.text.onSecondary,
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

/** Shared full-width action sizing for trip navigation and management actions. */
const tripAction = {
  ...primary,
  padding: '10px',
  width: '100%',
  minHeight: '48px',
  boxSizing: 'border-box',
} as const;

/** Shared danger treatment and sizing for destructive trip actions. */
const tripActionDanger = {
  ...danger,
  padding: '10px',
  width: '100%',
  minHeight: '48px',
  boxSizing: 'border-box',
} as const;

export const BUTTON_STYLES = {
  primary,
  primaryWide,
  danger,
  secondary,
  back: secondary,
  secondaryLightText,
  createTrip,
  tripAction,
  tripActionDanger,
} as const;
