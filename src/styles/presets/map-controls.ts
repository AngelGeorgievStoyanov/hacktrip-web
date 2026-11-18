import { UI_COLORS } from '@/constants/ui/colors';
import { UI_SHAPE } from '@/constants/ui/shape';
import { MAP_POINT_PICKER_HEIGHT } from '@/constants/maps';
import { BREAKPOINTS, mediaDown } from '@/constants/ui';

/** Shared visual treatment for address autocomplete fields in map pickers. */
export const MAP_ADDRESS_INPUT_SX = {
  backgroundColor: UI_COLORS.map.addressBackground,
  borderRadius: UI_SHAPE.mapAddressInputRadius,
  '& .MuiInputBase-root': { color: UI_COLORS.map.addressText },
  '& .MuiInputLabel-root': { color: UI_COLORS.map.addressLabel },
  '& .MuiInputLabel-root.Mui-focused': { color: 'primary.main' },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: UI_COLORS.map.addressBorder,
  },
  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: UI_COLORS.map.addressBorderHover,
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'primary.main',
  },
} as const;


/** Shared renderer frame; each feature supplies its own map dimensions. */
export const getGoogleMapFrameSx = (maxWidth: number | string, height: number | string) => ({
  display: 'flex',
  width: '100%',
  maxWidth,
  minWidth: 0,
  height,
} as const);

/** Loading placeholder mirrors the exact dimensions of the map it replaces. */
export const getGoogleMapLoadingSx = (maxWidth: number | string, height: number | string) => ({
  display: 'grid',
  placeItems: 'center',
  width: '100%',
  maxWidth,
  height,
} as const);

/** Point picker outer stack and action row retain their feature-specific responsive layout. */
export const POINT_LOCATION_PICKER_STACK_SX = {
  width: '100%',
  maxWidth: 600,
  minWidth: 0,
  mx: 'auto',
} as const;

export const POINT_LOCATION_ACTIONS_SX = {
  width: '100%',
  maxWidth: 600,
  minWidth: 0,
  mx: 'auto',
  justifyContent: 'space-around',
  boxSizing: 'border-box',
  '& > .MuiButton-root': {
    width: { xs: '100%', sm: 'auto' },
    minHeight: 40,
    maxWidth: { xs: 420, sm: 'none' },
    alignSelf: { xs: 'center', sm: 'auto' },
    boxSizing: 'border-box',
  },
} as const;

export const MAP_PICKER_SNACKBAR_SX = {
  position: 'relative',
  left: 0,
  right: 0,
} as const;

/** Trip location frame remains fixed-height while the renderer fills it. */
export const TRIP_LOCATION_MAP_FRAME_SX = {
  position: 'relative',
  width: '100%',
  height: MAP_POINT_PICKER_HEIGHT,
  overflow: 'hidden',
} as const;

export const TRIP_LOCATION_HINT_SX = {
  position: 'absolute',
  bottom: 8,
  left: 8,
  bgcolor: UI_COLORS.map.pickerHintBackground,
  px: 1,
  py: 0.5,
} as const;

/** Trip details map shell and its independent point-navigation stepper. */
export const TRIP_MAP_SECTION_CARD_SX = {
  boxSizing: 'content-box',
  height: 'fit-content',
  width: '100%',
  maxWidth: 600,
  [mediaDown(BREAKPOINTS.smallPhone)]: {
    display: 'flex',
    flexDirection: 'column',
    width: '94vw',
  },
} as const;

export const TRIP_MAP_SECTION_STEPPER_SX = {
  maxWidth: 600,
  flexGrow: 1,
  maxHeight: '25px',
} as const;
