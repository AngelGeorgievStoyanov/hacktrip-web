'use client';

import { useState } from 'react';
import { Box } from '@mui/material';
import { AppImage } from './AppImage';
import { ImageLightbox } from './ImageLightbox';
import { EngagementBar } from '@/components/social/EngagementBar';
import { SocialConfigStatus } from '@/components/social/SocialConfigStatus';
import { useSocialConfig } from '@/hooks/useSocialConfig';
import type { CommentTarget } from '@/api/comments';
import type { ImagePresetName } from '@/constants/images/presets';
import type { SocialImageDto } from '@/types';
import styles from './ImageGallery.module.css';

interface ImageGalleryProps {
  images: SocialImageDto[];
  alt: string;
  preset?: ImagePresetName;
  leadPreset?: ImagePresetName;
  variant?: 'row' | 'stack' | 'grid';
  activeCommentTarget: CommentTarget | null;
  onToggleComments: (target: CommentTarget) => void;
  prioritizeFirstImage?: boolean;
}

export function ImageGallery({
  images,
  alt,
  preset = 'gallery',
  leadPreset,
  variant = 'row',
  activeCommentTarget,
  onToggleComments,
  prioritizeFirstImage = false,
}: ImageGalleryProps) {
  const [index, setIndex] = useState<number | null>(null);
  const socialConfig = useSocialConfig();

  if (images.length === 0) {
    return null;
  }

  const galleryClassName = [
    styles.gallery,
    variant === 'grid' ? styles.grid : '',
    variant === 'grid'
      ? images.length === 1
        ? styles.gridColumns1
        : images.length === 2
          ? styles.gridColumns2
          : styles.gridColumns3
      : '',
    variant === 'stack' ? styles.stack : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <SocialConfigStatus isLoading={socialConfig.isLoading} error={socialConfig.error} />
      <Box className={galleryClassName}>
        {images.map((image, position) => {
          const imageTarget: CommentTarget = { type: 'image', imageId: image.id };
          const isImageOpen =
            activeCommentTarget?.type === 'image' && activeCommentTarget.imageId === image.id;
          return (
            <Box
              key={image.id}
              className={`${styles.item} ${variant === 'grid' ? styles.gridItem : ''}`}
            >
              <Box
                className={`${styles.imageContainer} ${variant === 'grid' ? styles.gridImageContainer : ''}`}
              >
                <Box
                  component="button"
                  type="button"
                  onClick={() => setIndex(position)}
                  aria-label={`Open image ${position + 1} of ${images.length}: ${alt}`}
                  className={`${styles.imageButton} ${variant === 'grid' ? styles.gridImageButton : ''}`}
                >
                  <AppImage
                    image={image}
                    alt={alt}
                    preset={
                      variant === 'grid'
                        ? 'galleryGrid'
                        : position === 0 && leadPreset
                          ? leadPreset
                          : preset
                    }
                    fill={variant === 'grid'}
                    priority={prioritizeFirstImage && position === 0}
                    loading={prioritizeFirstImage && position === 0 ? 'eager' : undefined}
                    fetchPriority={prioritizeFirstImage && position === 0 ? 'high' : undefined}
                  />
                </Box>
                <EngagementBar
                  targetType="image"
                  targetId={image.id}
                  social={image.social}
                  commentTarget={imageTarget}
                  showConfigStatus={false}
                  presentation="overlay"
                  size="small"
                  commentsOpen={isImageOpen}
                  onToggleComments={() => onToggleComments(imageTarget)}
                />
              </Box>
            </Box>
          );
        })}
      </Box>
      <ImageLightbox
        images={images}
        index={index}
        alt={alt}
        onIndexChange={setIndex}
        onClose={() => setIndex(null)}
      />
    </>
  );
}
