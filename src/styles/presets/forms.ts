import type { Theme } from '@mui/material/styles';
import { UI_SPACING } from '@/constants/ui/spacing';
import { COLUMN_STACK_SX } from './layouts';
import { PANEL_SX } from './panels';

/** Compact day-number field: dimensions and non-editable numeric display. */
export const DAY_NUMBER_FIELD_SX = {
  width: '76px',
  '& input': { textAlign: 'center' },
  '& .MuiInputBase-root': { pointerEvents: 'none' },
} as const;

/** Shared nested form-control inset used by point and trip editing forms. */
export const FORM_CONTROL_INSET_SX = { m: 0.5, width: 'calc(100% - 10px)' } as const;

/** Shared panel layout for the create/edit Point form wrappers. */
export const POINT_FORM_PANEL_SX = {
  p: { xs: 2, sm: '30px' },
  width: '100%',
  maxWidth: 600,
  minWidth: 0,
  boxSizing: 'border-box',
  '& .MuiFormControl-root': FORM_CONTROL_INSET_SX,
} as const;

/** Shared field stack for the profile and change-password forms. */
export const ACCOUNT_FORM_FIELDS_SX = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5,
  width: '100%',
  '& .MuiTextField-root': { width: 'calc(100% - 10px)', mx: '5px' },
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


/** Point form panel variant used below the map in the Create Point editor. */
export const POINT_FORM_PANEL_WITH_TOP_MARGIN_SX = {
  ...POINT_FORM_PANEL_SX,
  mt: 2.5,
} as const;
