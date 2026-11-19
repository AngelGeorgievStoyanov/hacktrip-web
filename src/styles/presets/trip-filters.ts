import { UI_COLORS } from '@/constants/ui/colors';
import { BREAKPOINTS, mediaDown } from '@/constants/ui/breakpoints';
import { UI_SPACING } from '@/constants/ui/spacing';

/** Responsive shell for the public trip filter toolbar. */
export const TRIP_FILTERS_TOOLBAR_SX = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  [mediaDown(BREAKPOINTS.tripsFilters)]: {
    flexDirection: 'column',
  },
} as const;

/** Responsive row containing the group, transport and sort selectors. */
export const TRIP_FILTERS_SELECT_GROUP_SX = {
  display: 'flex',
  flexDirection: 'row',
  [mediaDown(BREAKPOINTS.tripsFilters)]: {
    flexDirection: 'column',
    width: '100%',
  },
} as const;

/** Responsive width and spacing shared by the three trip selectors. */
export const TRIP_FILTER_SELECT_BOX_SX = {
  minWidth: { xs: 200, sm: 180 },
  margin: { xs: '5px', sm: '3px' },
  width: { xs: '100%', sm: 'auto' },
} as const;

export const TRIP_FILTER_LABEL_SX = { color: UI_COLORS.text.inverse } as const;
export const TRIP_FILTER_SELECT_SX = { color: UI_COLORS.text.inverse } as const;

/** Search field container; responsive width preserves the legacy toolbar behavior. */
export const TRIP_FILTER_SEARCH_BOX_SX = {
  minWidth: 220,
  margin: '5px',
  width: { xs: '100%', sm: 'auto' },
} as const;

/** Search surface and hover state, using the same translucent white values as before. */
export const TRIP_FILTER_SEARCH_SURFACE_SX = {
  position: 'relative',
  borderRadius: 1,
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.25)' },
  marginLeft: 0,
  width: '100%',
  '@media (min-width:600px)': {
    marginLeft: UI_SPACING.xs,
    width: 'auto',
  },
} as const;

export const TRIP_FILTER_SEARCH_ICON_SX = {
  padding: '0 16px',
  height: '100%',
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
} as const;

export const TRIP_FILTER_SEARCH_BUTTON_SX = {
  display: 'flex',
  padding: 0,
  border: 0,
  background: 'none',
  color: 'inherit',
  cursor: 'pointer',
  '&:focus-visible': {
    outline: '2px solid',
    outlineColor: UI_COLORS.text.inverse,
    outlineOffset: 2,
  },
} as const;

export const TRIP_FILTER_SEARCH_INPUT_SX = {
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: '8px 8px 8px 0',
    paddingLeft: 'calc(1em + 32px)',
    transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    width: '100%',
    '@media (min-width:600px)': {
      width: '12ch',
      '&:focus': { width: '20ch' },
    },
  },
} as const;
