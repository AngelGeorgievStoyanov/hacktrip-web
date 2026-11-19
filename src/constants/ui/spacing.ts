/**
 * Application spacing scale.
 * MUI's default spacing unit is 8px; numeric values are multipliers of that unit.
 */
export const UI_SPACING = {
  unit: 8,
  none: 0,
  xxs: 0.5,
  xs: 1,
  sm: 1.5,
  md: 2,
  lg: 3,
  xl: 4,
  xxl: 6,
  paginationOuter: 2.5,
} as const;

/** Existing public page gutter retained until all page layouts are migrated. */
export const PAGE_CONTENT_PADDING = '30px';

/**
 * Shared 32px content gutter for authenticated, admin and live-tracking route shells.
 * Keep distinct from the 30px public page gutter and form-panel padding.
 */
export const ROUTE_CONTENT_PADDING = '2rem';

/** Compact mobile gutter for the public About page. */
export const ABOUT_PAGE_MOBILE_PADDING = '20px 16px';
