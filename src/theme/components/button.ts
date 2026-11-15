import type { Components, Theme } from '@mui/material/styles';
import { themeTypography } from '../typography';

/** Shared MUI Button defaults. Feature-specific variants remain in style presets. */
export const buttonOverrides = {
  styleOverrides: {
    root: {
      fontFamily: themeTypography.fontFamily,
    },
  },
} satisfies Components<Theme>['MuiButton'];
