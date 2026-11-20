import type { Theme } from '@mui/material/styles';
import { getThemeShadow } from '@/theme/shadows';
import { UI_SHAPE } from '@/constants/ui/shape';

/** One shared visual contract for elevated application surfaces. */
export function getSurfaceStyles(theme: Theme) {
  return {
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    boxShadow: getThemeShadow(theme, 'surface'),
  };
}

/** Shared outer surface used by Trip, Point, authentication and profile feature panels. */
export function getFeatureSurfaceStyles(theme: Theme) {
  return {
    ...getSurfaceStyles(theme),
    borderRadius: UI_SHAPE.featureSurfaceRadius,
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
