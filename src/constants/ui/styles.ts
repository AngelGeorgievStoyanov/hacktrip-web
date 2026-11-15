/**
 * Backward-compatible exports for legacy style consumers.
 * New reusable styles belong in src/styles/presets; tokens belong in this directory.
 */
export { COLORS } from './colors';
export { UI_SHADOWS } from './shadows';
export { UI_SHAPE } from './shape';
export { TYPOGRAPHY } from './typography';

/** Legacy card and panel border retained until those consumers are migrated. */
export const CARD_BORDER = 'solid 1px';

/** Legacy card and panel shadow retained until those consumers are migrated. */
export const CARD_SHADOW = '3px 2px 5px black';
