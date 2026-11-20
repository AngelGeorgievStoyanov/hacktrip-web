import type { SxProps, Theme } from '@mui/material/styles';
import { UI_COLORS } from '@/constants/ui/colors';
import { DISPLAY_FONT_FAMILY } from '@/constants/ui/typography';

/** Shared heading text treatment for MUI typography consumers. */
export const HEADING_TEXT_SX = {
  fontFamily: DISPLAY_FONT_FAMILY,
  color: UI_COLORS.text.inverse,
  opacity: 1,
  textShadow: `3px 3px 3px ${UI_COLORS.decorative.headingShadow}`,
} as const;

/** Legacy branded h1 treatment shared by the responsive welcome heading. */
export const SCRAMBLE_HEADING_SX = {
  m: '2px',
  textAlign: 'center',
  fontSize: '2em',
  fontWeight: 700,
  lineHeight: 'normal',
  ...HEADING_TEXT_SX,
} as const;

/** Backward-compatible name for the shared Home heading preset. */
export const HOME_HEADING_SX: SxProps<Theme> = SCRAMBLE_HEADING_SX;

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

/** Empty PointList prompt. */
export const POINT_LIST_EMPTY_SX = {
  textAlign: 'center',
} as const;

/** Page-specific intro widths compose the shared intro typography treatment. */
export const HOME_HERO_INTRO_SX = { ...HOME_INTRO_SX, maxWidth: 850 } as const;
export const TRIPS_PAGE_INTRO_SX = { ...HOME_INTRO_SX, maxWidth: 900 } as const;

/** Three-line collapsed state for long point/trip descriptions. */
export const EXPANDABLE_TEXT_COLLAPSED_SX = {
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 3,
  overflow: 'hidden',
} as const;

/** Admin route h1: explicit semantic heading role matching the existing browser h1 scale. */
export const ADMIN_PAGE_TITLE_SX = {
  fontSize: '2em',
  fontWeight: 700,
  marginBlockStart: '0.67em',
  marginBlockEnd: '0.67em',
} as const;

/** Not Found page h3/h4 roles preserve the existing browser heading scale. */
export const NOT_FOUND_TITLE_SX = {
  fontSize: '1.17em',
  fontWeight: 700,
  marginBlockStart: '1em',
  marginBlockEnd: '1em',
} as const;

export const NOT_FOUND_SUBTITLE_SX = {
  fontSize: '1em',
  fontWeight: 700,
  marginBlockStart: '1.33em',
  marginBlockEnd: '1.33em',
} as const;
