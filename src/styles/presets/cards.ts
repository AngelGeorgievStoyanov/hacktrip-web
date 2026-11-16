import type { CSSProperties } from 'react';
import { UI_SIZES } from '@/constants/ui/sizes';

/**
 * Layout preset for trip cards.
 * The visual surface (background, border, radius and shadow) is owned by the MUI theme.
 */
export const CARD_CONTENT_TOP_PADDING = { padding: '25px 0px 0px 0px' } as const;

export const cardStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  alignItems: 'center',
  maxWidth: '300px',
  margin: '20px',
  maxHeight: '540px',
  width: '-webkit-fill-available',
  ...CARD_CONTENT_TOP_PADDING,
};

/** Consistent horizontal inset for text inside trip and point cards. */
export const CARD_TEXT_INSET_SX = { padding: `0px ${UI_SIZES.cardTextInset}px` } as const;
