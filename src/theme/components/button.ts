import type { Components, Theme } from '@mui/material/styles';

/**
 * Shared MUI Button typography and shape.
 * Colors and interaction states remain owned by the active palette and variants.
 */
export const buttonOverrides = {
  styleOverrides: {
    root: ({ theme }) => ({
      fontFamily: theme.typography.button.fontFamily,
      fontSize: theme.typography.button.fontSize,
      fontWeight: theme.typography.button.fontWeight,
      letterSpacing: theme.typography.button.letterSpacing,
      lineHeight: theme.typography.button.lineHeight,
      textTransform: theme.typography.button.textTransform,
      borderRadius: theme.shape.borderRadius,
    }),
  },
} satisfies Components<Theme>['MuiButton'];
