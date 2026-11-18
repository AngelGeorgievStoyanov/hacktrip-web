'use client';

import { useQuery } from '@tanstack/react-query';
import { Alert, Box, CircularProgress, Container, Typography } from '@mui/material';
import { tripApi } from '@/api/trips';
import { TripList } from '@/components/trips/TripList';
import { getGenericErrorMessage } from '@/lib/errors';
import { ACCOUNT_TRIPS_CONTENT_SX, ACCOUNT_TRIPS_EMPTY_STATE_SX, ACCOUNT_TRIPS_ERROR_SX, ACCOUNT_TRIPS_HEADING_SX, ACCOUNT_TRIPS_LOADING_SX, ACCOUNT_TRIPS_PAGE_SX } from '@/styles/presets/layouts';
import { HEADING_TEXT_SX } from '@/styles/presets/typography';

export default function FavoritesPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['me', 'favorites'],
    queryFn: () => tripApi.listMyFavorites(),
  });

  const trips = data ?? [];

  return (
    <Box component="section" sx={ACCOUNT_TRIPS_PAGE_SX}>
      <Container maxWidth="lg" sx={ACCOUNT_TRIPS_CONTENT_SX}>
        <Typography variant="h4" component="h1" sx={ACCOUNT_TRIPS_HEADING_SX}>
          These are your favorites trips
        </Typography>

        {isLoading ? (
          <CircularProgress size={32} sx={ACCOUNT_TRIPS_LOADING_SX} aria-label="Loading your favorite trips" />
        ) : error ? (
          <Alert severity="error" sx={ACCOUNT_TRIPS_ERROR_SX}>
            {getGenericErrorMessage(error)}
          </Alert>
        ) : trips.length === 0 ? (
          <Box sx={ACCOUNT_TRIPS_EMPTY_STATE_SX}>
            <Typography variant="h5" component="p" sx={HEADING_TEXT_SX}>
              You dont&apos;t have a favorites trip yet.
            </Typography>
          </Box>
        ) : (
          <TripList trips={trips} />
        )}
      </Container>
    </Box>
  );
}
