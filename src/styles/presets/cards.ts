import { UI_SIZES } from '@/constants/ui/sizes';
import { ICON_ACTION_STYLES } from '@/styles/presets/buttons';

/**
 * Layout preset for trip cards.
 * The visual surface (background, border, radius and shadow) is owned by the MUI theme.
 */
export const TRIP_CARD_SX = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  alignItems: 'center',
  maxWidth: '300px',
  m: '20px',
  maxHeight: '540px',
  width: '-webkit-fill-available',
  pt: '25px',
} as const;

/** Fixed geometry and internal layout contracts for the shared TripCard. */
export const TRIP_CARD_HEIGHT = '540px';
export const TRIP_CARD_CONTAINER_SX = {
  width: '352px',
  maxWidth: 'calc(100vw - 40px)',
  height: TRIP_CARD_HEIGHT,
  minHeight: TRIP_CARD_HEIGHT,
  maxHeight: TRIP_CARD_HEIGHT,
  boxSizing: 'border-box',
  overflow: 'hidden',
} as const;
export const getTripCardEmptyContainerSx = (isMobile: boolean) => ({
  height: isMobile ? 'fit-content' : 'auto',
  maxHeight: '500px',
});
export const TRIP_CARD_TITLE_SX = { textAlign: 'center' } as const;
export const TRIP_CARD_HEADER_SX = {
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  width: '100%', height: '105px', minHeight: '105px', boxSizing: 'border-box', overflow: 'hidden',
} as const;
export const getTripCardEmptyHeaderSx = (isMobile: boolean) => ({
  ...TRIP_CARD_HEADER_SX, height: isMobile ? 'auto' : '-webkit-fill-available',
});
export const TRIP_CARD_IMAGE_FRAME_SX = {
  position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center',
  width: '100%', height: '200px', minHeight: '200px', overflow: 'hidden', bgcolor: 'action.hover',
} as const;
export const TRIP_CARD_SOCIAL_COUNTS_SX = {
  display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center',
  gap: 0.5, width: '100%', height: '58px', minHeight: '58px', px: 2, boxSizing: 'border-box',
} as const;
export const TRIP_CARD_STEPPER_SPACE_SX = { height: '20px', minHeight: '20px', width: '100%' } as const;
export const TRIP_CARD_CONTENT_SX = {
  display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
  minHeight: 0, py: 1, '&:last-child': { pb: 1 },
} as const;
export const TRIP_CARD_SOCIAL_ROW_SX = { display: 'flex', alignItems: 'center', gap: 1 } as const;
export const TRIP_CARD_PAGINATION_SX = { marginTop: 2 } as const;
export const TRIP_CARD_DESCRIPTION_SX = {
  display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden', textAlign: 'center',
} as const;
export const TRIP_CARD_STEPPER_SX = { width: '-webkit-fill-available', flexGrow: 1, maxHeight: '20px' } as const;

/** Shared top inset for content inside trip and point cards. */
export const CARD_CONTENT_TOP_PADDING = { paddingTop: '25px' } as const;

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


/** PointCard structure and action geometry; its surface skin remains MUI theme-owned. */
export const POINT_CARD_WRAPPER_SX = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
} as const;

export const POINT_CARD_CONTAINER_SX = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: 'min(300px, calc(100vw - 32px))',
  minWidth: { xs: 0, sm: 290 },
  maxWidth: 300,
  my: '10px',
  p: '15px 0',
} as const;

export const getPointCardMoveButtonSx = (visible: boolean) => ({
  ...ICON_ACTION_STYLES.reorder,
  visibility: visible ? 'visible' : 'hidden',
  p: 0.25,
} as const);

export const POINT_CARD_ACTION_ROW_SX = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
} as const;

export const POINT_CARD_MAP_HEIGHT = 150;
