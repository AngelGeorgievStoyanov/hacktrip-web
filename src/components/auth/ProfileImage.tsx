'use client';

import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from 'react';
import CustomFileUploadButton from '@/components/CustomFileUploadButton';
import { ACCEPTED_IMAGE_MIME_TYPES, PROFILE_IMAGE_MAX_FILES } from '@/constants/images';
import { validateImageFile } from '@/lib/images/validate';
import { Box, CircularProgress, Dialog, IconButton, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AppImage } from '@/components/images/AppImage';
import { authApi } from '@/api/auth';
import { useConfirm } from '@/components/common/ConfirmDialog';
import { useNotification } from '@/components/common/NotificationProvider';
import { getGenericErrorMessage } from '@/lib/errors';
import type { ImageDto } from '@/types';
import { RemoveProfileImageIcon } from '@/constants/icons';
import {
  PROFILE_IMAGE_CONTAINER_SX,
  PROFILE_IMAGE_DELETE_ICON_SX,
  PROFILE_IMAGE_DELETE_TRIGGER_SX,
  PROFILE_IMAGE_FULLSCREEN_CLOSE_SX,
  PROFILE_IMAGE_FULLSCREEN_STAGE_SX,
  PROFILE_IMAGE_LOADING_SX,
  PROFILE_IMAGE_VIEW_TRIGGER_SX,
} from '@/styles/presets/profile-image';
import {
  PROFILE_IMAGE_UPLOAD_FIELD_SX,
  PROFILE_IMAGE_UPLOAD_PREVIEW_ROW_SX,
  PROFILE_IMAGE_UPLOAD_PREVIEW_THUMBNAIL_SX,
  PROFILE_IMAGE_UPLOAD_PREVIEW_FILENAME_SX,
  IMAGE_UPLOAD_REMOVE_BUTTON_SX,
} from '@/styles/presets/image-upload';

const ACCEPT_TYPES = (ACCEPTED_IMAGE_MIME_TYPES as readonly string[]).join(',');

export function ProfileImage({ refreshToken = 0 }: { refreshToken?: number }) {
  const { confirm } = useConfirm();
  const notification = useNotification();
  const [image, setImage] = useState<ImageDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setImage(await authApi.getProfileImage());
    } catch (error) {
      notification.error(getGenericErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [notification]);

  useEffect(() => {
    void load();
  }, [load, refreshToken]);

  async function handleDelete(): Promise<void> {
    if (!image) return;
    const confirmed = await confirm(
      'Are you sure you want to delete your profile image?',
      'Delete profile image',
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      await authApi.deleteProfileImage();
      setImage(null);
      setFullscreen(false);
      notification.success('Profile image deleted.');
    } catch (error) {
      notification.error(getGenericErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <Box sx={PROFILE_IMAGE_LOADING_SX}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (!image) return null;

  return (
    <>
      <Box sx={PROFILE_IMAGE_CONTAINER_SX}>
        <Tooltip title="Delete profile image" arrow>
          <Box
            component="button"
            type="button"
            aria-label="Delete profile image"
            onClick={() => void handleDelete()}
            disabled={deleting}
            sx={PROFILE_IMAGE_DELETE_TRIGGER_SX}
          >
            <RemoveProfileImageIcon sx={PROFILE_IMAGE_DELETE_ICON_SX} />
          </Box>
        </Tooltip>
        <Tooltip title="View profile image" arrow>
          <Box
            component="button"
            type="button"
            aria-label="View profile image full screen"
            onClick={() => setFullscreen(true)}
            sx={PROFILE_IMAGE_VIEW_TRIGGER_SX}
          >
            <AppImage image={image} alt="Profile image" preset="profile" fill />
          </Box>
        </Tooltip>
      </Box>
      <Dialog open={fullscreen} onClose={() => setFullscreen(false)} maxWidth="xl" fullWidth>
        <Box sx={PROFILE_IMAGE_FULLSCREEN_STAGE_SX}>
          <IconButton
            aria-label="Close full screen image"
            onClick={() => setFullscreen(false)}
            sx={PROFILE_IMAGE_FULLSCREEN_CLOSE_SX}
          >
            <CloseIcon />
          </IconButton>
          <AppImage
            image={image}
            alt="Profile image full screen"
            useThumbnail={false}
            preset="profileLightbox"
          />
        </Box>
      </Dialog>
    </>
  );
}

interface ProfileImageUploadProps {
  selectedFile: File | null;
  onSelectedFileChange: (file: File | null) => void;
}

export function ProfileImageUpload({
  selectedFile,
  onSelectedFileChange,
}: ProfileImageUploadProps) {
  const notification = useNotification();
  const previewUrl = useMemo(
    () => (selectedFile ? URL.createObjectURL(selectedFile) : null),
    [selectedFile],
  );

  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl],
  );

  function handleFilesChange(event: ChangeEvent<HTMLInputElement>): void {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!file) return;
    const validationError = validateImageFile(file);
    if (validationError) {
      notification.error(validationError);
      return;
    }
    onSelectedFileChange(file);
  }

  return (
    <Box sx={PROFILE_IMAGE_UPLOAD_FIELD_SX}>
      <CustomFileUploadButton
        handleFilesChange={handleFilesChange}
        images={[]}
        fileSelected={selectedFile ? [selectedFile] : []}
        iconFotoCamera={false}
        maxImages={PROFILE_IMAGE_MAX_FILES}
        accept={ACCEPT_TYPES}
        multiple={false}
      />
      {selectedFile && previewUrl ? (
        <Box sx={PROFILE_IMAGE_UPLOAD_PREVIEW_ROW_SX}>
          <Box
            component="img"
            src={previewUrl}
            alt="Selected profile image preview"
            sx={PROFILE_IMAGE_UPLOAD_PREVIEW_THUMBNAIL_SX}
          />
          <Box component="span" sx={PROFILE_IMAGE_UPLOAD_PREVIEW_FILENAME_SX}>
            {selectedFile.name}
          </Box>
          <Tooltip title="Remove selected image" arrow>
            <IconButton
              aria-label="Remove selected image"
              sx={IMAGE_UPLOAD_REMOVE_BUTTON_SX}
              onClick={() => onSelectedFileChange(null)}
              size="small"
            >
              <RemoveProfileImageIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ) : null}
    </Box>
  );
}
