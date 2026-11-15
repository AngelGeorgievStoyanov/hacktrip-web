import { createTheme } from '@mui/material/styles';
import { COLORS } from '@/constants/ui/colors';
import { UI_SHAPE } from '@/constants/ui/shape';
import { TYPOGRAPHY } from './typography';

/**
 * Central MUI theme configuration.
 * Shared MUI defaults belong here; page and component layout remain locally scoped.
 */
export const theme = createTheme({
  palette: {
    primary: {
      main: COLORS.brand,
    },
  },
  typography: {
    fontFamily: TYPOGRAPHY.fontFamily,
  },
  shape: {
    borderRadius: UI_SHAPE.borderRadius,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          '--ht-color-brand': COLORS.brand,
          '--ht-color-page-background': COLORS.pageBackground,
          '--ht-color-card-background': COLORS.cardBackground,
          '--ht-color-comment-card-background': COLORS.commentCardBackground,
          '--ht-color-form-panel-background': COLORS.formPanelBackground,
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
          '--ht-color-dialog-background': COLORS.dialogBackground,
          '--ht-color-heading-shadow': COLORS.headingShadow,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: TYPOGRAPHY.fontFamily,
        },
      },
    },
  },
});
