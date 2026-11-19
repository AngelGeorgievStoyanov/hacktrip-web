import { UI_COLORS } from '@/constants/ui/colors';
import { UI_SIZES } from '@/constants/ui/sizes';
import { BUTTON_STYLES } from '@/styles/presets/buttons';

/** Shared image upload field composition and feedback states. */
export const IMAGE_UPLOAD_FIELD_ROOT_SX = { display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0, width: '100%' } as const;
export const IMAGE_UPLOAD_FIELD_HEADER_SX = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 } as const;
export const IMAGE_UPLOAD_FIELD_STATUS_ROW_SX = { display: 'flex', alignItems: 'center', gap: 1 } as const;
export const IMAGE_UPLOAD_FIELD_COUNT_SX = { mr: 1 } as const;
export const IMAGE_UPLOAD_FIELD_LIMIT_MESSAGE_SX = { color: 'error.main' } as const;
export const IMAGE_UPLOAD_PROCESSING_INDICATOR_SIZE = UI_SIZES.smallIndicator;

export const IMAGE_UPLOAD_PREVIEW_LIST_SX = {
  display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 200, overflowY: 'auto',
  border: `1px solid ${UI_COLORS.border.strong}`, borderRadius: '5px', p: '6px', m: '6px',
} as const;
export const IMAGE_UPLOAD_PREVIEW_ROW_SX = {
  display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, p: 1,
  border: '1px solid', borderColor: 'divider', borderRadius: 1,
} as const;
export const IMAGE_UPLOAD_PREVIEW_THUMBNAIL_SX = { width: 55, height: 45, objectFit: 'cover', flexShrink: 0 } as const;
export const IMAGE_UPLOAD_PREVIEW_FILENAME_SX = { flex: 1, minWidth: 0, overflowWrap: 'anywhere' } as const;
export const IMAGE_UPLOAD_REMOVE_BUTTON_SX = { color: 'error.main' } as const;
export const IMAGE_UPLOAD_REMOVE_ALL_ICON_SX = { alignSelf: 'flex-start' } as const;
export const IMAGE_UPLOAD_REMOVE_ALL_BUTTON_SX = { ...BUTTON_STYLES.primary, alignSelf: 'flex-start' } as const;

export const PROFILE_IMAGE_UPLOAD_FIELD_SX = { display: 'flex', flexDirection: 'column', gap: 1, width: '100%', alignItems: 'center' } as const;
export const PROFILE_IMAGE_UPLOAD_PREVIEW_ROW_SX = { ...IMAGE_UPLOAD_PREVIEW_ROW_SX, width: '100%', maxWidth: 360 } as const;
export const PROFILE_IMAGE_UPLOAD_PREVIEW_THUMBNAIL_SX = { ...IMAGE_UPLOAD_PREVIEW_THUMBNAIL_SX, borderRadius: 1 } as const;
export const PROFILE_IMAGE_UPLOAD_PREVIEW_FILENAME_SX = { flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } as const;

export const CUSTOM_FILE_UPLOAD_BUTTON_CONTAINER_SX = { width: '30ch' } as const;
export const CUSTOM_FILE_UPLOAD_BUTTON_SX = BUTTON_STYLES.primary;
export const CUSTOM_FILE_UPLOAD_ICON_BUTTON_SX = { color: 'primary.main' } as const;
