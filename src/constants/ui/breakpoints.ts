/**
 * The legacy application used exact pixel thresholds instead of generic responsive
 * breakpoints. These values are the `max-width` of the legacy `useMediaQuery`/`@media`
 * rules they came from, so they are kept verbatim rather than mapped onto MUI defaults.
 *
 * Consumed by the header (`desktopNav`, `headerCompact`), trips filters (`tripsFilters`),
 * home heading (`homeHeading`), trip map (`tripDetails`, `smallPhone`) and trip card
 * (`tripCard`). CSS Modules keep their local media queries because CSS cannot import TS tokens.
 */
export const BREAKPOINTS = {
  /** Legacy header switched to the drawer menu here. */
  desktopNav: 900,
  /** Legacy header switches to its compact toolbar layout here. */
  headerCompact: 760,
  /** Legacy trip details switched to the stacked `column-reverse` layout here. */
  tripDetails: 900,
  /** Legacy trip card changed its height/fill behavior here. */
  tripCard: 700,
  /** Legacy trips filter toolbar stacked into a column here. */
  tripsFilters: 670,
  /** Legacy small-phone overrides (profile, images, image lists). */
  smallPhone: 600,
  /** Legacy home page split its scramble heading into two lines below this width. */
  homeHeading: 550,
} as const;

/** Media query string for `useMediaQuery`, e.g. `(max-width:900px)`. */
export function maxWidthQuery(px: number): string {
  return `(max-width:${px}px)`;
}

/** Minimum-width media query string for `useMediaQuery`, e.g. `(min-width:550px)`. */
export function minWidthQuery(px: number): string {
  return `(min-width:${px}px)`;
}

/** `sx` media query key for max-width rules, e.g. `@media(max-width:900px)`. */
export function mediaDown(px: number): string {
  return `@media(max-width:${px}px)`;
}
