import { UI_COLORS } from '@/constants/ui/colors';
import { ICON_ACTION_STYLES } from '@/styles/presets/buttons';

/** Shared gallery and fullscreen image-viewer presentation contracts. */
export const POINT_SECTION_IMAGE_FRAME_SX = {
  width: 'calc(100% + 32px)',
  mx: '-16px',
} as const;

export const DAY_IMAGE_PLACEHOLDER_FRAME_SX = {
  width: '50%',
  maxWidth: 280,
  aspectRatio: '1 / 1',
  mx: 'auto',
} as const;

export const IMAGE_LIGHTBOX_DIALOG_PAPER_SX = {
  bgcolor: UI_COLORS.surface.imageLightbox,
} as const;

export const IMAGE_LIGHTBOX_ROOT_SX = {
  position: 'relative',
  width: '100%',
  height: '100%',
} as const;

const IMAGE_LIGHTBOX_CONTROL_BASE_SX = {
  ...ICON_ACTION_STYLES.imageControl,
  position: 'absolute',
  zIndex: 2,
} as const;

export const IMAGE_LIGHTBOX_CLOSE_CONTROL_SX = {
  ...IMAGE_LIGHTBOX_CONTROL_BASE_SX,
  top: 8,
  right: 8,
} as const;

export const IMAGE_LIGHTBOX_PREVIOUS_CONTROL_SX = {
  ...IMAGE_LIGHTBOX_CONTROL_BASE_SX,
  left: 8,
  top: '50%',
  transform: 'translateY(-50%)',
} as const;

export const IMAGE_LIGHTBOX_NEXT_CONTROL_SX = {
  ...IMAGE_LIGHTBOX_CONTROL_BASE_SX,
  right: 8,
  top: '50%',
  transform: 'translateY(-50%)',
} as const;

export const IMAGE_LIGHTBOX_COUNTER_SX = {
  position: 'absolute',
  top: 18,
  left: '50%',
  transform: 'translateX(-50%)',
  color: UI_COLORS.text.inverse,
  zIndex: 2,
} as const;

export const IMAGE_LIGHTBOX_STAGE_SX = {
  position: 'absolute',
  inset: 0,
  display: 'grid',
  placeItems: 'center',
  p: { xs: 1, sm: 3 },
} as const;

export const IMAGE_LIGHTBOX_IMAGE_FRAME_SX = {
  position: 'relative',
  width: '100%',
  height: '100%',
} as const;
