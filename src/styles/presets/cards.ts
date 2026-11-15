import type { CSSProperties } from 'react';

/**
 * Layout preset for trip cards.
 * The visual surface (background, border, radius and shadow) is owned by the MUI theme.
 */
export const cardStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  alignItems: 'center',
  maxWidth: '300px',
  margin: '20px',
  maxHeight: '540px',
  width: '-webkit-fill-available',
  padding: '25px 0px 0px 0px',
};
