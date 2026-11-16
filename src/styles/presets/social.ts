import type { CSSProperties } from 'react';
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

/** Compact count badge metrics shared by small social action buttons and image overlays. */
export const SOCIAL_BADGE_COMPACT_STYLE = {
  fontSize: '0.65rem',
  height: 14,
  minWidth: 14,
  padding: '0 3px',
  lineHeight: 1,
} as const;

/** Shared compact inline error text for social actions. */
export const socialErrorTextStyle: CSSProperties = {
  color: UI_COLORS.action.danger,
  fontSize: '0.75rem',
};

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
