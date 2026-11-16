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

/** Special-purpose CSS shadows retained for controls that are not MUI surfaces. */
export const UI_SHADOWS = {
  profileImageControl: '3px 2px 5px black',
  socialOverlay: '0 4px 14px rgba(0,0,0,0.3)',
} as const;
