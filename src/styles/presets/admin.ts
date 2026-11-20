import type { Theme } from '@mui/material/styles';
import { UI_SHAPE } from '@/constants/ui/shape';
import { ICON_ACTION_STYLES } from '@/styles/presets/buttons';
import { ADMIN_PAGINATION_SX } from '@/styles/presets/layouts';
import { COLUMN_STACK_SX } from '@/styles/presets/layouts';
import { PANEL_SX } from '@/styles/presets/panels';

/** User directory heading, responsive grid and card contracts. */
export const ADMIN_USERS_TITLE_SX = { mb: 2 } as const;
export const ADMIN_USERS_GRID_SX = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
  gap: 2,
} as const;
export const ADMIN_USER_CARD_SX = {
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  p: 1,
  '& .MuiTypography-root': { overflowWrap: 'anywhere' },
} as const;
export const ADMIN_USER_CARD_CONTENT_SX = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1.25,
  flexGrow: 1,
} as const;
export const ADMIN_USER_CARD_IDENTITY_SX = { minWidth: 0 } as const;
export const ADMIN_USER_CARD_ACTIONS_SX = { p: 1 } as const;
export const ADMIN_USERS_PAGINATION_SX = { ...ADMIN_PAGINATION_SX, mt: 2 } as const;

/** Selected-row toolbar for bulk admin log actions. */
export const ADMIN_SELECTION_TOOLBAR_SX = {
  my: 1,
  display: 'flex',
  gap: 1,
  alignItems: 'center',
} as const;

/** Route-not-found diagnostic disclosure content. */
export const ADMIN_DIAGNOSTIC_FIELD_SX = { minWidth: 0 } as const;
export const ADMIN_DIAGNOSTIC_LABEL_SX = { mb: 0.5 } as const;
export const ADMIN_DIAGNOSTIC_PRE_SX = {
  m: 0,
  p: 1,
  maxWidth: '100%',
  overflow: 'auto',
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
  borderRadius: UI_SHAPE.sxRadius1,
  bgcolor: 'action.hover',
  fontFamily: 'monospace',
  fontSize: '0.8rem',
} as const;
export const ADMIN_ROUTE_DETAILS_SX = {
  display: 'grid',
  gap: 2,
  p: 2,
} as const;
export const getAdminRouteExpandedCellSx = (isExpanded: boolean) => ({
  p: 0,
  borderBottom: isExpanded ? undefined : 0,
} as const);

/** Missing-thumbnail review and preview contracts. */
export const ADMIN_IMAGES_PAGE_SX = { mt: 2 } as const;
export const ADMIN_IMAGES_DESCRIPTION_SX = { mb: 2 } as const;
export const ADMIN_IMAGES_ALERT_SX = { mb: 2 } as const;
export const ADMIN_IMAGES_TOOLBAR_SX = {
  display: 'flex',
  gap: 1,
  alignItems: 'center',
  mb: 2,
  flexWrap: 'wrap',
} as const;
export const ADMIN_IMAGES_PAGINATION_ROW_SX = {
  display: 'flex',
  gap: 1,
  alignItems: 'center',
} as const;
export const ADMIN_IMAGES_PAGINATION_SX = { ...ADMIN_PAGINATION_SX, mt: 2 } as const;
export const ADMIN_IMAGE_PREVIEW_TRIGGER_SX = {
  display: 'block',
  p: 0,
  border: 0,
  background: 'transparent',
  cursor: 'zoom-in',
  lineHeight: 0,
} as const;
export const ADMIN_IMAGE_THUMBNAIL_SX = {
  width: 88,
  height: 66,
  objectFit: 'cover',
  borderRadius: UI_SHAPE.sxRadius1,
  border: 1,
  borderColor: 'divider',
} as const;
export const ADMIN_IMAGE_URL_CELL_SX = {
  maxWidth: 280,
  overflowWrap: 'anywhere',
} as const;
export const ADMIN_IMAGE_PREVIEW_CLOSE_SX = {
  ...ICON_ACTION_STYLES.base,
  position: 'absolute',
  right: 8,
  top: 8,
} as const;
export const ADMIN_IMAGE_PREVIEW_CONTENT_SX = { p: 2 } as const;
export const ADMIN_IMAGE_PREVIEW_SX = {
  display: 'block',
  maxWidth: 'min(85vw, 1100px)',
  maxHeight: '75vh',
  objectFit: 'contain',
} as const;

/** Admin user edit panel and back-navigation placement. */
export const ADMIN_USER_FORM_PANEL_SX = (theme: Theme) => ({
  ...PANEL_SX(theme),
  ...COLUMN_STACK_SX,
  width: '100%',
  maxWidth: 760,
  mx: 'auto',
  p: { xs: 2, sm: 3 },
});
export const ADMIN_USER_FORM_BACK_SX = {
  alignSelf: 'flex-start',
  mt: 1,
} as const;

/** Password-field disclosure stack in the admin user editor. */
export const ADMIN_USER_PASSWORD_FIELDS_SX = { display: 'flex', flexDirection: 'column', gap: 1 } as const;

/** Admin section navigation layout; active/inactive button states remain MUI variants. */
export const ADMIN_NAVIGATION_SX = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 1,
  mb: 3,
  pb: 2,
  borderBottom: 1,
  borderColor: 'divider',
} as const;
