import type { Theme } from '@mui/material/styles';
import { UI_ELEVATION } from '@/constants/ui/shadows';

export type SurfaceElevation = keyof typeof UI_ELEVATION;

/** Resolve semantic application elevation through the active MUI shadow scale. */
export function getThemeShadow(theme: Theme, elevation: SurfaceElevation): string {
  return theme.shadows[UI_ELEVATION[elevation]];
}
