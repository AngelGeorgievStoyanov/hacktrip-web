'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Alert, Box, Button, CircularProgress, Container, Typography } from '@mui/material';
import { tripApi } from '@/api/trips';
import { TripList } from '@/components/trips/TripList';
import { getGenericErrorMessage } from '@/lib/errors';
import { BUTTON_STYLES } from '@/styles/presets/buttons';
import { ACCOUNT_TRIPS_CONTENT_SX, ACCOUNT_TRIPS_ACCOUNT_TRIPS_EMPTY_STATE_SX, ACCOUNT_TRIPS_ACCOUNT_TRIPS_HEADING_SX, ACCOUNT_TRIPS_ACCOUNT_TRIPS_PAGE_SX } from '@/styles/presets/layouts';

export default function MyTripsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['me', 'trips'],
    queryFn: () => tripApi.listMyTrips(),
  });

  const trips = data ?? [];

  return (
    <Box component="section" sx={PAGE_SX}>
      <Container maxWidth="lg" sx={CONTENT_SX}>
        <Typography variant="h4" component="h1" sx={HEADING_SX}>
          These are your trips
        </Typography>

        {isLoading ? (
          <CircularProgress size={32} sx={{ my: 4 }} aria-label="Loading your trips" />
        ) : error ? (
          <Alert severity="error" sx={{ width: '100%', maxWidth: 560 }}>
            {getGenericErrorMessage(error)}
          </Alert>
        ) : trips.length === 0 ? (
          <Box sx={EMPTY_STATE_SX}>
            <Typography variant="h5" component="p" sx={headingTextStyle}>
              You dont&apos;t have a published trip yet.
            </Typography>
            <Button
              component={Link}
              href="/trips/create"
              variant="contained"
              sx={BUTTON_STYLES.createTrip}
            >
              CLICK HERE AN ADD YOUR FIRST TRIP
            </Button>
          </Box>
        ) : (
          <TripList trips={trips} />
        )}
      </Container>
    </Box>
  );
}
