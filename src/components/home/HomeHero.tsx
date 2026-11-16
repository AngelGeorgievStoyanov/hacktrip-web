'use client';

import type { ReactNode } from 'react';
import { WelcomeHeading } from '@/components/common/WelcomeHeading';
import { HOME_INTRO_STYLE } from '@/styles/presets/typography';

interface HomeHeroProps {
  /** Server-rendered trips list and share controls. */
  children: ReactNode;
}

/** Homepage introduction using the original responsive welcome heading. */
export function HomeHero({ children }: HomeHeroProps) {
  return (
    <WelcomeHeading>
      <p style={{ ...HOME_INTRO_STYLE, maxWidth: 850 }}>
        Discover places worth visiting, explore photos and experiences shared by others, and share
        your own discoveries with the HackTrip community.
      </p>
      {children}
    </WelcomeHeading>
  );
}
