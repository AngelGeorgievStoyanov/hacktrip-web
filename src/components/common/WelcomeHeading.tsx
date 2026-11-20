'use client';

import { useRef, type ReactNode } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { ScrambleHeading, type ScrambleHeadingHandle } from '@/components/common/ScrambleHeading';
import { BREAKPOINTS, minWidthQuery } from '@/constants/ui';
import { SCRAMBLE_HEADING_SX } from '@/styles/presets/typography';



interface WelcomeHeadingProps {
  /**
   * Content rendered below the heading. It shares the legacy page-wide touch area, so a
   * touch anywhere in it re-triggers the scramble, exactly like the home page.
   */
  children?: ReactNode;
}

/**
 * Client Component reproducing the home page welcome heading.
 *
 * The home page keeps the whole "Welcome in Hack Trip!" heading on one line above the
 * `homeHeading` breakpoint and splits it into "Welcome in" / "Hack Trip!" below it, and
 * re-triggers the scramble from a touch anywhere on the page.
 */
export function WelcomeHeading({ children }: WelcomeHeadingProps) {
  const headingRef = useRef<ScrambleHeadingHandle | null>(null);
  const singleLineHeading = useMediaQuery(minWidthQuery(BREAKPOINTS.homeHeading));

  return (
    <Box
      onTouchStart={() => headingRef.current?.scramble()}
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0 25px',
          marginBottom: '16px',
        }}
      >
        {singleLineHeading ? (
          <ScrambleHeading ref={headingRef} text="Welcome in Hack Trip!" />
        ) : (
          <>
            <Box component="h1" sx={SCRAMBLE_HEADING_SX}>Welcome in</Box>
            <ScrambleHeading ref={headingRef} text="Hack Trip!" />
          </>
        )}
      </Box>
      {children}
    </Box>
  );
}
