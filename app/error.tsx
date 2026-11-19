'use client';

import { Alert, Box, Button, Typography } from '@mui/material';
import { BUTTON_STYLES } from '@/styles/presets/buttons';
import { GLOBAL_ERROR_PAGE_SX } from '@/styles/presets/feedback';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalRouteError({ reset }: ErrorProps) {
  return (
    <Box sx={GLOBAL_ERROR_PAGE_SX}>
      <Typography variant="h4" component="h1">
        Something went wrong
      </Typography>
      <Alert severity="error">An unexpected error occurred. Please try again.</Alert>
      <Button variant="contained" sx={BUTTON_STYLES.primary} onClick={reset}>
        Try again
      </Button>
    </Box>
  );
}
