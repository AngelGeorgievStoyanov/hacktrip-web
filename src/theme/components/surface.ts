import type { Theme } from '@mui/material/styles';
import { getThemeShadow } from '@/theme/shadows';

/** One shared visual contract for elevated application surfaces. */
export function getSurfaceStyles(theme: Theme) {
  return {
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    boxShadow: getThemeShadow(theme, 'surface'),
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
