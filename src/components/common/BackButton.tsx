'use client';

import { Button, type ButtonProps } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { BUTTON_STYLES } from '@/styles/presets/buttons';

export type BackButtonProps = Omit<ButtonProps, 'variant' | 'color'>;

/** Shared visual treatment for navigation Back actions. Navigation stays caller-owned. */
export function BackButton({ children, sx, ...props }: BackButtonProps) {
  const mergedSx = [
    ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
    BUTTON_STYLES.back,
  ] as SxProps<Theme>;

  return (
    <Button variant="contained" {...props} sx={mergedSx}>
      {children ?? 'BACK'}
    </Button>
  );
}
