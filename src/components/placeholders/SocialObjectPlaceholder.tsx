'use client';

import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { SOCIAL_OBJECT_PLACEHOLDERS } from './socialObjectPlaceholderAssets';
import styles from './SocialObjectPlaceholder.module.css';
import {
  SOCIAL_OBJECT_PLACEHOLDER_DESCRIPTION_SX,
  SOCIAL_OBJECT_PLACEHOLDER_OVERLAY_SX,
  SOCIAL_OBJECT_PLACEHOLDER_ROOT_SX,
  SOCIAL_OBJECT_PLACEHOLDER_TITLE_SX,
} from '@/styles/presets/social-object-placeholder';

/**
 * Random decorative SVG for social objects without uploaded photos.
 * Only the selected SVG is requested by the browser.
 */
export function SocialObjectPlaceholder() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * SOCIAL_OBJECT_PLACEHOLDERS.length);
    setImageSrc(SOCIAL_OBJECT_PLACEHOLDERS[randomIndex] ?? SOCIAL_OBJECT_PLACEHOLDERS[0]);
  }, []);

  return (
    <Box
      role="img"
      aria-label="Your next adventure. No photos uploaded yet."
      sx={SOCIAL_OBJECT_PLACEHOLDER_ROOT_SX}
    >
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt=""
          aria-hidden="true"
          width={1200}
          height={1200}
          unoptimized
          className={styles.image}
        />
      ) : null}

      <Box sx={SOCIAL_OBJECT_PLACEHOLDER_OVERLAY_SX}>
        <Typography component="span" sx={SOCIAL_OBJECT_PLACEHOLDER_TITLE_SX}>
          Your next adventure
        </Typography>
        <Typography component="span" sx={SOCIAL_OBJECT_PLACEHOLDER_DESCRIPTION_SX}>
          No photos uploaded yet
        </Typography>
      </Box>
    </Box>
  );
}
