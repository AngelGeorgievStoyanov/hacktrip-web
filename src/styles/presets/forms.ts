import type { Theme } from '@mui/material/styles';
import { UI_SPACING } from '@/constants/ui/spacing';
import { COLUMN_STACK_SX } from './layouts';
import { PANEL_SX } from './panels';

/** Shared panel layout for the create/edit Point form wrappers. */
export const POINT_FORM_PANEL_SX = {
  padding: { xs: 2, sm: '30px' },
  width: '100%',
  maxWidth: 600,
  minWidth: 0,
  boxSizing: 'border-box',
  '& .MuiFormControl-root': { margin: 0.5, width: 'calc(100% - 10px)' },
} as const;

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
  gap: UI_SPACING.md,
  flexWrap: 'wrap',
  justifyContent: 'center',
  mt: UI_SPACING.xs,
} as const;

/** Shared centered back-navigation row for standalone auth forms. */
export const AUTH_FORM_BACK_ACTION_SX = {
  display: 'flex',
  justifyContent: 'center',
  mt: UI_SPACING.xs,
} as const;
