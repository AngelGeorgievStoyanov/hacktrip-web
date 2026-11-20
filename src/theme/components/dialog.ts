import type { Components, Theme } from '@mui/material/styles';
import { getSurfaceStyles } from './surface';

/** Dialog paper shares the application surface contract without changing other Paper usages. */
export const dialogOverrides = {
  styleOverrides: {
    paper: ({ theme }) => getSurfaceStyles(theme),
  },
} satisfies Components<Theme>['MuiDialog'];
