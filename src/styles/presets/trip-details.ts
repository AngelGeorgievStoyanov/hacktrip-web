import { CARD_CONTENT_TOP_PADDING, CARD_HEADING_TEXT_STYLE, CARD_TEXT_BLOCK_STYLE, CARD_TEXT_INSET_SX } from '@/styles/presets/cards';
import { POINT_SECTION_IMAGE_FRAME_SX } from '@/styles/presets/image-gallery';
import { PAGE_CONTENT_PADDING } from '@/constants/ui/spacing';

/** Trip information card and metadata composition. */
export const TRIP_DETAILS_CARD_SX = {
  display: 'flex',
  flexDirection: 'column',
  minWidth: '320px',
  maxWidth: '450px',
  m: '20px',
  p: '25px',
} as const;
export const TRIP_DETAILS_HEADER_SX = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  mb: 1,
} as const;
export const TRIP_DETAILS_TITLE_SX = CARD_HEADING_TEXT_STYLE;
export const TRIP_DETAILS_PRICE_ROW_SX = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '8px',
} as const;
export const TRIP_DETAILS_PRICE_LABEL_SX = CARD_TEXT_BLOCK_STYLE;
export const TRIP_DETAILS_PRICE_VALUE_SX = { ...CARD_TEXT_BLOCK_STYLE, m: 0 } as const;
export const TRIP_DETAILS_METADATA_SX = CARD_TEXT_BLOCK_STYLE;
export const TRIP_DETAILS_DESCRIPTION_SX = {
  ...CARD_TEXT_BLOCK_STYLE,
  ...CARD_TEXT_INSET_SX,
  mt: '10px',
} as const;
export const getTripDetailsDescriptionToggleSx = (expanded: boolean) => ({
  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
  transition: 'transform 150ms',
  ml: 'auto',
} as const);
export const TRIP_DETAILS_ACTIONS_COLUMN_SX = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: 1,
  mt: 1,
  width: '100%',
} as const;
export const TRIP_DETAILS_SOCIAL_ROW_SX = {
  display: 'flex',
  justifyContent: 'space-around',
  width: '100%',
  mt: 1,
} as const;

/** Sticky day-navigation shell; the CSS Module continues to own the page grid. */
export const getTripDetailsStickyHeaderSx = () => ({
  position: 'sticky',
  top: 0,
  zIndex: 'appBar',
  width: `calc(100% + ${PAGE_CONTENT_PADDING} + ${PAGE_CONTENT_PADDING})`,
  marginLeft: -PAGE_CONTENT_PADDING,
  marginRight: -PAGE_CONTENT_PADDING,
  marginTop: -PAGE_CONTENT_PADDING,
  pb: 1,
  backgroundColor: 'transparent',
} as const);

/** Point section frame/content contracts; parent frame owns its geometry. */
export const POINT_SECTION_CARD_SX = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: '500px',
  m: '20px auto',
  ...CARD_CONTENT_TOP_PADDING,
} as const;
export const POINT_SECTION_CONTENT_SX = { width: '100%', boxSizing: 'border-box' } as const;
export const POINT_SECTION_EMPTY_IMAGE_FRAME_SX = {
  ...POINT_SECTION_IMAGE_FRAME_SX,
  aspectRatio: '1 / 1',
} as const;
export const POINT_SECTION_DESCRIPTION_SX = {
  ...CARD_TEXT_INSET_SX,
  mt: '10px',
} as const;
export const POINT_SECTION_ACTION_ROW_SX = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  flexWrap: 'wrap',
  mt: 1,
} as const;
export const POINT_SECTION_NOTE_SX = {
  ...CARD_TEXT_BLOCK_STYLE,
  padding: '0px 25px',
} as const;
export const POINT_SECTION_TITLE_SX = { ...CARD_TEXT_INSET_SX, ...CARD_HEADING_TEXT_STYLE } as const;
