import { UI_COLORS } from '@/constants/ui/colors';
import { UI_SHAPE } from '@/constants/ui/shape';
import { ROUTE_CONTENT_PADDING } from '@/constants/ui/spacing';
import { BUTTON_STYLES } from '@/styles/presets/buttons';

/** Live tracking map frame and Google Maps SDK configuration. */
export const getLiveTrackingMapFrameSx = (height: number) =>
  ({
    width: '100%',
    height,
    border: 1,
    borderColor: 'divider',
    borderRadius: UI_SHAPE.sxRadius1,
    overflow: 'hidden',
  }) as const;

/** Google Maps API configuration object, not a React style prop. */
export const LIVE_TRACKING_MAP_CONTAINER_STYLE = {
  width: '100%',
  height: '100%',
} as const;

/** Google Maps PolylineF SDK options. */
export const LIVE_TRACKING_POLYLINE_OPTIONS = {
  strokeColor: UI_COLORS.brand.primary,
  strokeOpacity: 0.9,
  strokeWeight: 4,
  geodesic: true,
} as const;

/** Centered loading state within the map frame. */
export const LIVE_TRACKING_MAP_LOADING_SX = {
  display: 'grid',
  placeItems: 'center',
  width: '100%',
  height: '100%',
} as const;

/** Tracking control row and status alignment. */
export const LIVE_TRACKING_ACTIONS_SX = {
  display: 'flex',
  gap: 1,
  alignItems: 'center',
  flexWrap: 'wrap',
} as const;
export const LIVE_TRACKING_STATUS_SX = { alignSelf: 'center' } as const;

/** Start/Stop are explicit semantic actions; Reset and Follow retain MUI defaults. */
export const LIVE_TRACKING_BUTTON_STYLES = {
  start: BUTTON_STYLES.primary,
  stop: BUTTON_STYLES.danger,
} as const;

/** Responsive telemetry grid and per-value frame. */
export const LIVE_TRACKING_STATS_GRID_SX = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' },
  gap: 1,
  m: 0,
} as const;
export const LIVE_TRACKING_STAT_SX = {
  border: 1,
  borderColor: 'divider',
  borderRadius: UI_SHAPE.sxRadius1,
  p: 1,
} as const;
export const LIVE_TRACKING_STAT_VALUE_SX = { m: 0 } as const;

/** Public live-tracking route content gutter. */
export const LIVE_TRACKING_PAGE_MAIN_SX = { p: ROUTE_CONTENT_PADDING } as const;
