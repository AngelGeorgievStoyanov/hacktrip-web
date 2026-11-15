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
} as const;

/** Existing page gutter retained until all page layouts are migrated. */
export const PAGE_CONTENT_PADDING = '30px';
