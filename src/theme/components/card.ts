import type { Components, Theme } from '@mui/material/styles';
import { getSurfaceStyles } from './surface';

/** All MUI Cards share one surface; component sx is reserved for layout. */
export const cardOverrides = {
  styleOverrides: {
    root: ({ theme }) => getSurfaceStyles(theme),
  },
} satisfies Components<Theme>['MuiCard'];
