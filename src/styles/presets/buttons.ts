import { UI_COLORS } from '@/constants/ui/colors';
import { UI_SPACING } from '@/constants/ui/spacing';
import { UI_SIZES } from '@/constants/ui/sizes';

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

/** Legal-document return link keeps its native anchor navigation and page-specific tone. */
export const LEGAL_BACK_LINK_SX = {
  display: 'inline-block',
  mt: '18px',
  py: '10px',
  px: '24px',
  borderRadius: 'var(--ht-shape-border-radius)',
  backgroundColor: UI_COLORS.legal.backBackground,
  color: UI_COLORS.text.primary,
  textDecoration: 'none',
  fontWeight: 600,
  '&:hover': { color: UI_COLORS.text.inverse },
} as const;

/** Unique native-button treatment for the Not Found route's home action. */
export const NOT_FOUND_HOME_BUTTON_SX = {
  color: UI_COLORS.text.inverse,
  backgroundColor: UI_COLORS.action.contrastBackground,
  padding: '10px 30px',
  margin: '25px',
  cursor: 'pointer',
  border: 'none',
} as const;

const secondaryLightText = {
  ...secondary,
  '&:hover': {
    backgroundColor: UI_COLORS.action.secondaryBackground,
    color: UI_COLORS.text.inverse,
  },
} as const;

/** Shared dimensions for full-width actions in the trip details action stack. */
export const TRIP_ACTION_BUTTON_LAYOUT_SX = {
  padding: '10px',
  width: '100%',
  minHeight: '48px',
  boxSizing: 'border-box',
} as const;

/** Shared top-level navigation link spacing and hit-area contract. */
const navigation = {
  margin: '2px',
  padding: '2px',
  boxSizing: 'content-box',
} as const;

/** Shared primary action treatment for trip navigation and management. */
const tripAction = {
  ...primary,
  ...TRIP_ACTION_BUTTON_LAYOUT_SX,
} as const;

/** Shared danger treatment for destructive trip actions. */
const tripActionDanger = {
  ...danger,
  ...TRIP_ACTION_BUTTON_LAYOUT_SX,
} as const;

/** Shared day-number stepper layout and semantic button contracts. */
export const DAY_NUMBER_BUTTON_GROUP_SX = {
  ml: 0.5,
  mr: 0,
  my: 0,
  alignSelf: 'center',
} as const;

const dayNumberButton = {
  minWidth: 40,
  width: 40,
  height: UI_SIZES.compactControlHeight,
  padding: 0,
  margin: 0,
  '&:hover': { backgroundColor: 'primary.dark' },
} as const;

export { ICON_ACTION_STYLES } from './actions';

export const BUTTON_STYLES = {
  primary,
  submit: primary,
  create: primary,
  add: primary,
  edit: primary,
  save: primary,
  primaryWide,
  navigationAction: primaryWide,
  navigationLink: primary,
  findLocation: primary,
  danger,
  dangerText: { color: 'error.main' },
  delete: danger,
  deleteText: { color: 'error.main' },
  upload: primary,
  removeSelection: primary,
  removeMarker: secondary,
  secondary,
  navigationSecondary: secondary,
  cancel: secondary,
  confirm: primary,
  disclosure: secondary,
  back: secondary,
  secondaryLightText,
  addPoints: secondaryLightText,
  createTrip,
  tripAction,
  tripActionDanger,
  tripAdd: tripAction,
  tripEdit: tripAction,
  tripManage: tripAction,
  tripDelete: tripActionDanger,
  dayIncrement: dayNumberButton,
  dayDecrement: dayNumberButton,
  navigation,
} as const;
