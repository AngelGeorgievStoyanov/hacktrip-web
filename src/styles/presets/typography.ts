import type { CSSProperties } from 'react';
import { UI_COLORS } from '@/constants/ui/colors';
import { TYPOGRAPHY } from '@/constants/ui/typography';

/** Shared heading treatment used by legacy HTML and MUI heading consumers. */
export const headingTextStyle: CSSProperties = {
  fontFamily: TYPOGRAPHY.fontFamily,
  color: UI_COLORS.text.inverse,
  opacity: 1,
  textShadow: `3px 3px 3px ${UI_COLORS.decorative.headingShadow}`,
};

/** Shared centered home/public-trips heading composition. */
export const HOME_HEADING_STYLE: CSSProperties = {
  margin: '2px',
  textAlign: 'center',
  ...headingTextStyle,
};

/** Shared introductory paragraph treatment; each page owns its content max-width. */
export const HOME_INTRO_STYLE: CSSProperties = {
  margin: '0 20px 24px',
  textAlign: 'center',
  ...headingTextStyle,
  lineHeight: 1.6,
};
