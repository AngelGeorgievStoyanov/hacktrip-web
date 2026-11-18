import type { SxProps, Theme } from '@mui/material/styles';
import { UI_COLORS } from '@/constants/ui/colors';
import { TYPOGRAPHY } from '@/constants/ui/typography';

/** Shared heading treatment used by legacy HTML and MUI heading consumers. */
export const headingTextStyle = {
  fontFamily: TYPOGRAPHY.fontFamily,
  color: UI_COLORS.text.inverse,
  opacity: 1,
  textShadow: `3px 3px 3px ${UI_COLORS.decorative.headingShadow}`,
} as const;

/** Shared centered home/public-trips heading composition. */
export const HOME_HEADING_STYLE = {
  margin: '2px',
  textAlign: 'center',
  ...headingTextStyle,
} as const;

/** Shared introductory paragraph treatment; each page owns its content max-width. */
export const HOME_INTRO_SX: SxProps<Theme> = {
  m: '0 20px 24px',
  textAlign: 'center',
  ...headingTextStyle,
  lineHeight: 1.6,
};
