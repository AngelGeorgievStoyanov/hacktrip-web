import type { Components, Theme } from '@mui/material/styles';
import { getSurfaceStyles } from './surface';

/**
 * One visual contract for every MUI Card:
 * surface colors, border, radius and elevation come from the active theme.
 * Component-level sx is reserved for content layout and dimensions.
 */
export const cardOverrides = {
  defaultProps: {
    elevation: 1,
  },
  styleOverrides: {
    root: ({ theme }) => getSurfaceStyles(theme),
  },
} satisfies Components<Theme>['MuiCard'];
