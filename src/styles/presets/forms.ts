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

/** Location picker frame above the trip create form. */
export const TRIP_FORM_LOCATION_WRAPPER_SX = {
  width: 'min(100%, 600px)',
  mx: 'auto',
  px: { xs: 2, sm: 0 },
  mb: 1,
} as const;

/** Main trip create form layout; Card surface remains theme-owned. */
export const TRIP_FORM_SX = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  boxSizing: 'border-box',
  width: 'min(100%, 620px)',
  mx: 'auto',
  height: 'fit-content',
  minWidth: 0,
  p: { xs: 2, sm: '30px' },
  mb: '5px',
  gap: 1,
  '& .MuiFormControl-root': {
    m: '4px',
    width: '100%',
    minWidth: 0,
  },
  '& .MuiButton-root': { m: 1 },
  '@media (max-width: 600px)': { p: 2 },
} as const;

/** Heading and validation message contracts for the trip create form. */
export const TRIP_FORM_TITLE_SX = {
  m: '10px auto',
  textTransform: 'uppercase',
  textAlign: 'center',
} as const;
export const TRIP_FORM_ERROR_SX = { mx: 1 } as const;

/** Day number row in the trip create form. */
export const TRIP_FORM_DAY_NUMBER_ROW_SX = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  flexWrap: 'wrap',
  m: '4px',
} as const;

/** Responsive price and currency field row. */
export const TRIP_FORM_PRICE_CURRENCY_ROW_SX = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 1,
  width: '100%',
  minWidth: 0,
  '& > *': { minWidth: 0, flex: '1 1 0' },
  '@media (max-width: 480px)': { flexDirection: 'column' },
} as const;
export const TRIP_FORM_CURRENCY_WRAPPER_SX = {
  flex: '0 0 150px',
  width: '150px',
  minWidth: 0,
  '@media (max-width: 480px)': { flex: '1 1 auto', width: '100%' },
} as const;

/** Responsive action row and button geometry for trip creation. */
export const TRIP_FORM_ACTIONS_SX = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  mt: 1,
  '& .MuiButton-root': {
    m: 1,
    minWidth: { xs: 'calc(50% - 16px)', sm: '150px' },
    maxWidth: '220px',
    minHeight: 36,
    px: 1.5,
    py: 0.75,
    fontSize: { xs: '0.7rem', sm: '0.75rem' },
    lineHeight: 1.2,
    whiteSpace: 'normal',
    overflowWrap: 'anywhere',
    textTransform: 'uppercase',
  },
} as const;

/** Parent-owned responsive grid for the edit-trip map, form and image regions. */
export const EDIT_TRIP_PAGE_SX = (contentMaxWidth: number) => ({
  width: '100%',
  maxWidth: contentMaxWidth,
  mx: 'auto',
  px: { xs: 1, sm: 2 },
  py: { xs: 2, sm: 2 },
  display: 'grid',
  gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'repeat(2, minmax(0, 1fr))' },
  gridTemplateAreas: {
    xs: '"images" "map" "form"',
    lg: '"map map" "form images"',
  },
  alignItems: 'start',
  gap: 2,
});
export const EDIT_TRIP_MAP_WRAPPER_SX = {
  gridArea: 'map',
  width: '100%',
  maxWidth: 600,
  mx: 'auto',
} as const;
export const EDIT_TRIP_FORM_SX = (theme: Theme) => ({
  ...PANEL_SX(theme),
  gridArea: 'form',
  boxSizing: 'border-box',
  m: { xs: 0, sm: 2 },
  p: { xs: 2, sm: '30px' },
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: 1,
  width: 'min(100%, 520px)',
  flex: '0 1 520px',
  minWidth: 0,
  height: 'fit-content',
  '& .MuiFormControl-root': FORM_CONTROL_INSET_SX,
  '& .MuiButton-root': { m: 1 },
});
export const EDIT_TRIP_TITLE_SX = {
  m: '10px auto',
  textTransform: 'uppercase',
  textAlign: 'center',
} as const;
export const EDIT_TRIP_DAY_ROW_SX = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  '@media (max-width: 600px)': { flexDirection: 'column' },
} as const;
export const EDIT_TRIP_DAY_FIELD_SX = {
  maxWidth: 90,
  pointerEvents: 'none',
  '& input': { textAlign: 'center' },
} as const;
export const EDIT_TRIP_PRICE_CURRENCY_ROW_SX = {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  gap: 1,
} as const;
export const EDIT_TRIP_PRICE_CURRENCY_ITEM_SX = { flex: 1, minWidth: 0 } as const;
export const EDIT_TRIP_ACTIONS_SX = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'center',
} as const;
export const EDIT_TRIP_IMAGES_SECTION_SX = {
  gridArea: 'images',
  boxSizing: 'border-box',
  width: 'min(100%, 520px)',
  flex: '0 1 520px',
  minWidth: 0,
  m: { xs: 0, sm: 2 },
  p: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
} as const;
export const EDIT_TRIP_IMAGE_GRID_SX = {
  display: 'grid',
  width: '100%',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: 1,
} as const;
export const EDIT_TRIP_IMAGE_TILE_SX = {
  position: 'relative',
  width: '100%',
  aspectRatio: '1 / 1',
  overflow: 'hidden',
  border: '1px solid var(--ht-color-border-subtle)',
  p: 0.5,
} as const;
export const EDIT_TRIP_IMAGE_PLACEHOLDER_SX = {
  width: '50%',
  maxWidth: 280,
  aspectRatio: '1 / 1',
  mx: 'auto',
} as const;
export const EDIT_TRIP_IMAGE_DELETE_SX = {
  position: 'absolute',
  top: 4,
  right: 4,
  backgroundColor: 'var(--ht-color-action-trip-image-control-background)',
  '&:hover': {
    backgroundColor: 'var(--ht-color-action-trip-image-control-background-hover)',
  },
} as const;
