'use client';

import { type ChangeEvent, type FC } from 'react';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import { UploadIcon } from '@/constants/icons';
import { MAX_IMAGES_PER_ENTITY } from '@/constants/images';
import {
  CUSTOM_FILE_UPLOAD_BUTTON_CONTAINER_SX, CUSTOM_FILE_UPLOAD_BUTTON_SX,
  CUSTOM_FILE_UPLOAD_ICON_BUTTON_SX,
} from '@/styles/presets/image-upload';

interface CustomFileUploadButtonProps {
  handleFilesChange: (event: ChangeEvent<HTMLInputElement>) => void;
  images: string[];
  fileSelected: File[];
  iconFotoCamera: boolean;
  disabled?: boolean;
  maxImages?: number;
  accept?: string;
  multiple?: boolean;
}

const CustomFileUploadButton: FC<CustomFileUploadButtonProps> = ({
  handleFilesChange,
  images,
  fileSelected,
  iconFotoCamera,
  disabled = false,
  maxImages = MAX_IMAGES_PER_ENTITY,
  accept = 'image/*',
  multiple = true,
}) => {
  const isDisabled = images.length + fileSelected.length >= maxImages || disabled;

  if (iconFotoCamera) {
    return (
      <Tooltip title="UPLOAD" arrow>
        <span>
          <IconButton
            color="primary"
            disabled={isDisabled}
            aria-label="Upload images"
            component="label"
            sx={CUSTOM_FILE_UPLOAD_ICON_BUTTON_SX}
          >
            <input
              hidden
              accept={accept}
              multiple={multiple}
              type="file"
              onChange={handleFilesChange}
              disabled={isDisabled}
            />
            <UploadIcon fontSize="large" />
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  return (
    <Box sx={CUSTOM_FILE_UPLOAD_BUTTON_CONTAINER_SX}>
      <Button variant="contained" component="label" disabled={isDisabled} sx={CUSTOM_FILE_UPLOAD_BUTTON_SX}>
        UPLOAD
        <input
          name="files"
          hidden
          accept={accept}
          multiple={multiple}
          type="file"
          onChange={handleFilesChange}
          disabled={isDisabled}
        />
      </Button>
    </Box>
  );
};

export default CustomFileUploadButton;
