import { UI_COLORS } from '@/constants/ui/colors';
import { UI_SHAPE } from '@/constants/ui/shape';
import { UI_SHADOWS } from '@/constants/ui/shadows';
import { BUTTON_STYLES, ICON_ACTION_STYLES } from '@/styles/presets/buttons';

/** Shared profile-image display, action and fullscreen-view contracts. */
export const PROFILE_IMAGE_LOADING_SX = {
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  py: 2,
} as const;

export const PROFILE_IMAGE_CONTAINER_SX = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: 'min(300px, 75vw)',
  mb: 1,
} as const;

export const PROFILE_IMAGE_DELETE_TRIGGER_SX = {
  ...ICON_ACTION_STYLES.base,
  display: 'flex',
  p: 0,
  border: 0,
  background: 'transparent',
  cursor: 'pointer',
  mt: '20px',
  position: 'relative',
  translate: '0 28px',
  zIndex: 1,
} as const;

export const PROFILE_IMAGE_DELETE_ICON_SX = {
  backgroundColor: UI_COLORS.text.inverse,
  borderRadius: UI_SHAPE.circularRadius,
} as const;

export const PROFILE_IMAGE_VIEW_TRIGGER_SX = {
  ...ICON_ACTION_STYLES.base,
  display: 'block',
  position: 'relative',
  width: '100%',
  height: 'min(300px, 75vw)',
  p: 0,
  border: '1px solid',
  borderRadius: UI_SHAPE.circularRadius,
  overflow: 'hidden',
  boxShadow: UI_SHADOWS.profileImageControl,
  cursor: 'pointer',
  background: 'transparent',
} as const;

export const PROFILE_IMAGE_FULLSCREEN_STAGE_SX = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '50vh',
  maxHeight: '90vh',
  p: 2,
  backgroundColor: UI_COLORS.surface.imageLightbox,
} as const;

export const PROFILE_IMAGE_FULLSCREEN_CLOSE_SX = {
  ...ICON_ACTION_STYLES.imageControl,
  position: 'absolute',
  top: 8,
  right: 8,
  zIndex: 2,
} as const;

/** Compact profile-image presentation used by admin user views. */
export const ADMIN_PROFILE_AVATAR_SX = {
  width: 88,
  height: 88,
  flexShrink: 0,
  cursor: 'zoom-in',
  p: 0,
  border: 0,
} as const;

export const ADMIN_PROFILE_AVATAR_READONLY_SX = {
  ...ADMIN_PROFILE_AVATAR_SX,
  bgcolor: 'action.selected',
  cursor: 'default',
} as const;

/** Avatar used as a native button in the admin profile-image editor. */
export const ADMIN_PROFILE_AVATAR_INTERACTIVE_SX = {
  ...ICON_ACTION_STYLES.base,
  ...ADMIN_PROFILE_AVATAR_SX,
  bgcolor: 'action.selected',
} as const;

/** Avatar used as a clickable display surface in the admin users list. */
export const ADMIN_PROFILE_AVATAR_LIST_INTERACTIVE_SX = {
  width: 88,
  height: 88,
  flexShrink: 0,
  cursor: 'zoom-in',
  bgcolor: 'action.selected',
} as const;


/** Upload/replace action alignment for the admin profile-image editor. */
export const ADMIN_PROFILE_IMAGE_UPLOAD_BUTTON_SX = {
  ...BUTTON_STYLES.upload,
  alignSelf: 'flex-start',
} as const;
