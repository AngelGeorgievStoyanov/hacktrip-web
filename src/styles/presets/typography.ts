import type { SxProps, Theme } from '@mui/material/styles';
import { UI_COLORS } from '@/constants/ui/colors';
import { TYPOGRAPHY } from '@/constants/ui/typography';

/** Shared heading text treatment for MUI typography consumers. */
export const HEADING_TEXT_SX = {
  fontFamily: TYPOGRAPHY.fontFamily,
  color: UI_COLORS.text.inverse,
  opacity: 1,
  textShadow: `3px 3px 3px ${UI_COLORS.decorative.headingShadow}`,
} as const;

/** Shared centered home/public-trips heading composition. */
export const HOME_HEADING_SX: SxProps<Theme> = {
  m: '2px',
  textAlign: 'center',
  ...HEADING_TEXT_SX,
};

/** Shared introductory paragraph treatment; each page owns its content max-width. */
export const HOME_INTRO_SX: SxProps<Theme> = {
  m: '0 20px 24px',
  textAlign: 'center',
  ...HEADING_TEXT_SX,
  lineHeight: 1.6,
};


/** Empty TripList state typography; preserves the former module's dimensions. */
export const TRIP_LIST_EMPTY_TITLE_SX = {
  m: '2px',
  fontSize: '1.5rem',
  fontWeight: 500,
  ...HEADING_TEXT_SX,
} as const;

export const TRIP_LIST_EMPTY_TEXT_SX = {
  m: '2px',
  fontSize: '1rem',
  ...HEADING_TEXT_SX,
} as const;
