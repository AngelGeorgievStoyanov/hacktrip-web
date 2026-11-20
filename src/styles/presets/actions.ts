import { UI_COLORS } from '@/constants/ui/colors';

/** Base contract shared by every icon-only action across the application. */
export const ACTION_ICON_BASE_SX = {
  borderRadius: '50%',
  '&:focus-visible': {
    outline: '2px solid',
    outlineColor: 'primary.main',
    outlineOffset: 3,
  },
} as const;

const actionIconDanger = { ...ACTION_ICON_BASE_SX, color: 'error.main' } as const;

/** Shared icon-action variants. Components own behavior; this module owns presentation. */
export const ICON_ACTION_STYLES = {
  base: ACTION_ICON_BASE_SX,
  primary: { ...ACTION_ICON_BASE_SX, color: 'primary.main' },
  upload: { ...ACTION_ICON_BASE_SX, color: 'primary.main' },
  removeSelection: ACTION_ICON_BASE_SX,
  passwordVisibility: ACTION_ICON_BASE_SX,
  reorder: ACTION_ICON_BASE_SX,
  like: ACTION_ICON_BASE_SX,
  favorite: ACTION_ICON_BASE_SX,
  share: ACTION_ICON_BASE_SX,
  edit: ACTION_ICON_BASE_SX,
  save: ACTION_ICON_BASE_SX,
  cancel: ACTION_ICON_BASE_SX,
  disclosure: ACTION_ICON_BASE_SX,
  submit: ACTION_ICON_BASE_SX,
  delete: actionIconDanger,
  danger: actionIconDanger,
  report: {
    ...ACTION_ICON_BASE_SX,
    '&:hover': { color: UI_COLORS.action.danger },
  },
  imageControl: {
    ...ACTION_ICON_BASE_SX,
    color: UI_COLORS.text.inverse,
    backgroundColor: UI_COLORS.surface.imageControl,
    '&:hover': { backgroundColor: UI_COLORS.surface.imageControlHover },
  },
} as const;

/** Common layout for groups of related icon or compact actions. */
export const ACTION_GROUP_SX = {
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 1,
} as const;

/** Photo-overlay actions keep icons fully opaque while the background stays translucent. */
export const ACTION_IMAGE_OVERLAY_SX = ICON_ACTION_STYLES.imageControl;
