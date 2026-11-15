import type { CSSProperties } from 'react';
import { COLORS } from '@/constants/ui/colors';
import { CARD_BORDER, UI_SHAPE } from '@/constants/ui/shape';
import { UI_SHADOWS } from '@/constants/ui/shadows';

/**
 * Legacy CSSProperties presets retained temporarily for existing consumers.
 * Migrate each consumer to theme tokens, shared presets or a local CSS Module.
 */
export const headingTextStyle: CSSProperties = {
  fontFamily: 'Space Mono, monospace',
  color: COLORS.textLight,
  opacity: 1,
  textShadow: `3px 3px 3px ${COLORS.headingShadow}`,
};

export const pageBackgroundStyle: CSSProperties = {
  boxSizing: 'border-box',
  padding: '30px',
};

export const cardListStyle: CSSProperties = {
  listStyle: 'none',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  padding: 0,
  margin: 0,
};

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
  boxShadow: UI_SHADOWS.card,
  border: CARD_BORDER,
  borderRadius: UI_SHAPE.squareRadius,
};

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

export const commentListStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
  gap: '20px',
  alignItems: 'start',
  listStyle: 'none',
  padding: 0,
  margin: 0,
};

export const commentCardStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: '100%',
  height: 'fit-content',
  padding: '30px',
  backgroundColor: COLORS.commentCardBackground,
  boxShadow: UI_SHADOWS.card,
  border: CARD_BORDER,
  borderRadius: UI_SHAPE.squareRadius,
};
