'use client';

import type { ReactNode } from 'react';
import { Typography } from '@mui/material';
import { WelcomeHeading } from '@/components/common/WelcomeHeading';
import { HOME_HERO_INTRO_SX } from '@/styles/presets/typography';

interface HomeHeroProps {
  /** Server-rendered trips list and share controls. */
  children: ReactNode;
}

/** Homepage introduction using the original responsive welcome heading. */
export function HomeHero({ children }: HomeHeroProps) {
  return (
    <WelcomeHeading>
      <Typography component="p" variant="inherit" sx={HOME_HERO_INTRO_SX}>
        Explore destinations, discover places worth visiting, and find travel inspiration through real
        photos and experiences. Get ideas for your next trip, then share your own routes and
        discoveries with the HackTrip community.
      </Typography>
      {children}
    </WelcomeHeading>
  );
}
