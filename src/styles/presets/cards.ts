import type { CSSProperties } from 'react';
import { COLORS } from '@/constants/ui/colors';
import { CARD_BORDER, UI_SHAPE } from '@/constants/ui/shape';
import { UI_SHADOWS } from '@/constants/ui/shadows';

/**
 * Surface treatment for legacy comment bubbles.
 * MUI Card and Dialog surfaces are owned by the central theme.
 */
export const COMMENT_SURFACE_SX = {
  boxShadow: UI_SHADOWS.card,
  border: CARD_BORDER,
  borderRadius: UI_SHAPE.squareRadius,
} as const;

/** Layout preset for trip cards; surface styling comes from the MUI theme. */
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
};

/** Comment bubbles remain a distinct semantic surface, not a generic MUI Card. */
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
