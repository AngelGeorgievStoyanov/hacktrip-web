import type { Theme } from '@mui/material/styles';
import { getFeatureSurfaceStyles } from '@/theme/components/surface';

/** One visual contract for outer Trip, Point, authentication and profile surfaces. */
export const FEATURE_SURFACE_SX = (theme: Theme) => getFeatureSurfaceStyles(theme);
