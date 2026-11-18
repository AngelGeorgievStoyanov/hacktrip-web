'use client';

import type { ReactNode } from 'react';
import { Typography } from '@mui/material';
import { WelcomeHeading } from '@/components/common/WelcomeHeading';
import { HOME_INTRO_SX } from '@/styles/presets/typography';

interface HomeHeroProps {
  /** Server-rendered trips list and share controls. */
  children: ReactNode;
}

/** Homepage introduction using the original responsive welcome heading. */
export function HomeHero({ children }: HomeHeroProps) {
  return (
    <WelcomeHeading>
      <Typography component="p" variant="inherit" sx={[HOME_INTRO_SX, { maxWidth: 850 }]}>
        Discover places worth visiting, explore photos and experiences shared by others, and share
        your own discoveries with the HackTrip community.
      </Typography>
      {children}
    </WelcomeHeading>
  );
}
