import type { Theme } from '@mui/material/styles';

/** One shared visual contract for elevated application surfaces. */
export function getSurfaceStyles(theme: Theme) {
  return {
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
  };
}
