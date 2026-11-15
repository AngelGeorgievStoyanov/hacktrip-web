import { createTheme } from '@mui/material/styles';
import { COLORS, UI_COLORS } from '@/constants/ui/colors';
import { UI_SPACING } from '@/constants/ui/spacing';
import { UI_Z_INDEX } from '@/constants/ui/z-index';
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
  shape: themeShape,
  spacing: UI_SPACING.unit,
  zIndex: UI_Z_INDEX,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          /* Semantic variables for new CSS Module and plain CSS consumers. */
          '--ht-color-primary': UI_COLORS.brand.primary,
          '--ht-color-primary-hover': UI_COLORS.brand.primaryHover,
          '--ht-color-surface-page': UI_COLORS.surface.page,
          '--ht-color-surface-card': UI_COLORS.surface.card,
          '--ht-color-text-primary': UI_COLORS.text.primary,
          '--ht-color-text-inverse': UI_COLORS.text.inverse,
          '--ht-color-action-danger-hover': UI_COLORS.action.dangerHover,
          '--ht-color-border-legal': UI_COLORS.legal.border,

          /* Legacy variables remain until every old consumer is migrated. */
          '--ht-color-brand': COLORS.brand,
          '--ht-color-page-background': COLORS.pageBackground,
          '--ht-color-card-background': COLORS.cardBackground,
          '--ht-color-comment-card-background': COLORS.commentCardBackground,
          '--ht-color-form-panel-background': COLORS.formPanelBackground,
          '--ht-color-dialog-background': COLORS.dialogBackground,
          '--ht-color-sticky-social-background': COLORS.stickySocialBackground,
          '--ht-color-button-hover': COLORS.buttonHover,
          '--ht-color-danger-hover': COLORS.dangerHover,
          '--ht-color-secondary-button-background': COLORS.secondaryButtonBackground,
          '--ht-color-secondary-button-hover-text': COLORS.secondaryButtonHoverText,
          '--ht-color-secondary-button-hover-background': COLORS.secondaryButtonHoverBackground,
          '--ht-color-text-light': COLORS.textLight,
          '--ht-color-text-dark': COLORS.textDark,
          '--ht-color-legal-link': COLORS.legalLink,
          '--ht-color-legal-border': COLORS.legalBorder,
          '--ht-color-legal-back-background': COLORS.legalBackBackground,
          '--ht-color-heading-shadow': COLORS.headingShadow,
          '--ht-color-map-address-input-background': COLORS.mapAddressInputBackground,
          '--ht-color-map-address-input-text': COLORS.mapAddressInputText,
          '--ht-color-map-address-input-label': COLORS.mapAddressInputLabel,
          '--ht-color-map-address-input-border': COLORS.mapAddressInputBorder,
          '--ht-color-map-address-input-border-hover': COLORS.mapAddressInputBorderHover,
        },
      },
    },
    MuiButton: buttonOverrides,
    MuiCard: cardOverrides,
    MuiDialog: dialogOverrides,
    MuiTextField: textFieldOverrides,
  },
});
