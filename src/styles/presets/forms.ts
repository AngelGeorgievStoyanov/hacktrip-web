import type { Theme } from '@mui/material/styles';
import { getSurfaceStyles } from '@/theme/components/surface';

/** Shared surface treatment for form panels, resolved from the active MUI theme. */
export const FORM_PANEL_SX = (theme: Theme) => getSurfaceStyles(theme);

/** Shared layout and surface treatment for standalone authentication forms. */
export const AUTH_FORM_SX = (theme: Theme) => ({
  ...FORM_PANEL_SX(theme),
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  padding: '30px',
  maxWidth: '700px',
  width: '100%',
  boxSizing: 'border-box',
  marginX: 'auto',
} as const);
