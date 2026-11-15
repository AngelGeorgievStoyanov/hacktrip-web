import type { Theme } from '@mui/material/styles';
import { getSurfaceStyles } from '@/theme/components/surface';
import { CARD_BORDER, UI_COLORS, UI_SHAPE, UI_SHADOWS } from '@/constants/ui';

/** Shared visual treatment for application panels; layout remains caller-owned. */
export const PANEL_SX = (theme: Theme) => getSurfaceStyles(theme);

/** Legacy blue-white panel surface shared by profile and trip editing forms. */
export const LEGACY_PANEL_SX = {
  backgroundColor: UI_COLORS.surface.card,
  boxShadow: UI_SHADOWS.card,
  border: CARD_BORDER,
  borderRadius: UI_SHAPE.squareRadius,
} as const;
