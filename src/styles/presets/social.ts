import type { CSSProperties } from 'react';
import { UI_COLORS } from '@/constants/ui/colors';
import { UI_SPACING } from '@/constants/ui/spacing';

/** Shared alignment for like, favorite, report and moderation action groups. */
export const SOCIAL_ACTIONS_SX = {
  display: 'flex',
  gap: UI_SPACING.xs,
  alignItems: 'center',
  flexWrap: 'wrap',
} as const;

/** Compact count badge metrics shared by small social action buttons and image overlays. */
export const SOCIAL_BADGE_COMPACT_STYLE = {
  fontSize: '0.65rem',
  height: 14,
  minWidth: 14,
  padding: '0 3px',
  lineHeight: 1,
} as const;

/** Shared compact inline error text for social actions. */
export const socialErrorTextStyle: CSSProperties = {
  color: UI_COLORS.action.danger,
  fontSize: '0.75rem',
};
