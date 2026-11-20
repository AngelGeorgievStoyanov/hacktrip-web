import { UI_COLORS } from '@/constants/ui/colors';
import { UI_SHAPE } from '@/constants/ui/shape';
import { MAP_POINT_PICKER_HEIGHT } from '@/constants/maps';
import { BREAKPOINTS, mediaDown } from '@/constants/ui';
import { BUTTON_STYLES } from '@/styles/presets/buttons';

/** Shared layout and semantic variants for the AddressAutocomplete owner. */
export const ADDRESS_AUTOCOMPLETE_ROOT_SX = { width: '100%', minWidth: 0 } as const;
export const ADDRESS_AUTOCOMPLETE_ROW_SX = { width: '100%', minWidth: 0 } as const;
export const ADDRESS_AUTOCOMPLETE_FIELD_WRAP_SX = {
  flex: '1 1 0',
  width: '100%',
  minWidth: 0,
  '& .MuiFormControl-root': { width: '100%' },
} as const;
export const ADDRESS_AUTOCOMPLETE_SEARCH_BUTTON_SX = {
  flex: '0 1 auto',
  width: { xs: '100%', sm: 'auto' },
  minWidth: 0,
  whiteSpace: 'nowrap',
} as const;
export const ADDRESS_AUTOCOMPLETE_EXTRA_ACTION_SX = {
  flex: '1 1 0',
  width: '100%',
  minWidth: 0,
  display: 'flex',
  '& > *': { width: '100%' },
} as const;

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
export const getGoogleMapFrameSx = (maxWidth: number | string, height: number | string) =>
  ({
    display: 'flex',
    width: '100%',
    maxWidth,
    minWidth: 0,
    height,
  }) as const;

/** Loading placeholder mirrors the exact dimensions of the map it replaces. */
export const getGoogleMapLoadingSx = (maxWidth: number | string, height: number | string) =>
  ({
    display: 'grid',
    placeItems: 'center',
    width: '100%',
    maxWidth,
    height,
  }) as const;

/** Google Maps SDK mapContainerStyle config; this is not a React style prop. */
export const getGoogleMapContainerStyle = (height: number | string) =>
  ({
    width: '100%',
    height: typeof height === 'number' ? `${height}px` : height,
  }) as const;

/** Shared loading indicator size for the map renderer. */
export const GOOGLE_MAP_LOADING_INDICATOR_SIZE = 28;

/** Compact geolocation loading indicator used beside the point-picker action. */
export const POINT_LOCATION_GPS_LOADING_INDICATOR_SIZE = 14;

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

/** Feature-specific presentation is selected semantically; callers cannot inject sx objects. */
export const ADDRESS_AUTOCOMPLETE_VARIANTS = {
  form: { container: {}, input: {}, button: {} },
  pointPicker: {
    container: {
      width: { xs: '100%', sm: 'auto' },
      flex: { xs: '0 1 auto', sm: '1 1 190px' },
      minWidth: 0,
      maxWidth: { xs: 420, sm: 420 },
      alignSelf: { xs: 'center', sm: 'stretch' },
    },
    input: { ...MAP_ADDRESS_INPUT_SX, width: '100%', minWidth: 0 },
    button: { width: { xs: '100%', sm: 'auto' }, minHeight: 40, m: 0, ...BUTTON_STYLES.primary },
  },
  tripPicker: {
    container: { width: '100%' },
    input: { ...MAP_ADDRESS_INPUT_SX, m: 0 },
    button: {
      m: 0,
      minHeight: 56,
      backgroundColor: 'primary.main',
      '&.Mui-disabled': {
        backgroundColor: 'primary.main',
        color: UI_COLORS.text.inverse,
        opacity: 1,
      },
      ...BUTTON_STYLES.primary,
    },
  },
} as const;

export const TRIP_LOCATION_REMOVE_MARKER_BUTTON_SX = {
  ...BUTTON_STYLES.removeMarker,
  minHeight: 56,
  whiteSpace: 'nowrap',
} as const;

/** Compose the shared root frame with the selected feature layout. */
export const getAddressAutocompleteRootSx = (variant: keyof typeof ADDRESS_AUTOCOMPLETE_VARIANTS) =>
  [ADDRESS_AUTOCOMPLETE_ROOT_SX, ADDRESS_AUTOCOMPLETE_VARIANTS[variant].container] as const;

/** Compose the shared search action with the selected feature layout. */
export const getAddressAutocompleteSearchButtonSx = (
  variant: keyof typeof ADDRESS_AUTOCOMPLETE_VARIANTS,
) =>
  [ADDRESS_AUTOCOMPLETE_SEARCH_BUTTON_SX, ADDRESS_AUTOCOMPLETE_VARIANTS[variant].button] as const;
