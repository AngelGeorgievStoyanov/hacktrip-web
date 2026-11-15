/**
 * Semantic MUI elevation levels.
 * These values select entries from the MUI theme shadow scale; they are not CSS shadows.
 */
export const UI_ELEVATION = {
  none: 0,
  surface: 1,
  raised: 4,
  overlay: 8,
} as const;

/** Legacy CSS shadow retained for components not yet migrated to theme elevation. */
export const UI_SHADOWS = {
  card: '3px 2px 5px black',
} as const;
