import { UI_COLORS } from '@/constants/ui/colors';
import { UI_SPACING } from '@/constants/ui/spacing';
import { UI_SHADOWS } from '@/constants/ui/shadows';

/** Shared alignment for like, favorite, report and moderation action groups. */
export const SOCIAL_ACTIONS_SX = {
  display: 'flex',
  gap: UI_SPACING.xs,
  alignItems: 'center',
  flexWrap: 'wrap',
} as const;

/** Compact social-action alignment used by the point editor action row. */
export const POINT_SOCIAL_ACTIONS_SX = {
  ...SOCIAL_ACTIONS_SX,
  gap: 0.25,
  my: 0,
} as const;

/** Compact count badge metrics shared by small social action buttons and image overlays. */
export const SOCIAL_BADGE_COMPACT_STYLE = {
  fontSize: '0.65rem',
  height: 14,
  minWidth: 14,
  padding: '0 3px',
  lineHeight: 1,
} as const;

/** Shared compact inline error text for social actions. */
export const SOCIAL_ERROR_TEXT_SX = {
  color: UI_COLORS.action.danger,
  fontSize: '0.75rem',
} as const;

/** Shared visual treatment for social controls rendered over images or maps. */
export const SOCIAL_OVERLAY_SX = {
  position: 'absolute',
  top: 8,
  right: 8,
  zIndex: 2,
  p: 0.35,
  border: `1px solid ${UI_COLORS.surface.socialOverlayBorder}`,
  borderRadius: 3,
  backgroundColor: UI_COLORS.surface.socialOverlay,
  boxShadow: UI_SHADOWS.socialOverlay,
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  '& .MuiIconButton-root': { color: 'common.white' },
  '& .MuiIconButton-root:hover': { backgroundColor: UI_COLORS.surface.socialOverlayHover },
} as const;

/** Shared sticky social-action surface used below trip-day navigation. */
export const STICKY_SOCIAL_SX = {
  display: 'inline-flex',
  maxWidth: 'calc(100% - 32px)',
  ml: { xs: 2, sm: 3 },
  mt: 1,
  px: 0.75,
  py: 0.5,
  border: 1,
  borderColor: 'divider',
  borderRadius: 2.5,
  backgroundColor: UI_COLORS.surface.stickySocial,
  boxShadow: 1,
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
} as const;

/** Inline social controls and their non-wrapping action row. */
export const SOCIAL_ENGAGEMENT_INLINE_SX = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
  margin: '0.25rem 0',
} as const;
export const getSocialEngagementActionsSx = (actionsJustify: 'flex-start' | 'space-around') => ({
  display: 'flex',
  gap: 1,
  alignItems: 'center',
  flexWrap: 'nowrap',
  justifyContent: actionsJustify,
  width: '100%',
} as const);
export const TRIP_GROUP_SOCIAL_ACTIONS_SX = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.25,
  flexWrap: 'wrap',
} as const;
