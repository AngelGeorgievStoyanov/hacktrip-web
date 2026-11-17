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

/** Intentional tighter inset retained by the legacy PointCard visual contract. */
export const POINT_CARD_TEXT_INSET_SX = {
  padding: `0px ${UI_SIZES.pointCardTextInset}px`,
} as const;

/** Shared button spacing inside the PointCard action row. */
export const POINT_CARD_ACTION_BUTTON_SX = { margin: '5px' } as const;

/** Shared overflow handling for unbroken point names and descriptions. */
export const POINT_CARD_TEXT_WRAP_SX = { overflowWrap: 'anywhere' } as const;

/** Shared text-block spacing for trip and point card content. */
export const CARD_TEXT_BLOCK_STYLE = { margin: '0 0 0.35em' } as const;

/** Shared heading treatment for the primary title inside a trip or point card. */
export const CARD_HEADING_TEXT_STYLE = {
  ...CARD_TEXT_BLOCK_STYLE,
  fontWeight: 500,
} as const;
