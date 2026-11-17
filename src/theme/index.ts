import { createTheme } from '@mui/material/styles';
import { UI_COLORS } from '@/constants/ui/colors';
import { MUI_BREAKPOINTS } from '@/constants/ui/breakpoints';
import { ABOUT_PAGE_MOBILE_PADDING, PAGE_CONTENT_PADDING, UI_SPACING } from '@/constants/ui/spacing';
import { UI_SIZES } from '@/constants/ui/sizes';
import { UI_Z_INDEX } from '@/constants/ui/z-index';
import { UI_SHAPE } from '@/constants/ui/shape';
import { themePalette } from './palette';
import { themeShape } from './shape';
import { themeTypography } from './typography';
import { buttonOverrides } from './components/button';
import { cardOverrides } from './components/card';
import { dialogOverrides } from './components/dialog';
import { textFieldOverrides } from './components/text-field';

/**
 * Central MUI theme configuration.
 * Shared MUI defaults belong here; page and component layout remain locally scoped.
 */
export const theme = createTheme({
  palette: themePalette,
  typography: {
    ...themeTypography,
  },
  breakpoints: {
    values: MUI_BREAKPOINTS,
  },
  shape: themeShape,
  spacing: UI_SPACING.unit,
  zIndex: UI_Z_INDEX,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          /* Variables are emitted only for values consumed by plain CSS/CSS Modules. */
          '--ht-button-padding': `${UI_SIZES.wideButtonPaddingY}px ${UI_SIZES.wideButtonPaddingX}px`,
          '--ht-shape-border-radius': `${themeShape.borderRadius}px`,
          '--ht-spacing-xxs': `${UI_SPACING.xxs * UI_SPACING.unit}px`,
          '--ht-spacing-xs': `${UI_SPACING.xs * UI_SPACING.unit}px`,
          '--ht-spacing-sm': `${UI_SPACING.sm * UI_SPACING.unit}px`,
          '--ht-spacing-md': `${UI_SPACING.md * UI_SPACING.unit}px`,
          '--ht-spacing-lg': `${UI_SPACING.lg * UI_SPACING.unit}px`,
          '--ht-page-content-padding': PAGE_CONTENT_PADDING,
          '--ht-page-mobile-content-padding': ABOUT_PAGE_MOBILE_PADDING,
          '--ht-shape-legal-toc-radius': `${UI_SHAPE.legalTocRadius}px`,
          '--ht-button-font-size': themeTypography.button.fontSize,
          '--ht-button-font-weight': themeTypography.button.fontWeight,
          '--ht-button-letter-spacing': themeTypography.button.letterSpacing,
          '--ht-button-line-height': themeTypography.button.lineHeight,
          '--ht-button-text-transform': themeTypography.button.textTransform,
          '--ht-color-primary': UI_COLORS.brand.primary,
          '--ht-color-primary-hover': UI_COLORS.brand.primaryHover,
          '--ht-color-surface-page': UI_COLORS.surface.page,
          '--ht-color-text-primary': UI_COLORS.text.primary,
          '--ht-color-text-inverse': UI_COLORS.text.inverse,
          '--ht-color-action-contrast-background': UI_COLORS.action.contrastBackground,
          '--ht-color-action-danger-hover': UI_COLORS.action.dangerHover,
          '--ht-color-border-legal': UI_COLORS.legal.border,
          '--ht-color-legal-link': UI_COLORS.legal.link,
          '--ht-color-legal-back-background': UI_COLORS.legal.backBackground,
          '--ht-color-decorative-heading-shadow': UI_COLORS.decorative.headingShadow,
        },
      },
    },
    MuiButton: buttonOverrides,
    MuiCard: cardOverrides,
    MuiDialog: dialogOverrides,
    MuiTextField: textFieldOverrides,
  },
});
