import type { CSSProperties } from 'react';
import { PAGE_CONTENT_PADDING, UI_SPACING } from '@/constants/ui/spacing';
import { headingTextStyle } from '@/styles/presets/typography';

/** Shared layout presets used where the same page/list layout is required. */
export const pageBackgroundStyle: CSSProperties = {
  boxSizing: 'border-box',
  padding: PAGE_CONTENT_PADDING,
};

export const cardListStyle: CSSProperties = {
  listStyle: 'none',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  padding: 0,
  margin: 0,
};

export const commentListStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
  gap: '20px',
  alignItems: 'start',
  listStyle: 'none',
  padding: 0,
  margin: 0,
};

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
  ...headingTextStyle,
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
export const CENTERED_PAGE_MAIN_STYLE: CSSProperties = {
  ...pageBackgroundStyle,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

/** Shared vertical stack used by forms and compact content panels. */
export const COLUMN_STACK_SX = {
  display: 'flex',
  flexDirection: 'column',
  gap: UI_SPACING.md,
} as const;
