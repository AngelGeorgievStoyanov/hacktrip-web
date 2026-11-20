import type { Theme } from '@mui/material/styles';
import { getSurfaceStyles } from '@/theme/components/surface';

/** Shared outer surface preset; its radius comes from the global MUI theme. */
export const FEATURE_SURFACE_SX = (theme: Theme) => getSurfaceStyles(theme);
