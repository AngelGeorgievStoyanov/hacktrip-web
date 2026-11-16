'use client';

import { Alert, Box, CircularProgress } from '@mui/material';
import { UI_SIZES } from '@/constants/ui/sizes';
import { getGenericErrorMessage } from '@/lib/errors';

interface SocialConfigStatusProps {
  isLoading: boolean;
  error: Error | null;
}

export function SocialConfigStatus({ isLoading, error }: SocialConfigStatusProps) {
  if (isLoading) {
    return (
      <Box
        role="status"
        aria-label="Loading social actions"
        sx={{ display: 'inline-flex', p: 0.5 }}
      >
        <CircularProgress size={UI_SIZES.smallIndicator} />
      </Box>
    );
  }

  return error ? <Alert severity="error">{getGenericErrorMessage(error)}</Alert> : null;
}
