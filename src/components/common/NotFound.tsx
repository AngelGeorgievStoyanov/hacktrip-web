'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import { NOT_FOUND_HOME_BUTTON_SX } from '@/styles/presets/buttons';
import { NOT_FOUND_TITLE_SX, NOT_FOUND_SUBTITLE_SX } from '@/styles/presets/typography';
import styles from './NotFound.module.css';

const COUNTDOWN_START = 10;

export function NotFound() {
  const router = useRouter();
  const [count, setCount] = useState(COUNTDOWN_START);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCount((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    timeoutRef.current = setTimeout(() => {
      router.replace('/');
    }, COUNTDOWN_START * 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [router]);

  function goHome(): void {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    router.replace('/');
  }

  return (
    <main className={styles.page}>
      <Typography component="h3" variant="inherit" sx={NOT_FOUND_TITLE_SX}>
        PAGE NOT FOUND 404
      </Typography>
      <Typography component="h4" variant="inherit" sx={NOT_FOUND_SUBTITLE_SX}>
        WRONG WAY!
      </Typography>
      <div className={styles.content}>
        <Typography component="h3" variant="inherit" sx={NOT_FOUND_TITLE_SX}>
          {count} SECONDS OR CLICK
        </Typography>
        <Box component="button" type="button" onClick={goHome} sx={NOT_FOUND_HOME_BUTTON_SX}>
          HOME
        </Box>
      </div>
    </main>
  );
}
