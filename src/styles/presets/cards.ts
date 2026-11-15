import type { CSSProperties } from 'react';
import { COLORS } from '@/constants/ui/colors';
import { CARD_BORDER, UI_SHAPE } from '@/constants/ui/shape';
import { UI_SHADOWS } from '@/constants/ui/shadows';

/** Shared border, shadow and corner treatment for card surfaces. */
export const CARD_SURFACE_SX = {
  boxShadow: UI_SHADOWS.card,
  border: CARD_BORDER,
  borderRadius: UI_SHAPE.squareRadius,
} as const;

/** Shared card treatments used by components with the same visual role. */
export const cardStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  alignItems: 'center',
  maxWidth: '300px',
  margin: '20px',
  maxHeight: '540px',
  width: '-webkit-fill-available',
  padding: '25px 0px 0px 0px',
  backgroundColor: COLORS.cardBackground,
  ...CARD_SURFACE_SX,
};

export const commentCardStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: '100%',
  height: 'fit-content',
  padding: '30px',
  backgroundColor: COLORS.commentCardBackground,
  ...CARD_SURFACE_SX,
};
