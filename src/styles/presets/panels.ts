import type { Theme } from '@mui/material/styles';
import { getSurfaceStyles } from '@/theme/components/surface';

/** Shared visual treatment for application panels; layout remains caller-owned. */
export const PANEL_SX = (theme: Theme) => getSurfaceStyles(theme);
