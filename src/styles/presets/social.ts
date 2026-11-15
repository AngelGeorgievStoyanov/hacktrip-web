import type { CSSProperties } from 'react';
import { UI_COLORS } from '@/constants/ui/colors';

/** Shared alignment for like, favorite, report and moderation action groups. */
export const SOCIAL_ACTIONS_SX = {
  display: 'flex',
  gap: 1,
  alignItems: 'center',
  flexWrap: 'wrap',
} as const;

/** Shared compact inline error text for social actions. */
export const socialErrorTextStyle: CSSProperties = {
  color: UI_COLORS.action.danger,
  fontSize: '0.75rem',
};
