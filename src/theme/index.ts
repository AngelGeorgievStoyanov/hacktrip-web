import { createTheme } from '@mui/material/styles';
import { UI_COLORS } from '@/constants/ui/colors';
import { ABOUT_EDITORIAL_TYPOGRAPHY, TYPOGRAPHY } from '@/constants/ui/typography';
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
import { paperOverrides } from './components/paper';
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
          '--ht-spacing-footer-horizontal': `${UI_SIZES.footerHorizontalPadding}px`,
          '--ht-pagination-item-min-size': `${UI_SIZES.paginationItemMinSize}px`,
          '--ht-pagination-item-padding-y': `${UI_SIZES.paginationItemPaddingY}px`,
          '--ht-pagination-item-padding-x': `${UI_SIZES.paginationItemPaddingX}px`,
          '--ht-focus-outline-width': `${UI_SIZES.focusOutlineWidth}px`,
          '--ht-focus-outline-offset': `${UI_SIZES.focusOutlineOffset}px`,
          '--ht-font-weight-semibold': `${TYPOGRAPHY.fontWeightSemiBold}`,
          '--ht-font-size-body1': TYPOGRAPHY.body1.fontSize,
          '--ht-about-font-family': ABOUT_EDITORIAL_TYPOGRAPHY.fontFamily,
          '--ht-about-font-weight': `${ABOUT_EDITORIAL_TYPOGRAPHY.fontWeight}`,
          '--ht-about-heading-margin': ABOUT_EDITORIAL_TYPOGRAPHY.headingMargin,
          '--ht-about-h1-size': ABOUT_EDITORIAL_TYPOGRAPHY.h1,
          '--ht-about-h2-size': ABOUT_EDITORIAL_TYPOGRAPHY.h2,
          '--ht-about-h3-size': ABOUT_EDITORIAL_TYPOGRAPHY.h3,
          '--ht-about-h3-line-height': `${ABOUT_EDITORIAL_TYPOGRAPHY.h3LineHeight}`,
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
    MuiPaper: paperOverrides,
    MuiTextField: textFieldOverrides,
  },
});
