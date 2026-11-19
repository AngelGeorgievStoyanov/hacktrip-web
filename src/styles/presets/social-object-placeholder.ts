import { UI_COLORS } from '@/constants/ui/colors';

/** Shared visual contract for the decorative no-photo social-object fallback. */
export const SOCIAL_OBJECT_PLACEHOLDER_ROOT_SX = {
  position: 'relative',
  display: 'block',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  bgcolor: UI_COLORS.surface.socialPlaceholder,
} as const;

export const SOCIAL_OBJECT_PLACEHOLDER_OVERLAY_SX = {
  position: 'absolute',
  right: 0,
  bottom: 0,
  left: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 0.25,
  px: 2,
  py: 1.25,
  color: UI_COLORS.text.inverse,
  textAlign: 'center',
  background: UI_COLORS.decorative.socialPlaceholderOverlay,
} as const;

export const SOCIAL_OBJECT_PLACEHOLDER_TITLE_SX = {
  fontSize: '0.95rem',
  fontWeight: 600,
  lineHeight: 1.3,
} as const;

export const SOCIAL_OBJECT_PLACEHOLDER_DESCRIPTION_SX = {
  fontSize: '0.72rem',
  lineHeight: 1.3,
  opacity: 0.95,
} as const;
