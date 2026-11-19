'use client';

import { useEffect, useRef } from 'react';
import { Box, Dialog, IconButton, Typography } from '@mui/material';
import { AppImage } from './AppImage';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import { LIGHTBOX_SWIPE_THRESHOLD_PX } from '@/constants/images';
import type { ImageDto } from '@/types';
import {
  IMAGE_LIGHTBOX_CLOSE_CONTROL_SX,
  IMAGE_LIGHTBOX_COUNTER_SX,
  IMAGE_LIGHTBOX_DIALOG_PAPER_SX,
  IMAGE_LIGHTBOX_IMAGE_FRAME_SX,
  IMAGE_LIGHTBOX_NEXT_CONTROL_SX,
  IMAGE_LIGHTBOX_PREVIOUS_CONTROL_SX,
  IMAGE_LIGHTBOX_ROOT_SX,
  IMAGE_LIGHTBOX_STAGE_SX,
} from '@/styles/presets/image-gallery';

interface ImageLightboxProps {
  images: readonly ImageDto[];
  index: number | null;
  alt: string;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

export function ImageLightbox({ images, index, alt, onIndexChange, onClose }: ImageLightboxProps) {
  const touchStartX = useRef<number | null>(null);
  const count = images.length;
  const current = index !== null ? images[index] : undefined;

  useEffect(() => {
    if (index === null || count < 2) {
      return;
    }
    const startIndex = index;
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'ArrowRight') {
        onIndexChange((startIndex + 1) % count);
      }
      if (event.key === 'ArrowLeft') {
        onIndexChange((startIndex - 1 + count) % count);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [index, count, onIndexChange]);

  return (
    <Dialog
      open={current !== undefined}
      onClose={onClose}
      fullScreen
      slotProps={{ paper: { sx: IMAGE_LIGHTBOX_DIALOG_PAPER_SX } }}
    >
      <Box
        sx={IMAGE_LIGHTBOX_ROOT_SX}
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0].clientX;
        }}
        onTouchEnd={(event) => {
          const startX = touchStartX.current;
          touchStartX.current = null;
          if (startX === null || index === null || count < 2) {
            return;
          }
          const delta = event.changedTouches[0].clientX - startX;
          if (Math.abs(delta) < LIGHTBOX_SWIPE_THRESHOLD_PX) {
            return;
          }
          onIndexChange(delta < 0 ? (index + 1) % count : (index - 1 + count) % count);
        }}
      >
        {current && index !== null ? (
          <>
            <IconButton
              aria-label="Close image"
              onClick={onClose}
              sx={IMAGE_LIGHTBOX_CLOSE_CONTROL_SX}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="caption" sx={IMAGE_LIGHTBOX_COUNTER_SX}>
              {index + 1} / {count}
            </Typography>
            {count > 1 ? (
              <>
                <IconButton
                  aria-label="Previous image"
                  onClick={() => onIndexChange((index - 1 + count) % count)}
                  sx={IMAGE_LIGHTBOX_PREVIOUS_CONTROL_SX}
                >
                  <ChevronLeftIcon />
                </IconButton>
                <IconButton
                  aria-label="Next image"
                  onClick={() => onIndexChange((index + 1) % count)}
                  sx={IMAGE_LIGHTBOX_NEXT_CONTROL_SX}
                >
                  <ChevronRightIcon />
                </IconButton>
              </>
            ) : null}
            <Box sx={IMAGE_LIGHTBOX_STAGE_SX}>
              <Box sx={IMAGE_LIGHTBOX_IMAGE_FRAME_SX}>
                <AppImage src={current.url} alt={alt} preset="lightbox" sizes="100vw" />
              </Box>
            </Box>
          </>
        ) : null}
      </Box>
    </Dialog>
  );
}
