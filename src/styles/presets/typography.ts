import type { CSSProperties } from 'react';
import { COLORS } from '@/constants/ui/colors';

/** Shared heading treatment used by legacy HTML and MUI heading consumers. */
export const headingTextStyle: CSSProperties = {
  fontFamily: 'Space Mono, monospace',
  color: COLORS.textLight,
  opacity: 1,
  textShadow: `3px 3px 3px ${COLORS.headingShadow}`,
};

/** Shared compact inline error text for social actions. */
export const socialErrorTextStyle: CSSProperties = {
  color: 'red',
  fontSize: '0.75rem',
};
