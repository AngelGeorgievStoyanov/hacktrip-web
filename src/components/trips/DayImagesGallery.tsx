'use client';

import { Box } from '@mui/material';
import { SocialObjectPlaceholder } from '@/components/placeholders';
import { ImageGallery } from '@/components/images/ImageGallery';
import type { CommentTarget } from '@/api/comments';
import type { TripGroupDay } from '@/types';
import { DAY_IMAGE_PLACEHOLDER_FRAME_SX } from '@/styles/presets/image-gallery';

interface DayImagesGalleryProps {
  day: TripGroupDay;
  tripCommentTarget: CommentTarget | null;
  toggleTripComments: (target: CommentTarget) => void;
  tripCoverImage?: string | null;
  tripTitle?: string;
}

export function DayImagesGallery({
  day,
  tripCommentTarget,
  toggleTripComments,
  tripCoverImage,
  tripTitle,
}: DayImagesGalleryProps) {
  const dayLabel = day.title ?? `Day ${day.dayNumber}`;

  return day.images.length > 0 ? (
    <ImageGallery
      images={day.images}
      alt={dayLabel}
      preset="gallery"
      variant="grid"
      prioritizeFirstImage
      activeCommentTarget={tripCommentTarget}
      onToggleComments={toggleTripComments}
    />
  ) : (
    <Box sx={DAY_IMAGE_PLACEHOLDER_FRAME_SX}>
      <SocialObjectPlaceholder />
    </Box>
  );
}
