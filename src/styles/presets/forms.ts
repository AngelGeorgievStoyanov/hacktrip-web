import type { Theme } from '@mui/material/styles';
import { PANEL_SX } from './panels';

/** Backward-compatible form-panel preset. */
export const FORM_PANEL_SX = PANEL_SX;

/** Shared layout and surface treatment for standalone authentication forms. */
export const AUTH_FORM_SX = (theme: Theme) => ({
  ...PANEL_SX(theme),
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  padding: '30px',
  maxWidth: '700px',
  width: '100%',
  boxSizing: 'border-box',
  marginX: 'auto',
});
