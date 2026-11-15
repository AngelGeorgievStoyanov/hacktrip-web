import { COLORS } from '@/constants/ui/colors';
import { CARD_BORDER } from '@/constants/ui/shape';
import { UI_SHADOWS } from '@/constants/ui/shadows';
import { UI_SHAPE } from '@/constants/ui/shape';

/** Shared form-panel treatment used by authentication forms. */
export const FORM_PANEL_SX = {
  backgroundColor: COLORS.formPanelBackground,
  boxShadow: UI_SHADOWS.card,
  border: CARD_BORDER,
  borderRadius: UI_SHAPE.squareRadius,
} as const;
