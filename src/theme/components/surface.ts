import type { Theme } from '@mui/material/styles';
import { UI_COLORS } from '@/constants/ui/colors';
import { UI_SHADOWS } from '@/constants/ui/shadows';

/** One shared visual contract for elevated application surfaces. */
export function getSurfaceStyles(theme: Theme) {
  return {
    backgroundColor: UI_COLORS.surface.card,
    border: `1px solid ${UI_COLORS.border.strong}`,
    borderRadius: theme.shape.borderRadius,
    boxShadow: UI_SHADOWS.panel,
  };
}

/** Shared outlined Paper surface for bordered data containers (without elevation). */
export function getOutlinedSurfaceStyles(theme: Theme) {
  return {
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    boxShadow: 'none',
  };
}
