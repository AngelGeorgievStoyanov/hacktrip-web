import { COLORS } from '@/constants/ui/colors';
import { CARD_BORDER, UI_SHAPE } from '@/constants/ui/shape';
import { UI_SHADOWS } from '@/constants/ui/shadows';

/** Shared form-panel treatment used by authentication forms. */
export const FORM_PANEL_SX = {
  backgroundColor: COLORS.formPanelBackground,
  boxShadow: UI_SHADOWS.card,
  border: CARD_BORDER,
  borderRadius: UI_SHAPE.squareRadius,
} as const;


/** Shared layout and panel treatment for standalone authentication forms. */
export const AUTH_FORM_SX = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  ...FORM_PANEL_SX,
  padding: '30px',
  maxWidth: '700px',
  width: '100%',
  boxSizing: 'border-box',
  marginX: 'auto',
} as const;
