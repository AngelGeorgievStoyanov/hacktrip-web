import type { Components, Theme } from '@mui/material/styles';

/** Explicit application defaults; these match MUI's current defaults and do not alter appearance. */
export const textFieldOverrides = {
  defaultProps: {
    variant: 'outlined',
    size: 'medium',
  },
} satisfies Components<Theme>['MuiTextField'];
