import type { Components, Theme } from '@mui/material/styles';
import { getOutlinedSurfaceStyles } from './surface';

/**
 * Bordered Paper surfaces share the theme's outlined surface contract.
 * Elevated Paper instances (such as the navigation Drawer) retain MUI elevation behavior.
 */
export const paperOverrides = {
  styleOverrides: {
    root: ({ theme, ownerState }) =>
      ownerState.variant === 'outlined' ? getOutlinedSurfaceStyles(theme) : {},
  },
} satisfies Components<Theme>['MuiPaper'];
