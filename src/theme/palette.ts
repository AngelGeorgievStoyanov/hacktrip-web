import { UI_COLORS } from '@/constants/ui/colors';

/**
 * Complete semantic MUI palette derived from the application's design tokens.
 * Values that previously came implicitly from MUI defaults are explicit here,
 * so CSS-in-JS components resolve the same palette from one application theme.
 */
export const themePalette = {
  primary: {
    main: UI_COLORS.brand.primary,
    contrastText: UI_COLORS.text.inverse,
  },
  background: {
    default: UI_COLORS.surface.canvas,
    paper: UI_COLORS.surface.paper,
  },
  text: {
    primary: UI_COLORS.text.primary,
    secondary: UI_COLORS.text.secondary,
  },
  divider: UI_COLORS.border.divider,
  action: {
    hover: UI_COLORS.action.hover,
    selected: UI_COLORS.action.selected,
  },
} as const;
