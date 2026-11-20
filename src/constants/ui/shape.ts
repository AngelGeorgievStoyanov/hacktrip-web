/** Shared shape tokens for MUI, component presets and plain CSS renderers. */
export const UI_SHAPE = {
  /** MUI theme default, expressed in CSS pixels. */
  borderRadius: 4,
  /** Shared outer surface radius for Trip, Point, authentication and profile panels. */
  featureSurfaceRadius: 0,
  /** MUI sx borderRadius multipliers (theme.shape.borderRadius × multiplier). */
  sxRadius1: 1,
  sxRadius2: 2,
  sxRadius2_5: 2.5,
  sxRadius3: 3,
  /** Explicit CSS-pixel radii used outside MUI sx. */
  mapAddressInputRadius: 5,
  uploadPreviewListRadius: 5,
  legalTocRadius: 6,
  ogBrandMarkRadius: 14,
  /** Circular avatar and icon treatments. */
  circularRadius: '50%',
} as const;
