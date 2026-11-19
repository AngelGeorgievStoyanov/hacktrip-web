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

/** Main form stack used by the point create/edit flow. */
export const POINT_FORM_SX = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
  minWidth: 0,
  width: '100%',
  maxWidth: '100%',
  alignItems: 'stretch',
  '& .MuiFormControl-root': FORM_CONTROL_INSET_SX,
} as const;

/** Centered heading for the point create/edit form. */
export const POINT_FORM_TITLE_SX = { margin: '10px auto' } as const;

/** Alignment for the point form's standalone map-search action. */
export const POINT_FORM_FIND_MAP_ROW_SX = {
  display: 'flex',
  justifyContent: 'flex-start',
  width: '100%',
} as const;

/** Responsive action stack for point form submit/navigation controls. */
export const POINT_FORM_ACTIONS_SX = {
  display: 'flex',
  '@media (max-width:610px)': {
    flexDirection: 'column',
    alignItems: 'center',
  },
} as const;

/** Shared dimensions for point form submit and adjacent actions. */
export const POINT_FORM_ACTION_BUTTON_SX = {
  width: '32ch',
  m: 1,
  '@media (max-width:610px)': {
    width: 'calc(100% - 16px)',
  },
} as const;

/** Password requirement list layout and item alignment. */
export const PASSWORD_REQUIREMENTS_LIST_SX = {
  listStyle: 'none',
  p: 0,
  m: '-8px 0 0 4px',
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
  gap: 0.75,
} as const;

export const PASSWORD_REQUIREMENT_ITEM_SX = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.75,
} as const;
