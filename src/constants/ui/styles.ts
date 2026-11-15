/**
 * Backward-compatible exports while consumers are migrated to their owning modules.
 * New code should import tokens from constants/ui, MUI presets from styles/presets,
 * and component-specific styles from the component itself.
 */
export { COLORS } from './colors';
export { CARD_BORDER, UI_SHAPE } from './shape';
export { CARD_SHADOW, UI_SHADOWS } from './shadows';
export { TYPOGRAPHY } from './typography';
export { BUTTON_STYLES } from '@/styles/presets/buttons';
export { FORM_PANEL_SX } from '@/styles/presets/forms';
export {
  headingTextStyle,
  pageBackgroundStyle,
  cardListStyle,
  cardStyle,
  infoPanelStyle,
  commentsPanelStyle,
  commentListStyle,
  commentCardStyle,
} from '@/styles/presets/legacy';
