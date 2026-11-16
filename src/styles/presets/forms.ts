import type { Theme } from '@mui/material/styles';
import { UI_SPACING } from '@/constants/ui/spacing';
import { COLUMN_STACK_SX } from './layouts';
import { PANEL_SX } from './panels';

/** Backward-compatible form-panel preset. */
export const FORM_PANEL_SX = PANEL_SX;

/** Shared heading treatment for standalone authentication forms. */
export const AUTH_FORM_TITLE_SX = {
  margin: '10px auto',
  textAlign: 'center',
} as const;

/** Shared layout and surface treatment for standalone authentication forms. */
export const AUTH_FORM_SX = (theme: Theme) => ({
  ...PANEL_SX(theme),
  ...COLUMN_STACK_SX,
  padding: '30px',
  maxWidth: '700px',
  width: '100%',
  boxSizing: 'border-box',
  marginX: 'auto',
});

/** Shared centered action row for auth forms with multiple navigation actions. */
export const AUTH_FORM_ACTIONS_SX = {
  display: 'flex',
  gap: 2,
  flexWrap: 'wrap',
  justifyContent: 'center',
  mt: UI_SPACING.xs,
} as const;

/** Shared centered back-navigation row for standalone auth forms. */
export const AUTH_FORM_BACK_ACTION_SX = {
  display: 'flex',
  justifyContent: 'center',
  mt: 1,
} as const;
