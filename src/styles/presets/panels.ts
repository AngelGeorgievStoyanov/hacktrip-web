import type { CSSProperties } from 'react';
import { COLORS } from '@/constants/ui/colors';
import { CARD_BORDER, UI_SHAPE } from '@/constants/ui/shape';
import { UI_SHADOWS } from '@/constants/ui/shadows';

/** Shared panel treatments retained while consumers migrate to local styles. */
export const infoPanelStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  minWidth: '320px',
  maxWidth: '450px',
  margin: '20px',
  padding: '25px',
  backgroundColor: COLORS.cardBackground,
  boxShadow: UI_SHADOWS.card,
  border: CARD_BORDER,
  borderRadius: UI_SHAPE.squareRadius,
};

export const commentsPanelStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  margin: '20px 0',
  padding: '25px',
  backgroundColor: COLORS.cardBackground,
  boxShadow: UI_SHADOWS.card,
  border: CARD_BORDER,
  borderRadius: UI_SHAPE.squareRadius,
};
