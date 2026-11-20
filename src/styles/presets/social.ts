import { UI_COLORS } from '@/constants/ui/colors';
import { UI_SPACING } from '@/constants/ui/spacing';
import { UI_SHADOWS } from '@/constants/ui/shadows';
import { UI_SHAPE } from '@/constants/ui/shape';
import { ACTION_GROUP_SX } from '@/styles/presets/actions';

/** Shared alignment for like, favorite, report and moderation action groups. */
export const SOCIAL_ACTIONS_SX = {
  ...ACTION_GROUP_SX,
  gap: UI_SPACING.xs,
} as const;

/** Compact social-action alignment used by the point editor action row. */
export const POINT_SOCIAL_ACTIONS_SX = {
  ...SOCIAL_ACTIONS_SX,
  gap: 0.25,
  my: 0,
} as const;

/** Compact loading wrapper for social configuration feedback. */
export const SOCIAL_CONFIG_STATUS_WRAPPER_SX = {
  display: 'inline-flex',
  p: 0.5,
} as const;

/** Count badges display plain text without the default colored pill background. */
export const SOCIAL_BADGE_COUNT_STYLE = {
  backgroundColor: 'transparent',
  color: 'inherit',
  minWidth: 'auto',
  height: 'auto',
  padding: 0,
  borderRadius: 0,
  boxShadow: 'none',
} as const;

/** Shared count-only badge styling for all social counters. */
export const SOCIAL_BADGE_COUNT_SX = {
  '& .MuiBadge-badge': SOCIAL_BADGE_COUNT_STYLE,
} as const;

/** Compact count metrics shared by small social action buttons and image overlays. */
export const SOCIAL_BADGE_COMPACT_STYLE = {
  ...SOCIAL_BADGE_COUNT_STYLE,
  fontSize: '0.65rem',
  lineHeight: 1,
} as const;

/** Shared compact inline error text for social actions. */
export const SOCIAL_ERROR_TEXT_SX = {
  color: UI_COLORS.action.danger,
  fontSize: '0.75rem',
} as const;

/** Plain-number badge styling shared by Like/Favorite controls. */
export const getSocialBadgeSx = (size: 'small' | 'medium') =>
  ({
    '& .MuiBadge-badge': size === 'small' ? SOCIAL_BADGE_COMPACT_STYLE : SOCIAL_BADGE_COUNT_STYLE,
  }) as const;

/** Shared visual treatment for social controls rendered over images or maps. */
export const SOCIAL_OVERLAY_SX = {
  position: 'absolute',
  top: 8,
  right: 8,
  zIndex: 2,
  p: 0.35,
  border: `1px solid ${UI_COLORS.surface.socialOverlayBorder}`,
  borderRadius: `${UI_SHAPE.socialOverlayRadiusPx}px`,
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
  borderRadius: `${UI_SHAPE.socialStickyRadiusPx}px`,
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
export const getSocialEngagementActionsSx = (actionsJustify: 'flex-start' | 'space-around') =>
  ({
    display: 'flex',
    gap: 1,
    alignItems: 'center',
    flexWrap: 'nowrap',
    justifyContent: actionsJustify,
    width: '100%',
  }) as const;
export const TRIP_GROUP_SOCIAL_ACTIONS_SX = {
  ...ACTION_GROUP_SX,
  gap: 0.25,
} as const;

/** Dynamic like feedback animation remains supplied by the shared animation hook. */
export const getSocialLikeAnimationSx = (animation: string | undefined) => ({ animation }) as const;

/** Runtime size variant for social controls rendered over an image. */
export const getSocialOverlaySx = (size: 'small' | 'medium') =>
  [
    SOCIAL_OVERLAY_SX,
    {
      '& .MuiIconButton-root': { p: size === 'small' ? 0.5 : 0.65 },
      '& .MuiBadge-badge': {
        ...(size === 'small' ? SOCIAL_BADGE_COMPACT_STYLE : {}),
      },
    },
  ] as const;

/** Report dialog and tooltip-wrapper layout contracts. */
export const REPORT_BUTTON_TOOLTIP_WRAPPER_SX = { display: 'inline-flex' } as const;
export const REPORT_BUTTON_REASON_FIELD_SX = { mt: 1 } as const;
