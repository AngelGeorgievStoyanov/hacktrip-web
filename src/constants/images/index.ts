export const MAX_IMAGES_PER_ENTITY = 9;

/** Minimum horizontal swipe distance used by image and trip galleries. */
export const LIGHTBOX_SWIPE_THRESHOLD_PX = 45;

export const PROFILE_IMAGE_MAX_FILES = 1;

export const MAX_CONCURRENT_IMAGE_UPLOADS = 9;

export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

export const ACCEPTED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const;

export * from './presets';
