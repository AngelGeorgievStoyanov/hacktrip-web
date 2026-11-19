import type { Theme } from '@mui/material/styles';
import { PAGE_CONTENT_PADDING, ROUTE_CONTENT_PADDING, UI_SPACING } from '@/constants/ui/spacing';
import { PANEL_SX } from '@/styles/presets/panels';
import { UI_SIZES } from '@/constants/ui/sizes';
import { HEADING_TEXT_SX } from '@/styles/presets/typography';

/** Shared layout presets used where the same page/list layout is required. */
export const PAGE_BACKGROUND_SX = {
  boxSizing: 'border-box',
  p: PAGE_CONTENT_PADDING,
} as const;

export const CARD_LIST_SX = {
  listStyle: 'none',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  p: 0,
  m: 0,
} as const;

export const commentListStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
  gap: '20px',
  alignItems: 'start',
  listStyle: 'none',
  padding: 0,
  margin: 0,
} as const;

/** Shared surface and horizontal overflow behavior for admin data tables. */
export const ADMIN_TABLE_CONTAINER_SX = {
  width: '100%',
  borderRadius: 2,
} as const;

/** Shared spacing and alignment for admin list pagination controls. */
export const ADMIN_PAGINATION_SX = {
  display: 'flex',
  gap: UI_SPACING.xs,
  alignItems: 'center',
  mt: UI_SPACING.xs,
} as const;

/** Shared layout for the account trip and favorites listing pages. */
export const ACCOUNT_LAYOUT_MAIN_SX = {
  p: ROUTE_CONTENT_PADDING,
  flex: 1,
} as const;

export const ACCOUNT_TRIPS_PAGE_SX = { width: '100%' } as const;

export const ACCOUNT_TRIPS_CONTENT_SX = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  py: { xs: UI_SPACING.lg, md: 5 },
} as const;

export const ACCOUNT_TRIPS_HEADING_SX = {
  textAlign: 'center',
  mb: { xs: UI_SPACING.md, md: UI_SPACING.lg },
  ...HEADING_TEXT_SX,
} as const;

export const ACCOUNT_TRIPS_LOADING_SX = {
  my: UI_SPACING.lg,
} as const;

export const ACCOUNT_TRIPS_ERROR_SX = {
  width: '100%',
  maxWidth: 560,
} as const;

export const ACCOUNT_TRIPS_EMPTY_STATE_SX = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  gap: UI_SPACING.lg,
  py: { xs: UI_SPACING.xxl, md: 10 },
} as const;

/** Shared centered page shell used by the home and public trip pages. */
export const CENTERED_PAGE_MAIN_SX = {
  ...PAGE_BACKGROUND_SX,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
} as const;

/** Shared vertical stack used by forms and compact content panels. */
/** Keeps trip action controls in the parent's layout without adding a wrapper box. */
export const TRIP_ACTIONS_CONTENT_SX = { display: 'contents' } as const;

export const COLUMN_STACK_SX = {
  display: 'flex',
  flexDirection: 'column',
  gap: UI_SPACING.md,
} as const;


/** Vertical point-card collection used by the Create Point flow. */
export const POINT_LIST_SX = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minWidth: 0,
} as const;


/** Create Point route composition; responsive columns remain feature-specific. */
export const CREATE_POINT_PAGE_SX = {
  width: '100%',
  maxWidth: UI_SIZES.contentMaxWidth,
  mx: 'auto',
  px: { xs: 1, sm: 2 },
  py: 2,
} as const;

export const CREATE_POINT_GRID_SX = {
  display: 'grid',
  gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 1fr)' },
  '@media (min-width:1021px)': {
    gridTemplateColumns: 'minmax(250px, 0.75fr) minmax(0, 1.6fr)',
  },
  alignItems: 'start',
  gap: { xs: 2, md: 3 },
} as const;

export const CREATE_POINT_LIST_COLUMN_SX = {
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
} as const;

export const CREATE_POINT_EDITOR_COLUMN_SX = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  minWidth: 0,
} as const;

export const CREATE_POINT_LOADING_SX = {
  display: 'flex',
  justifyContent: 'center',
  py: 4,
} as const;

export const CREATE_POINT_ERROR_ALERT_SX = { mb: 2 } as const;

/** Profile route shell and centered profile panel. */
export const ACCOUNT_PROFILE_PAGE_SX = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  minHeight: 'calc(100vh - 64px)',
  py: { xs: 2, sm: 3 },
} as const;
export const ACCOUNT_PROFILE_PANEL_SX = (theme: Theme) => ({
  ...PANEL_SX(theme),
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 2,
  width: '100%',
  maxWidth: 600,
  height: 'fit-content',
  p: { xs: 2, sm: '30px' },
} as const);
