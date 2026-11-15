import type { CSSProperties } from 'react';
import { PAGE_CONTENT_PADDING } from '@/constants/ui/spacing';
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

/** Shared spacing and alignment for admin list pagination controls. */
export const ADMIN_PAGINATION_SX = {
  display: 'flex',
  gap: 1,
  alignItems: 'center',
  mt: 1,
} as const;

/** Shared layout for the account trip and favorites listing pages. */
export const ACCOUNT_TRIPS_PAGE_SX = { width: '100%' } as const;

export const ACCOUNT_TRIPS_CONTENT_SX = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  py: { xs: 3, md: 5 },
} as const;

export const ACCOUNT_TRIPS_HEADING_SX = {
  textAlign: 'center',
  mb: { xs: 2, md: 3 },
  ...headingTextStyle,
} as const;

export const ACCOUNT_TRIPS_EMPTY_STATE_SX = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  gap: 3,
  py: { xs: 6, md: 10 },
} as const;

/** Shared centered page shell used by the home and public trip pages. */
export const CENTERED_PAGE_MAIN_STYLE: CSSProperties = {
  ...pageBackgroundStyle,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};
